import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './WalletConnectModal.css';

/* helpers */
const initials = n => (n||'').trim().split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
const COLORS   = ['#7c3aed','#059669','#dc2626','#d97706','#2563eb'];
const avColor  = n => COLORS[((n||'').charCodeAt(0)||65) % COLORS.length];

/**
 * WalletConnectModal
 * Props:
 *  - isOpen        boolean
 *  - onClose       fn
 *  - astrologer    { name, profile_img, per_min_chat, avg_rate, category[], is_online }
 *  - walletBalance number  (rupees in user wallet)
 *  - mode          'chat' | 'call'  (default 'chat')
 *  - onConnect     fn  (called when user clicks Connect Now)
 *  - onRecharge    fn  (optional — overrides default navigate to /wallet)
 */
const WalletConnectModal = ({
  isOpen, onClose, astrologer = {}, walletBalance = 0,
  mode = 'chat', onConnect, onRecharge,
}) => {
  const navigate = useNavigate();

  const perMin = Number(astrologer.per_min_chat || 5);
  // Max minutes user can afford with current balance
  const maxMinutes = useMemo(
    () => (perMin > 0 ? Math.floor(walletBalance / perMin) : 0),
    [walletBalance, perMin]
  );
  // Insufficient if less than 5 minutes
  const insufficient = maxMinutes < 5;
  const cats = astrologer.category?.map(c => c.name) || [];
  const isOnline = astrologer.is_online == 1;

  const handleConnect  = () => { onConnect ? onConnect(mode) : null; };
  const handleRecharge = () => { onRecharge ? onRecharge() : navigate('/wallet'); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="wc-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}>
          <motion.div className="wc-box"
            initial={{ opacity: 0, scale: .92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .92, y: 10 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            onClick={e => e.stopPropagation()}>

            {/* Close */}
            <button className="wc-close" onClick={onClose}><i className="fas fa-times" /></button>

            {/* Header — astrologer profile */}
            <div className="wc-head">
              <div className="wc-av-wrap">
                <div className="wc-av-clip">
                  {astrologer.profile_img
                    ? <img src={astrologer.profile_img} alt={astrologer.name}
                        onError={e => { e.target.style.display = 'none'; }} />
                    : <div className="wc-av-init"
                        style={{ background:`linear-gradient(135deg,${avColor(astrologer.name)},${avColor(astrologer.name)}99)` }}>
                        {initials(astrologer.name)}
                      </div>
                  }
                </div>
                <span className={`wc-av-dot ${isOnline ? 'on' : 'off'}`} />
              </div>
              <div className="wc-head-info">
                <div className="wc-name">{astrologer.name || 'Astrologer'}</div>
                <div className="wc-rating">
                  <i className="fas fa-star" />
                  <span>{parseFloat(astrologer.avg_rate || 4.9).toFixed(1)}</span>
                  <span className="wc-cats">{cats.slice(0, 2).join(' • ') || 'Vedic Astrology'}</span>
                </div>
                <div className="wc-rate">
                  <i className={`fas fa-${mode === 'call' ? 'phone' : 'comment-dots'}`} />
                  ₹{perMin}/min · {mode === 'call' ? 'Voice Call' : 'Chat'}
                </div>
              </div>
            </div>

            {/* Wallet balance card */}
            <div className="wc-wallet">
              <div className="wc-wallet-row">
                <div className="wc-wallet-left">
                  <div className="wc-wallet-ico"><i className="fas fa-wallet" /></div>
                  <div>
                    <div className="wc-wallet-lbl">Wallet Balance</div>
                    <div className="wc-wallet-amt">₹{Number(walletBalance).toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <button className="wc-add-btn" onClick={handleRecharge}>
                  <i className="fas fa-plus" /> Add
                </button>
              </div>

              {/* Max duration meter */}
              <div className="wc-duration">
                <div className="wc-duration-head">
                  <span><i className="far fa-clock" /> Max Duration</span>
                  <span className={`wc-duration-val${insufficient ? ' low' : ''}`}>
                    {maxMinutes} min
                  </span>
                </div>
                <div className="wc-bar">
                  <div className={`wc-bar-fill${insufficient ? ' low' : ''}`}
                    style={{ width: `${Math.min((maxMinutes / 30) * 100, 100)}%` }} />
                </div>
                <div className="wc-duration-note">
                  {insufficient
                    ? <span className="wc-warn"><i className="fas fa-exclamation-circle" /> Minimum 5 minutes balance required to connect.</span>
                    : <span className="wc-ok"><i className="fas fa-check-circle" /> You have enough balance to connect.</span>
                  }
                </div>
              </div>
            </div>

            {/* Action button */}
            {insufficient ? (
              <button className="wc-btn wc-btn-recharge" onClick={handleRecharge}>
                <i className="fas fa-bolt" /> Recharge Now
              </button>
            ) : (
              <button className="wc-btn wc-btn-connect" onClick={handleConnect}>
                <i className={`fas fa-${mode === 'call' ? 'phone' : 'comment-dots'}`} /> Connect Now
              </button>
            )}

            {/* Footer note */}
            <div className="wc-foot">
              <i className="fas fa-shield-alt" /> Secure & private session · Pay per minute
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletConnectModal;
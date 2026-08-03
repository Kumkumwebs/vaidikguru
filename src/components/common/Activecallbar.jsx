import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudioCall } from '../../context/AudioCallContext';
import { callStatusUpdate } from '../../services/liveService';

const fmt = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
};
const initials = (n) =>
  (n || '').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();

/**
 * ActiveCallBar
 * Mount once inside <Router> (outside <Routes>). Shows a floating pill whenever
 * an audio call is active AND minimized, letting the user hop back to the call
 * from any page — the "go back = popup stays active" behavior.
 */
const ActiveCallBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ctx = useAudioCall();
  const { callStatus, callInfo, elapsedSeconds, isMinimized } = ctx;

  const onCallScreen = pathname.startsWith('/consultation/call');
  const visible =
    isMinimized &&
    !onCallScreen &&
    callInfo &&
    callStatus !== 'idle' &&
    callStatus !== 'ended';

  if (!visible) return null;

  const label =
    callStatus === 'connected' ? 'Call in progress' :
    callStatus === 'on_hold' ? 'On hold' :
    'Connecting…';
  const dotColor = callStatus === 'connected' ? '#16a34a' : '#d97706';

  const handleReturn = () => {
    ctx.maximize();
    navigate(`/consultation/call/${callInfo.astrologerId}`, {
      state: {
        channelId: callInfo.channelId,
        astrologer_id: callInfo.astrologerId,
        astroName: callInfo.astroName,
        astrologerImage: callInfo.astroImage,
        rate: callInfo.rate,
        wallet: callInfo.wallet,
      },
    });
  };

  const handleEnd = async (e) => {
    e.stopPropagation();
    try { await callStatusUpdate(callInfo.channelId, 'end_user'); } catch { /* silent */ }
    ctx.endCall();
  };

  return (
    <div
      onClick={handleReturn}
      style={{
        position: 'fixed', bottom: 20, right: 20, zIndex: 9998,
        display: 'flex', alignItems: 'center', gap: 12,
        background: '#fff', borderRadius: 40, padding: '8px 8px 8px 12px',
        boxShadow: '0 12px 34px rgba(123,26,58,0.28)',
        border: '1px solid #f1d7de', cursor: 'pointer', maxWidth: 320,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#7b1a3a,#7b1a3a99)', color: '#fff', fontWeight: 700,
        position: 'relative',
      }}>
        {callInfo.astroImage
          ? <img src={callInfo.astroImage} alt={callInfo.astroName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }} />
          : initials(callInfo.astroName)}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {callInfo.astroName}
        </div>
        <div style={{ fontSize: 11.5, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
          {label} · {fmt(elapsedSeconds)}
        </div>
      </div>

      <button
        onClick={handleEnd}
        title="End call"
        style={{
          width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0,
          background: '#dc2626', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <i className="fas fa-phone-slash" />
      </button>
    </div>
  );
};

export default ActiveCallBar;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideMenu from '../components/layout/SideMenu';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import ScrollTop from '../components/common/ScrollTop';
import NewAppDownloadModal from '../components/common/NewAppDownloadModel';
import WalletConnectModal from '../components/common/WalletConnectModal';
import UserDetailsModal from '../components/common/UserDetailsModal';
import SendGiftModal from "./Sendgiftmodal";
import apiService from '../services/apiServices';
import './AstrologerDetail.css';

/* helpers */
const initials = n => (n || '').trim().split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb'];
const avColor = n => COLORS[((n || '').charCodeAt(0) || 65) % COLORS.length];

// Converts "2025-06-23 16:35:17" style API dates into "5 days ago"
const timeAgo = dateStr => {
  if (!dateStr) return '';
  const then = new Date(dateStr.replace(' ', 'T'));
  if (isNaN(then.getTime())) return '';
  const diffMs = Date.now() - then.getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
};

// ── Gifts: emoji fallback + static list (shown until get_gifts loads / if it fails)
const GIFT_EMOJI = {
  rose: '🌹', 'fruits basket': '🧺', diya: '🪔', 'puja samagri': '🍱',
  'blessings shawl': '🧣', 'premium gift': '🎁',
  flowers: '🌹', namaste: '🙏', dakshina: '💰', 'pooja thali': '🍱',
  kalash: '🪔', gemstone: '💎', sweets: '🍬', shivling: '🛕',
};
const emojiFor = t => GIFT_EMOJI[(t || '').trim().toLowerCase()] || '🎁';

const STATIC_GIFTS = [
  { _id: 'rose', title: 'Rose', price: 51, image: '/assets/img/gift/rose.png', emoji: '🌹' },
  { _id: 'fruits', title: 'Fruits Basket', price: 101, image: '/assets/img/gift/fruits.png', emoji: '🧺' },
  { _id: 'diya', title: 'Diya', price: 251, image: '/assets/img/gift/diya.png', emoji: '🪔' },
  { _id: 'puja', title: 'Puja Samagri', price: 501, image: '/assets/img/gift/puja.png', emoji: '🍱' },
  { _id: 'shawl', title: 'Blessings Shawl', price: 751, image: '/assets/img/gift/shawl.png', emoji: '🧣' },
  { _id: 'premium', title: 'Premium Gift', price: 1100, image: '/assets/img/gift/gift.png', emoji: '🎁' },
];

const Stars = ({ val = 5 }) => (
  <span className="ad-pc-stars">
    {[1, 2, 3, 4, 5].map(i => (
      <i key={i} className={`fa${i <= Math.round(val) ? 's' : 'r'} fa-star`} style={{ fontSize: 13 }} />
    ))}
  </span>
);
const RevStars = ({ val = 5 }) => (
  <div className="ad-rev-stars">
    {[1, 2, 3, 4, 5].map(i => (
      <i key={i} className={`fa${i <= Math.round(val) ? 's' : 'r'} fa-star`} />
    ))}
  </div>
);
const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="ad-faq-item" onClick={() => setOpen(o => !o)}>
      <div className="ad-faq-q">{q}<i className={`fas fa-chevron-${open ? 'up' : 'down'}`} /></div>
      {open && <div className="ad-faq-a">{a}</div>}
    </div>
  );
};

/* View All Popup */
const ViewAllPopup = ({ title, onClose, children }) => (
  <AnimatePresence>
    <motion.div className="ad-popup-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.div className="ad-popup-box"
        initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .95 }}
        transition={{ duration: .2 }}
        onClick={e => e.stopPropagation()}>
        <div className="ad-popup-head">
          <h5>{title}</h5>
          <button className="ad-popup-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>
        <div className="ad-popup-body">{children}</div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// Used only when the API genuinely returns no similar_astrologers
const FALLBACK_SIMILAR = [
  { id: 'f1', name: 'Guru Dayal Ji', avg_rate: 4.8, total_review: 80, per_min_chat: 20, profile_img: '' },
  { id: 'f2', name: 'Acharya Ajay', avg_rate: 4.9, total_review: 120, per_min_chat: 12, profile_img: '' },
  { id: 'f3', name: 'Acharya Ruchi', avg_rate: 4.9, total_review: 95, per_min_chat: 15, profile_img: '' },
  { id: 'f4', name: 'Acharya Vaidhik', avg_rate: 4.8, total_review: 60, per_min_chat: 18, profile_img: '' },
];

// Used only when the API returns no rating/review entries
const REVIEWS_FALLBACK = [
  { name: 'Ritika Sharma', av: '/assets/img/user/user1.jpg', time: '5 days ago', stars: 5, text: 'Acharya ji predicted my situation so accurately and guided me in the right direction. My marriage issue got resolved. Really blessed!', tag: 'Marriage Consultation', helpful: 125 },
  { name: 'Ankit Verma', av: '/assets/img/user/user2.jpg', time: '1 week ago', stars: 5, text: 'His guidance helped me in my career decision. Very humble and knowledgeable person. Highly recommended!', tag: 'Career Consultation', helpful: 98 },
  { name: 'Neha Kapoor', av: '/assets/img/user/user3.jpg', time: '2 weeks ago', stars: 5, text: 'Thank you Acharya ji for your accurate predictions and simple solutions. My confidence has improved a lot.', tag: 'Love & Relationship', helpful: 76 },
];

const DEFAULT_SKILLS = ['Vedic Astrology', 'Numerology', 'Palm Reading', 'Kundli Matching', 'Career Guidance', 'Love Problem', 'Business Growth', 'Vastu Consultation', 'Gemstone Suggestion', 'Prashna Kundli'];

/* ══════════ MAIN ══════════ */
const AstrologerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const galleryRef = useRef(null);

  const [astro, setAstro] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [walletModal, setWalletModal] = useState(null); // null | 'chat' | 'call'
  const [walletBalance, setWalletBalance] = useState(0);
  const [detailsModal, setDetailsModal] = useState(null); // null | 'chat' | 'call'
  const [popup, setPopup] = useState(null); // 'gallery'|'reviews'|'skills'
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showGift, setShowGift] = useState(false); // Send Gift modal
  const [giftList, setGiftList] = useState(STATIC_GIFTS); // sidebar gifts (API-backed)
  const [giftImgErr, setGiftImgErr] = useState({}); // { [giftId]: true }
  const [sendingGiftId, setSendingGiftId] = useState(null); // gift currently being sent
  const [sentGift, setSentGift] = useState(null); // last successfully sent gift (shows success popup)
  const [giftError, setGiftError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.postBearer(
        'https://admin.diviniq.in/user_api/astrologer_profile',
        { id: id }
      );
      if (res?.results?.length) {
        // API returns astrologer objects keyed by "id" (not "_id")
        const found = res.results.find(a => String(a.id) === String(id) || String(a._id) === String(id));
        const target = found || res.results[0];
        setAstro(target);

        // The API already gives curated similar astrologers per-profile —
        // no need to derive them by filtering the results list.
        setSimilar(Array.isArray(target.similar_astrologers) ? target.similar_astrologers : []);
      }
      // Wallet balance comes from get_profile → results.wallet (or results_web.wallet)
      try {
        const w = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
        setWalletBalance(Number(w?.results?.wallet ?? w?.results_web?.wallet ?? w?.wallet ?? 0));
      } catch (_) { setWalletBalance(0); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // Load the blessings gifts from the API (falls back to STATIC_GIFTS)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await apiService.getBearer('https://admin.diviniq.in/user_api/get_gifts');
        // Backend may return the list under `data`, `results`, or at the root.
        const arr = resp?.data ?? resp?.results ?? (Array.isArray(resp) ? resp : []);
        if (!cancelled && Array.isArray(arr) && arr.length > 0) {
          setGiftList(arr.map(g => ({
            _id: g._id,           // keep the REAL server id — this is what gift_transaction needs
            title: g.title,
            price: g.price,
            image: g.image,
            emoji: emojiFor(g.title),
          })));
        }
      } catch (_) {
        // keep STATIC_GIFTS
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Quick-send: clicking a gift tile in the sidebar sends it immediately,
  // without opening the full SendGiftModal.
  const handleQuickSendGift = async (gift) => {
    if (sendingGiftId) return; // already sending one
    const astroId = astro?.id || astro?._id;
    if (!astroId) return;
    setSendingGiftId(gift._id);
    setGiftError("");
    console.log('[QuickSendGift] payload:', { to: astroId, giftId: gift._id, amount: gift.price, isStaticFallbackId: typeof gift._id === 'string' && !/^[a-f0-9]{24}$/i.test(gift._id) });
    try {
      const res = await apiService.postBearer(
        'https://admin.diviniq.in/user_api/gift_transaction',
        { to: String(astroId), giftId: String(gift._id), amount: Number(gift.price), type: 'normal' }
      );
      if (res?.status === false) {
        setGiftError(res?.message || 'Could not send the gift. Please try again.');
      } else {
        setSentGift(gift);
      }
    } catch (err) {
      console.error('[QuickSendGift] error:', err);
      setGiftError('Could not send the gift. Please try again.');
    } finally {
      setSendingGiftId(null);
    }
  };

  const scrollGallery = dir => {
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="main-wrapper">
      <Header onMenuToggle={() => setShowMobileMenu(true)} onSideMenuToggle={() => setShowSideMenu(true)} onSearchToggle={() => setShowSearch(true)} />
      <div className="ad-body"><div className="container">
        <div className="row g-4">
          <div className="col-lg-8">
            <div style={{ background: '#fff', borderRadius: 16, padding: 22, marginBottom: 14 }}>
              <div className="d-flex gap-3">
                <div className="ad-sk" style={{ width: 108, height: 108, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>{[55, 35, 80, 65, 50].map((w, i) => <div key={i} className="ad-sk mb-2" style={{ height: 13, width: `${w}%` }} />)}</div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
              {[50, 100, 100, 100].map((w, i) => <div key={i} className="ad-sk mb-3" style={{ height: i === 0 ? 32 : 44, borderRadius: 12, width: `${w}%` }} />)}
            </div>
          </div>
        </div>
      </div></div>
      <Footer />
    </div>
  );

  if (!astro) return (
    <div className="main-wrapper">
      <Header />
      <div className="text-center py-5"><p>Astrologer not found.</p><Link to="/astrologer">Browse All</Link></div>
      <Footer />
    </div>
  );

  // "Online" = any channel currently on, independent of is_busy (which just means occupied on a session)
  const isOnline = astro.is_chat_online === 'on' || astro.is_voice_online === 'on' || astro.is_video_online === 'on';
  const cats = astro.category?.map(c => c.name) || [];
  const langs = astro.language?.map(l => l.name).join(', ') || 'Hindi, English';
  const price = astro.per_min_chat || 5;
  const rating = parseFloat(astro.avg_rate || 4.9);
  const totalReviewCount = astro.total_rating ?? astro.rating_total_person ?? 0;
  const totalConsultations = astro.consult || astro.total_orders || '25,000';

  const SKILLS = (astro.skill && astro.skill.length > 0)
    ? astro.skill.map(s => (s.name || '').trim()).filter(Boolean)
    : DEFAULT_SKILLS;

  const FAQS = [
    { q: `How can I consult ${astro.name}?`, a: 'Click Chat Now or Call Now to connect instantly.' },
    { q: 'Is my personal information kept private?', a: 'Yes, 100%. All data is encrypted and never shared.' },
    { q: 'What details do I need to provide?', a: 'Basic birth details — name, date, time & place of birth.' },
    { q: 'Can I get remedies for my problems?', a: `Yes, ${astro.name} provides personalized remedies based on your Kundli.` },
    { q: 'What if the call gets disconnected?', a: 'You can reconnect anytime and continue the session.' },
    { q: 'Which languages are supported?', a: `${astro.name} consults in ${langs}.` },
  ];
  const TRUST = [
    { ic: 'fas fa-check-circle', t: '100% Privacy Guaranteed' },
    { ic: 'fas fa-lock', t: 'Secure Payments' },
    { ic: 'fas fa-user-check', t: 'Verified Astrologer' },
    { ic: 'fas fa-headset', t: '24/7 Customer Support' },
  ];

  // astro.galary mixes images and .mp4 clips — split them out
  const galaryFiles = (astro.galary || []).map(g => g.file).filter(Boolean);
  const galaryImages = galaryFiles.filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f));
  const galaryVideos = galaryFiles.filter(f => /\.mp4$/i.test(f));
  const GALLERY_IMGS = galaryImages.length > 0
    ? galaryImages
    : [1, 2, 3, 4, 5, 6, 7, 8].map(() => astro.profile_img || '/assets/img/team/team_1_1.jpg');
  const introVideo = galaryVideos[0] || null;

  const simList = similar.length > 0 ? similar : FALLBACK_SIMILAR;

  const reviewsSource = (astro.rating && astro.rating.length > 0)
    ? astro.rating.map(r => ({
      name: (r.name || '').trim() || 'Anonymous',
      av: r.profile_img || '/assets/img/user/user1.jpg',
      time: timeAgo(r.Created_date),
      stars: r.rating || 5,
      text: r.review || r.astr_comment || 'No written feedback provided.',
      tag: 'Consultation',
      helpful: 0,
    }))
    : REVIEWS_FALLBACK;

  return (
    <div className="main-wrapper ad-page" style={{ paddingTop: 0, marginTop: 0 }}>
      <ScrollTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <Header onMenuToggle={() => setShowMobileMenu(true)} onSideMenuToggle={() => setShowSideMenu(true)} onSearchToggle={() => setShowSearch(true)} />

      {/* Breadcrumb */}
      <div className="ad-breadcrumb">
        <div className="container">
          <Link to="/">Home</Link><i className="fas fa-angle-right" />
          <Link to="/astrologer">Astrologers</Link><i className="fas fa-angle-right" />
          <span>{astro.name}</span>
        </div>
      </div>

      <div className="ad-body">
        <div className="container">
          <div className="row g-4 align-items-start">

            {/* ══ LEFT ══ */}
            <div className="col-lg-8">

              {/* Profile Card */}
              <motion.div className="ad-profile-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}>
                <div className="d-flex align-items-start gap-3">
                  {/* Avatar column with status below */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content' }}>
                    <div className="ad-av-wrap">
                      <div className="ad-av-clip">
                        {astro.profile_img && !imgErr
                          ? <img src={astro.profile_img} alt={astro.name} onError={() => setImgErr(true)} />
                          : <div className="ad-av-init" style={{ background: `linear-gradient(135deg,${avColor(astro.name)},${avColor(astro.name)}99)` }}>{initials(astro.name)}</div>
                        }
                      </div>
                      {/* <span className={`ad-av-dot ${isOnline ? 'on' : 'off'}`} /> */}
                    </div>
                    {/* Offline/Online status directly below avatar */}
                    <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280', marginTop: '8px', whiteSpace: 'nowrap' }}>
                      {isOnline ? '● Online' : '● Offline'}
                    </div>
                  </div>

                  {/* Info right */}
                  <div className="ad-pc-right">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                      <span className="ad-pc-name">{astro.name}</span>
                      <span className="ad-pc-badge"><i className="fas fa-check-circle" /> Verified Expert</span>
                    </div>
                    <div className="ad-pc-stars-row">
                      <Stars val={rating} />
                      <span className="ad-pc-score">{rating.toFixed(1)}</span>
                      <span className="ad-pc-rcount">({totalReviewCount} Reviews)</span>
                      <span className="ad-pc-pipe">|</span>
                      <span className="ad-pc-consult"><i className="fas fa-sync-alt" />{totalConsultations}+ Consultations</span>
                    </div>
                    <div className="ad-pc-meta">
                      <span className="ad-pc-meta-item"><i className="fas fa-briefcase" />{astro.experience || '5'}+ Years Experience</span>
                      <span className="ad-pc-meta-item"><i className="fas fa-map-marker-alt" />From {astro.city || 'India'}</span>
                      <span className="ad-pc-meta-item"><i className="fas fa-language" />Languages: {langs}</span>
                      <span className="ad-pc-meta-item"><i className="fas fa-users" />Followers: {astro.followers || '50K'}+</span>
                    </div>
                    <div className="ad-pc-tags">
                      {cats.slice(0, 6).map((c, i) => <span key={i} className="ad-pc-tag">{c}</span>)}
                      {cats.length > 6 && <span className="ad-pc-tag">+{cats.length - 6} more</span>}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Bar */}
              <div className="ad-stats-bar">
                {[
                  { ic: 'fas fa-medal', val: `${astro.experience || 15}+`, lbl: 'Years Experience' },
                  { ic: 'fas fa-check-circle', val: `${totalConsultations}+`, lbl: 'Orders Completed' },
                  { ic: 'fas fa-sync-alt', val: '87%', lbl: 'Repeat Customers' },
                  { ic: 'fas fa-star', val: '98%', lbl: 'Positive Feedback' },
                ].map(s => (
                  <div key={s.lbl} className="ad-stat">
                    <div className="ad-stat-ico"><i className={s.ic} /></div>
                    <div><div className="ad-stat-val">{s.val}</div><div className="ad-stat-lbl">{s.lbl}</div></div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="ad-card">
                <div className="ad-card-title"><i className="fas fa-user-circle" />About {astro.name}</div>
                <p className="ad-about-p">{astro.about || `${astro.name} is a renowned Vedic Astrologer with more than ${astro.experience || 15} years of experience in Vedic Astrology, Numerology, Vastu Shastra and Spiritual Guidance. He has helped more than ${totalConsultations}+ clients across the globe with accurate predictions and effective remedies.`}</p>
                <p className="ad-about-p">His expertise lies in solving problems related to career, marriage, love, business, health and financial growth.</p>
                <div className="ad-feat-pills">
                  {['Accurate Predictions', 'Personalized Guidance', 'Effective Remedies', '100% Confidential'].map(f => (
                    <span key={f} className="ad-feat-pill"><i className="fas fa-check-circle" />{f}</span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="ad-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="ad-card-title mb-0"><i className="fas fa-star" />Skills & Expertise</div>
                  {/* <button className="btn btn-link p-0" style={{ fontSize: 12, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }} onClick={() => setPopup('skills')}>View All</button> */}
                </div>
                <div className="ad-skills">
                  {SKILLS.map(s => <span key={s} className="ad-skill"><i className="fas fa-circle" />{s}</span>)}
                </div>
              </div>

              {/* Gallery + Video side by side — 65% height */}
              <div className="row g-3 mb-3">
                {/* Gallery — left */}
                <div className="col-lg-6">
                  <div className="ad-card" style={{ marginBottom: 0, height: '65%', display: 'flex', flexDirection: 'column' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="ad-card-title mb-0" style={{ fontSize: '13px', marginBottom: 0 }}><i className="fas fa-images" />Gallery</div>
                      <button className="btn btn-link p-0" style={{ fontSize: 11, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }} onClick={() => setPopup('gallery')}>View All</button>
                    </div>
                    {/* Scrollable gallery with arrows */}
                    <div className="ad-gallery-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <button className="ad-gal-arrow left" onClick={() => scrollGallery(-1)}>
                        <i className="fas fa-chevron-left" />
                      </button>
                      <div className="ad-gallery" ref={galleryRef} style={{ flex: 1 }}>
                        {GALLERY_IMGS.map((src, i) => (
                          <img key={i} className="ad-gal-img" src={src} alt={`Gallery ${i + 1}`}
                            onClick={() => setPopup('gallery')}
                            onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                        ))}
                      </div>
                      <button className="ad-gal-arrow right" onClick={() => scrollGallery(1)}>
                        <i className="fas fa-chevron-right" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video — right */}
                <div className="col-lg-6">
                  <div className="ad-card" style={{ marginBottom: 0, height: '65%', display: 'flex', flexDirection: 'column' }}>
                    <div className="ad-card-title mb-2" style={{ fontSize: '13px', marginBottom: '8px' }}><i className="fas fa-play-circle" />Introduction Video</div>
                    <div className="ad-vid-wrap" style={{ flex: 1 }}>
                      <img src={astro.profile_img || '/assets/img/team/team_1_1.jpg'} alt="intro" style={{ height: '100%' }}
                        onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                      <button className="ad-vid-play"><i className="fas fa-play" /></button>
                    </div>
                    <div className="ad-vid-lbl">▶ Watch Introduction Video</div>
                  </div>
                </div>
              </div>

            </div>

            {/* ══ RIGHT SIDEBAR ══ */}
            <div className="col-lg-4">
              <div className="ad-sticky">
                <div className="ad-fee-card">
                  <div className="ad-fee-lbl">Consultation Fee</div>
                  <div className="ad-fee-row">
                    <span className="ad-fee-amt">₹{price}</span>
                    <span className="ad-fee-unit">/min</span>
                  </div>
                  <div className="ad-avail-row">
                    <span className="ad-avail-dot" />
                    <span className="ad-avail-txt">{astro.is_busy ? 'Busy' : 'Available Now'}</span>
                  </div>
                  <div className="ad-resp-time">Avg. Response Time: &lt; 2 min</div>
                  <button className="ad-btn-chat" onClick={() => setWalletModal('chat')}>
                    <div className="ad-btn-chat-main"><i className="fas fa-comment-dots" style={{ fontSize: 16 }} />Chat Now</div>
                    <div className="ad-btn-chat-sub">Get instant guidance</div>
                  </button>
                  <button className="ad-btn-call" onClick={() => setWalletModal('call')}>
                    <div className="ad-btn-call-main"><i className="fas fa-phone" style={{ fontSize: 15 }} />Call Now</div>
                    <div className="ad-btn-call-sub">Start a call session</div>
                  </button>
                  <button className="ad-btn-gift" onClick={() => setShowGift(true)}>
                    <i className="ad-btn-gift-ico fas fa-gift" />
                    <div className="ad-btn-gift-body">
                      <span className="ad-btn-gift-lbl">Send a Gift</span>
                      <span className="ad-btn-gift-sub">Show your appreciation</span>
                    </div>
                    <i className="ad-btn-gift-arr fas fa-chevron-right" />
                  </button>
                  <ul className="ad-trust-list">
                    {TRUST.map(x => <li key={x.t}><i className={x.ic} />{x.t}</li>)}
                  </ul>
                </div>
                <div className="ad-gifts-card">
                  <div className="ad-gifts-title"><i className="fas fa-gift" />Send Blessings Gift</div>
                  <div className="ad-gift-grid">
                    {giftList.slice(0, 6).map(g => {
                      const isSending = sendingGiftId === g._id;
                      return (
                        <div
                          key={g._id}
                          className="ad-gift-item"
                          onClick={() => !sendingGiftId && handleQuickSendGift(g)}
                          style={{ cursor: sendingGiftId ? 'default' : 'pointer', opacity: sendingGiftId && !isSending ? 0.5 : 1, position: 'relative' }}
                        >
                          {g.image && !giftImgErr[g._id] ? (
                            <img
                              className="ad-gift-img"
                              src={g.image}
                              alt={g.title}
                              onError={() => setGiftImgErr(prev => ({ ...prev, [g._id]: true }))}
                            />
                          ) : (
                            <div className="ad-gift-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                              {g.emoji || emojiFor(g.title)}
                            </div>
                          )}
                          {isSending && (
                            <span style={{
                              position: 'absolute', top: 6, right: 6,
                              width: 16, height: 16, borderRadius: '50%',
                              border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#7c1d40',
                              animation: 'ad-gift-spin 0.7s linear infinite',
                            }} />
                          )}
                          <div className="ad-gift-name">{g.title}</div>
                          <div className="ad-gift-price">₹{g.price}</div>
                        </div>
                      );
                    })}
                  </div>
                  {giftError && (
                    <p style={{ color: '#dc2626', fontSize: 12, textAlign: 'center', margin: '4px 0 0' }}>
                      {giftError}
                    </p>
                  )}
                  <button className="ad-gift-more" onClick={() => setShowGift(true)}>View More Gifts</button>
                  <style>{`@keyframes ad-gift-spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              </div>
            </div>

          </div>

          {/* ══ FULL-WIDTH SECTIONS BELOW ══ */}
{/* ══ FULL-WIDTH SECTIONS BELOW ══ */}
          <div className="ad-full-width-sections">
            {/* Consultation Process + Reviews — single row */}
            <div className="ad-card" style={{ marginBottom: 14, overflow: 'hidden' }}>
              <div className="row g-4 mx-0">
                {/* Consultation Process — left */}
                <div className="col-lg-3 col-md-4">
                  <div className="ad-card-title"><i className="fas fa-route" />Consultation Process</div>
                  <div className="ad-process-vert">
                    {[
                      { ic: 'fas fa-calendar-check', name: 'Book Consultation', desc: 'Choose chat or call and book your slot.' },
                      { ic: 'fas fa-user-edit', name: 'Share Your Details', desc: 'Tell us your birth details and issue.' },
                      { ic: 'fas fa-comment-dots', name: 'Get Astrologer', desc: 'Connect with Acharya and discuss your concerns.' },
                    ].map((s, i) => (
                      <div key={i} className="ad-proc-row">
                        <div className="ad-proc-ico"><i className={s.ic} /></div>
                        <div>
                          <div className="ad-proc-name">{s.name}</div>
                          <div className="ad-proc-desc">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews — right */}
                <div className="col-lg-9 col-md-8">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="ad-card-title mb-0"><i className="fas fa-comments" />Customer Reviews</div>
                    <button
                      className="btn btn-link p-0 ad-reviews-viewall"
                      style={{ fontSize: 12, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }}
                      onClick={() => setPopup('reviews')}
                    >
                      View All
                    </button>
                  </div>
                  <div className="row g-3">
                    {reviewsSource.slice(0, 3).map((r, i) => (
                      <div key={i} className="col-md-4">
                        <div className="ad-rev-card">
                          <div className="ad-rev-user">
                            <img className="ad-rev-av" src={r.av} alt={r.name} onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                            <div>
                              <div className="ad-rev-name">{r.name}</div>
                              <div className="ad-rev-veri">✓ Verified Purchase</div>
                            </div>
                            <span className="ad-rev-time">{r.time}</span>
                          </div>
                          <RevStars val={r.stars} />
                          <div className="ad-rev-text">{r.text}</div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="ad-rev-tag">{r.tag}</span>
                            <span className="ad-rev-help"><i className="far fa-thumbs-up me-1" />Helpful ({r.helpful})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ + You May Also Like — side by side */}
            <div className="row g-4">
              {/* FAQ — left */}
              <div className="col-lg-5">
                <div className="ad-card" style={{ marginBottom: 0, height: '100%' }}>
                  <div className="ad-card-title"><i className="fas fa-question-circle" />Frequently Asked Questions</div>
                  {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
                </div>
              </div>
              {/* You May Also Like — right */}
              <div className="col-lg-7">
                <div className="ad-card" style={{ marginBottom: 0, height: '100%' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="ad-card-title mb-0">
                      <i className="fas fa-heart" style={{ color: '#7c1d40' }} />You May Also Like
                    </div>
                    <Link to="/astrologer" style={{ fontSize: 12, color: '#7c1d40', fontWeight: 700, textDecoration: 'none' }}>View All</Link>
                  </div>
                  <div className="row g-3">
                    {simList.map((s, i) => (
                      <div key={i} className="col-6 col-sm-3 d-flex">
                        <Link
                          to={`/astrologer/${s.id || s._id}`}
                          className="ad-sim-card w-100"
                          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                          <div className="ad-sim-av-box">
                            {s.profile_img
                              ? <img src={s.profile_img} alt={s.name} onError={e => { e.target.style.display = 'none' }} />
                              : <div className="ad-sim-av-init" style={{ background: `linear-gradient(135deg,${avColor(s.name)},${avColor(s.name)}99)` }}>{initials(s.name)}</div>
                            }
                          </div>
                          <div className="ad-sim-name">{s.name}</div>
                          <div className="ad-sim-rating">
                            <i className="fas fa-star" />
                            <span>{parseFloat(s.avg_rate || 4.0).toFixed(1)}</span>
                            <span style={{ color: '#9ca3af', fontSize: 11 }}>({s.rating ?? s.total_review ?? 0})</span>
                          </div>
                          <div className="ad-sim-price">₹{s.per_min_chat || s.per_min_voice_call || 5}/min</div>
                          <button
                            className="ad-sim-btn"
                            onClick={e => { e.stopPropagation(); }}
                          >
                            Chat Now
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Trust Bottom Bar */}
      <div className="">
        <div className="container ad-bottom-bar">
          <div className="ad-bottom-inner">
            {[
              { ic: 'fas fa-users', t: 'Trusted by 50 Lakh+ Users' },
              { ic: 'fas fa-lock', t: '100% Privacy & Confidentiality' },
              { ic: 'fas fa-credit-card', t: 'Secure & Encrypted Payments' },
              { ic: 'fas fa-user-check', t: 'Verified & Experienced Experts' },
            ].map(b => <div key={b.t} className="ad-bottom-item"><i className={b.ic} />{b.t}</div>)}
          </div>
        </div>
      </div>

      {/* ── POPUPS ── */}
      {popup === 'gallery' && (
        <ViewAllPopup title="Gallery Photos" onClose={() => setPopup(null)}>
          <div className="ad-gallery-grid">
            {GALLERY_IMGS.map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`}
                onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
            ))}
          </div>
        </ViewAllPopup>
      )}

      {popup === 'reviews' && (
        <ViewAllPopup title={`All Reviews for ${astro.name}`} onClose={() => setPopup(null)}>
          {reviewsSource.map((r, i) => (
            <div key={i} className="ad-popup-rev">
              <div className="ad-rev-user mb-2">
                <img className="ad-rev-av" src={r.av} alt={r.name} onError={e => { e.target.src = '/assets/img/team/team_1_1.jpg' }} />
                <div>
                  <div className="ad-rev-name">{r.name}</div>
                  <div className="ad-rev-veri">✓ Verified Purchase</div>
                </div>
                <span className="ad-rev-time">{r.time}</span>
              </div>
              <RevStars val={r.stars} />
              <div className="ad-rev-text">{r.text}</div>
              <div className="d-flex justify-content-between">
                <span className="ad-rev-tag">{r.tag}</span>
                <span className="ad-rev-help"><i className="far fa-thumbs-up me-1" />Helpful ({r.helpful})</span>
              </div>
            </div>
          ))}
        </ViewAllPopup>
      )}

      {popup === 'skills' && (
        <ViewAllPopup title="Skills & Expertise" onClose={() => setPopup(null)}>
          <div className="ad-skills">
            {SKILLS.map(s => (
              <span key={s} className="ad-skill"><i className="fas fa-circle" />{s}</span>
            ))}
          </div>
        </ViewAllPopup>
      )}

      <WalletConnectModal
        isOpen={!!walletModal}
        onClose={() => setWalletModal(null)}
        astrologer={astro}
        walletBalance={walletBalance}
        mode={walletModal || 'chat'}
        onConnect={(mode) => {
          // Step 2 → after wallet check, collect user details
          setDetailsModal(mode);
          setWalletModal(null);
        }}
        onRecharge={() => {
          setWalletModal(null);
          navigate('/wallet');
        }}
      />
      <UserDetailsModal
        isOpen={!!detailsModal}
        onClose={() => setDetailsModal(null)}
        astrologer={astro}
        mode={detailsModal || 'chat'}
        onSubmit={async (details) => {
          const mode = detailsModal;               // 'chat' | 'call'
          setDetailsModal(null);
        
          // FIX: walletBalance is set by an earlier get_profile fetch on page load
          // — if the user clicks through quickly, before that fetch resolves,
          // walletBalance is still its default 0. Re-fetch the real, current
          // balance right at the moment the call actually starts instead of
          // trusting a value that may be stale by several seconds.
          let freshWallet = walletBalance;
          try {
            const w = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
            freshWallet = Number(w?.results?.wallet ?? w?.results_web?.wallet ?? w?.wallet ?? walletBalance);
          } catch (_) { /* keep last-known walletBalance */ }
        
          navigate(`/consultation/calling/${astro.id || astro._id}`, {
            state: {
              callType: mode,
              astrologer_id: astro.id || astro._id,
              name: astro.name,
              profile_img: astro.profile_img,
              // FIX: was always astro.per_min_chat, even for audio calls — should
              // use the voice-call rate for mode === 'call'.
              rate: mode === 'call' ? (astro.per_min_voice_call || astro.per_min_chat || 5) : (astro.per_min_chat || 5),
              wallet: freshWallet,
              intake: {
                name: details.name,
                gender: details.gender,
                dob: details.dob,
                tob: details.tob,
                place: details.birthPlace,
              },
            },
          });
        
        }}
      />
      {/* <UserDetailsModal
        isOpen={!!detailsModal}
        onClose={() => setDetailsModal(null)}
        astrologer={astro}
        mode={detailsModal || 'chat'}
        onSubmit={(details) => {
          setDetailsModal(null);
          // Step 3 → proceed to the live session with collected details
          navigate(`/consultation/${astro.id || astro._id}?mode=${detailsModal}`, { state: { details } });
        }}
      /> */}



      {sentGift && (
        <div
          onClick={() => setSentGift(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.55)', padding: 24,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 20, padding: '28px 24px',
              maxWidth: 320, width: '100%', textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg,#FF6F00,#FF9800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(255,111,0,0.4)',
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p style={{ fontWeight: 800, fontSize: 18, color: '#111', margin: '0 0 6px' }}>
              Gift Sent! 🎉
            </p>
            <p style={{ fontSize: 13.5, color: '#555', margin: '0 0 4px' }}>
              You sent <strong style={{ color: '#FF6F00' }}>{sentGift.title}</strong>
            </p>
            <p style={{ fontSize: 12.5, color: '#888', margin: '0 0 18px' }}>
              to {astro.name}
            </p>
            <button
              onClick={() => setSentGift(null)}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#7c1d40,#5a1230)', color: '#fff',
                fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
      {/* Mobile sticky Chat/Call bar */}
      <div className="ad-mobile-cta-bar">
        <button className="ad-mobile-chat-btn" onClick={() => setWalletModal('chat')}>
          <i className="fas fa-comment-dots" />
          Chat Now
        </button>
        <button className="ad-mobile-call-btn" onClick={() => setWalletModal('call')}>
          <i className="fas fa-phone" />
          Call Now
        </button>
      </div>

      <NewAppDownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Consult ${astro.name}`}
        subtitle={`Get guidance from ${astro.name}.`}
      />

      {/* Send Gift modal */}
      <SendGiftModal
        isOpen={showGift}
        onClose={() => setShowGift(false)}
        astrologerName={astro.name}
        astrologerId={astro.id || astro._id}
        astrologerImage={astro.profile_img}
        gifts={giftList}
        walletBalance={walletBalance}
      />

      <Footer />
    </div>
  );
};

export default AstrologerDetail;
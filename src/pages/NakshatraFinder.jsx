import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import { useNavigate } from "react-router-dom";
const pad = (n) => String(n).padStart(2, '0');

const NF_FAQS = [
    {
        q: 'What exactly is a Nakshatra Finder?',
        a: "A Nakshatra Finder is a high-precision digital tool that identifies your 'Birth Star' by mapping the Moon's exact longitudinal position against the 27 lunar mansions at the moment of your birth.",
    },
    {
        q: 'Can I find my Nakshatra using only my Date of Birth?',
        a: 'While Date of Birth provides a general idea, VaidikGuru requires your exact Time and Place of Birth for 100% accuracy, as the Moon moves through a Nakshatra roughly every 24 hours.',
    },
    {
        q: 'What is the difference between Rashi and Nakshatra?',
        a: "Rashi (Moon Sign) covers a broad 30\u00b0 arc of the zodiac, whereas a Nakshatra is a highly specific 13\u00b020' segment. Your Nakshatra offers much deeper insights into your subconscious behavior than your Rashi alone.",
    },
    {
        q: 'How does knowing my Nakshatra benefit my daily life?',
        a: 'It helps you align with cosmic timing (Muhurats), choose the most compatible life partner (Guna Milan), select the right career path, and even identify auspicious starting letters for names.',
    },
    {
        q: "What does 'Janma Nakshatra' mean?",
        a: 'Janma Nakshatra refers specifically to the Nakshatra the Moon was transiting at the exact second you were born. It is considered the most important point in your entire Vedic birth chart.',
    },
    {
        q: 'Why does VaidikGuru ask for my birth location?',
        a: 'Birth location is vital because the Moon\u2019s relative position and the exact timing of sunrise/sunset vary by geography, which directly impacts the precision of your Nakshatra calculation.',
    },
    {
        q: 'Are there remedies associated with my Nakshatra?',
        a: 'Yes. Every Nakshatra has a ruling deity and planet. VaidikGuru can suggest specific mantras, colors, and gemstones to balance your energy based on your unique birth star.',
    },
];

const FaqItem = ({ num, q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="pd-faq-item" onClick={() => setOpen((o) => !o)}>
            <div className="pd-faq-q">
                <span className="pd-faq-num">{pad(num)}</span>
                <span className="pd-faq-text">{q}</span>
                <div className="pd-faq-toggle">
                    <i className={`fas fa-${open ? 'minus' : 'plus'}`} />
                </div>
            </div>
            {open && <div className="pd-faq-ans">{a}</div>}
        </div>
    );
};

const NakshatraFinder = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    // Live "Today's Sky" for Delhi (default)
    const [todayData] = useState({
        location: 'Delhi, India',
        nakshatra: 'Mool',
        rashi: 'Sagittarius',
        date: 'Saturday, 20 Dec 2025',
        time: '02:42:49 IST',
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        const name = e.target.name.value;
        const place = e.target.place.value;

        setTimeout(() => {
            setResult({
                name,
                location: place,
                nakshatra: 'Pushya',
                pada: 'Pada 2',
                rashi: 'Cancer',
                alphabet: 'Hu',
                deity: 'Brihaspati',
                reading:
                    'Pushya is the most auspicious of all Nakshatras — nourishing, protective energy that favours stability, spiritual growth and long-term prosperity.',
            });
            setLoading(false);
            window.scrollTo({ top: 380, behavior: 'smooth' });
        }, 1500);
    };

    const essentials = [
        { k: 'Janma Nakshatra', v: 'Your birth star' },
        { k: 'Pada', v: 'One of four quarters' },
        { k: 'Ruling Deity', v: 'Your cosmic guide' },
        { k: 'Rashi', v: 'The Moon sign it sits in' },
    ];

    return (
        <div className="main-wrapper nf-page">
            <Header />

            {/* ================= SCOPED STYLES ================= */}
            <style>{`
                .nf-page { background: #f7f5f0; }
                .nf-shell { padding: 24px 0 90px; }

                /* Banner */
                .nf-banner {
                    position: relative;
                    border-radius: 22px;
                    overflow: hidden;
                    min-height: 250px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 60px 24px;
                    background: #3a0d16 url('/assets/img/images/profile-hero-banner.jpeg') center/cover no-repeat;
                    box-shadow: 0 18px 50px rgba(58,13,22,.28);
                }
                .nf-banner::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, rgba(48,10,20,.86) 0%, rgba(48,10,20,.55) 45%, rgba(48,10,20,.15) 100%);
                }
                .nf-banner-inner { position: relative; z-index: 2; max-width: 760px; }
                .nf-eyebrow { color: #f0b64a; letter-spacing: .3em; font-size: 13px; font-weight: 700; text-transform: uppercase; }
                .nf-title { color: #fff; font-weight: 800; line-height: 1.05; font-size: clamp(34px, 5vw, 58px); margin: 10px 0 14px; }
                .nf-title span { color: #f0b64a; }
                .nf-sub { color: rgba(255,255,255,.82); max-width: 560px; margin: 0 auto; }
                .nf-underline { width: 120px; height: 3px; background: #f0b64a; border-radius: 3px; margin: 20px auto 0; }

                /* Cards */
                .nf-card { background: #fff; border: 1px solid #efece6; border-radius: 20px; box-shadow: 0 6px 26px rgba(0,0,0,.05); }
                .nf-maroon { background: linear-gradient(160deg, #5b1a2e 0%, #33101d 100%); color: #fff; border-radius: 20px; }

                .nf-live { display:flex; justify-content:space-between; align-items:center; }
                .nf-live-tag { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.65); font-weight: 700; }
                .nf-live-badge { background: #f0b64a; color: #3a0d16; font-weight: 800; font-size: 10px; padding: 3px 10px; border-radius: 20px; letter-spacing: .05em; }
                .nf-live-gold { color: #f0b64a; font-weight: 800; }

                .nf-mini { display:flex; gap:13px; align-items:center; padding: 15px 16px; }
                .nf-mini-ico { width: 44px; height: 44px; border-radius: 13px; background: #fdeef2; color: #c23a63; display:flex; align-items:center; justify-content:center; font-size: 18px; flex-shrink:0; }
                .nf-mini-lbl { font-size: 11.5px; color: #9a8f95; margin: 0; }
                .nf-mini-val { font-size: 14px; font-weight: 700; color: #3a0d16; margin: 0; }

                /* Form */
                .nf-form-title { color: #4a1020; font-weight: 800; }
                .nf-label { display:block; font-size: 12px; font-weight: 700; color: #4a1020; margin-bottom: 7px; }
                .nf-input { width: 100%; border: 1px solid #ececec; background: #faf7f8; border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #3a0d16; transition: .18s; }
                .nf-input::placeholder { color: #b7adb1; }
                .nf-input:focus { outline: none; border-color: #e8971e; background:#fff; box-shadow: 0 0 0 3px rgba(232,151,30,.16); }
                .nf-btn-gold { width: 100%; border: none; border-radius: 12px; padding: 14px; font-weight: 700; color: #fff; letter-spacing:.02em; background: linear-gradient(135deg, #f0a93b, #e0821a); cursor: pointer; transition: .2s; box-shadow: 0 8px 20px rgba(224,130,26,.28); }
                .nf-btn-gold:hover { filter: brightness(1.05); transform: translateY(-1px); }
                .nf-btn-gold:disabled { opacity: .7; cursor: default; transform:none; }

                /* Result */
                .nf-empty { border: 2px dashed #e2ddd5; border-radius: 20px; min-height: 100%; display:flex; align-items:center; justify-content:center; text-align:center; padding: 40px; color: #a79f9a; }
                .nf-empty-ico { width: 64px; height: 64px; border-radius: 50%; border: 2px solid #e2ddd5; display:flex; align-items:center; justify-content:center; margin: 0 auto 16px; font-size: 26px; color: #c9c1bb; }
                .nf-glass { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 13px; padding: 14px; }
                .nf-glass-lbl { font-size: 11px; color: rgba(255,255,255,.5); margin: 0 0 4px; }
                .nf-glass-val { font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
                .nf-btn-ghost { background: #f0b64a; color: #3a0d16; border:none; font-weight:700; font-size:13px; padding: 9px 18px; border-radius: 10px; cursor:pointer; }

                /* Info + meanings */
                .nf-info-title { color: #4a1020; font-weight: 800; }
                .nf-pill { display:inline-block; background:#fdeef2; color:#c23a63; font-size:12px; font-weight:600; padding:7px 15px; border-radius:20px; margin: 6px 8px 0 0; }
                .nf-meaning { display:flex; gap:8px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,.09); font-size: 14px; }
                .nf-meaning:last-child { border-bottom: none; }
                .nf-meaning b { color: #f0b64a; font-weight: 700; }
                .nf-meaning span { color: rgba(255,255,255,.8); }

                /* FAQ (Puja-details style) */
                .pd-faq-wrap { padding: 44px 0 10px; }
                .pd-sec-eyebrow {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    font-size: 12px; font-weight: 700; color: #c87a3a; letter-spacing: 1.2px;
                    text-transform: uppercase; margin-bottom: 26px; flex-wrap: wrap; text-align: center;
                }
                .pd-sec-eyebrow i { font-size: 11px; }
                .pd-eyebrow-line { flex: 1; max-width: 55px; height: 1px; background: #f0d0a8; }

                .pd-faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 36px; }
                .pd-faq-item { border-bottom: 1px solid #f0e8e0; cursor: pointer; }
                .pd-faq-q { display: flex; align-items: center; gap: 10px; padding: 14px 0; font-size: 13.5px; color: #333; }
                .pd-faq-num { font-size: 14px; font-weight: 700; color: #e87a2e; width: 26px; flex-shrink: 0; }
                .pd-faq-text { flex: 1; font-weight: 500; }
                .pd-faq-toggle { width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid #ddd; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .pd-faq-toggle i { font-size: 10px; color: #888; }
                .pd-faq-ans { font-size: 13px; color: #777; padding: 0 0 14px 36px; line-height: 1.65; }

                @media (max-width: 991px){ .nf-banner{ min-height: 210px; padding: 48px 20px; } }
                @media (max-width: 767px){
                    .pd-faq-grid { grid-template-columns: 1fr; gap: 0; }
                    .pd-faq-wrap { padding: 28px 0 6px; }
                }
            `}</style>

            {/* ================= BANNER HERO ================= */}
            <div className="nf-shell">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="nf-banner"
                    >
                        <div className="nf-banner-inner">
                            <div className="nf-eyebrow">Celestial Insights</div>
                            <h1 className="nf-title">
                                Nakshatra <span>Finder</span>
                            </h1>
                            <p className="nf-sub">
                                Discover the lunar mansion that governs your inner
                                consciousness and life's purpose.
                            </p>
                            <div className="nf-underline" />
                        </div>
                    </motion.div>

                    {/* ================= MAIN ROW ================= */}
                    <div className="row g-4 mt-1">
                        {/* SIDEBAR */}
                        <div className="col-12 col-lg-3">
                            <div className="nf-maroon p-4 mb-4">
                                <div className="nf-live mb-3">
                                    <span className="nf-live-tag">Today in {todayData.location}</span>
                                    <span className="nf-live-badge">LIVE</span>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="nf-mini-lbl mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
                                            Current Star
                                        </p>
                                        <h3 className="nf-live-gold mb-0 h4">{todayData.nakshatra}</h3>
                                    </div>
                                    <div className="col-6">
                                        <p className="nf-mini-lbl mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
                                            Moon in
                                        </p>
                                        <h4 className="text-white mb-0 h6 mt-1">{todayData.rashi}</h4>
                                    </div>
                                </div>
                                <div
                                    className="d-flex justify-content-between mt-3 pt-3"
                                    style={{ borderTop: '1px solid rgba(255,255,255,.12)', fontSize: 12, color: 'rgba(255,255,255,.6)' }}
                                >
                                    <span>{todayData.date}</span>
                                    <span>{todayData.time}</span>
                                </div>
                            </div>

                            <div className="nf-card nf-mini mb-3">
                                <div className="nf-mini-ico">
                                    <i className="fas fa-moon" />
                                </div>
                                <div>
                                    <p className="nf-mini-lbl">What We Map</p>
                                    <p className="nf-mini-val">Moon &amp; Pada</p>
                                </div>
                            </div>

                            <div className="nf-card nf-mini">
                                <div className="nf-mini-ico">
                                    <i className="fas fa-phone-alt" />
                                </div>
                                <div>
                                    <p className="nf-mini-lbl">Contact Us</p>
                                    <p className="nf-mini-val">support@vaidikguru.com</p>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="nf-card p-4 h-100">
                                <h3 className="nf-form-title h4 mb-4">Enter Birth Details</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="nf-label">Full Name</label>
                                        <input name="name" type="text" className="nf-input" placeholder="Your Name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="nf-label">Email Address</label>
                                        <input name="email" type="email" className="nf-input" placeholder="email@vaidikguru.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="nf-label">Date of Birth</label>
                                            <input name="date" type="date" className="nf-input" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="nf-label">Time of Birth</label>
                                            <input name="time" type="time" className="nf-input" required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="nf-label">Place of Birth</label>
                                        <input name="place" type="text" className="nf-input" placeholder="City, State" required />
                                    </div>
                                    <button type="submit" className="nf-btn-gold" disabled={loading}>
                                        {loading ? 'Aligning Stars...' : 'Calculate My Nakshatra'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RESULT */}
                        <div className="col-12 col-md-6 col-lg-5">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="nf-empty h-100"
                                    >
                                        <div>
                                            <div className="nf-empty-ico">
                                                <i className="far fa-question-circle" />
                                            </div>
                                            <p className="mb-0">
                                                Your customized Nakshatra report <br />
                                                will appear here after calculation.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="nf-maroon p-4 p-md-5 h-100"
                                    >
                                        <div className="text-center mb-4">
                                            <span className="nf-eyebrow" style={{ letterSpacing: '.2em' }}>
                                                Your Janma Nakshatra
                                            </span>
                                            <h2 className="text-white display-6 mb-0 mt-1">{result.nakshatra}</h2>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: 'Moon Sign (Rashi)', v: result.rashi },
                                                { l: 'Nakshatra Pada', v: result.pada },
                                                { l: 'Name Alphabet', v: result.alphabet },
                                                { l: 'Ruling Deity', v: result.deity },
                                            ].map((s, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="nf-glass">
                                                        <p className="nf-glass-lbl">{s.l}</p>
                                                        <p className="nf-glass-val">{s.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="nf-glass mt-3">
                                            <p className="nf-glass-lbl" style={{ color: '#f0b64a', fontWeight: 700 }}>
                                                VaidikGuru Nakshatra Insight
                                            </p>
                                            <p className="mb-0" style={{ fontSize: 13, color: 'rgba(255,255,255,.8)', lineHeight: 1.6 }}>
                                                {result.reading}
                                            </p>
                                        </div>

                                        <div
                                            className="d-flex justify-content-between align-items-center mt-4 pt-3"
                                            style={{ borderTop: '1px solid rgba(255,255,255,.12)' }}
                                        >
                                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
                                                Generated for {result.name}
                                            </span>
                                            <button
                                                className="nf-btn-ghost"
                                                onClick={() => navigate("/astrologer")}
                                            >
                                                Talk to Astrologer
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ================= INFO + ESSENTIALS ================= */}
                    <div className="row g-4 mt-1">
                        <div className="col-12 col-lg-7">
                            <div className="nf-card p-4 p-md-5 h-100">
                                <h3 className="nf-info-title h4 mb-3">What Is a Nakshatra Finder?</h3>
                                <p className="text-muted mb-4" style={{ lineHeight: 1.75 }}>
                                    Unlike standard sun-sign tools, the VaidikGuru Nakshatra Finder maps
                                    the Moon's exact transit through 27 lunar mansions. This identifies
                                    your <strong>Janma Nakshatra</strong> — the celestial blueprint of
                                    your subconscious mind, revealing far more than your Rashi alone.
                                </p>
                                <div>
                                    <span className="nf-pill">27 Lunar Mansions</span>
                                    <span className="nf-pill">Moon Coordinate Mapping</span>
                                    <span className="nf-pill">Vedic Accuracy</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="nf-maroon p-4 p-md-5 h-100">
                                <h3 className="text-white h5 fw-bold mb-3">Nakshatra Essentials</h3>
                                {essentials.map((m) => (
                                    <div className="nf-meaning" key={m.k}>
                                        <b>{m.k}:</b> <span>{m.v}</span>
                                    </div>
                                ))}
                                <div className="nf-meaning">
                                    <b style={{ color: '#f0b64a' }}>
                                        <i className="fas fa-star me-1" /> Total:
                                    </b>{' '}
                                    <span>27 Mansions &middot; 4 Padas each</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= CONTACT STRIP ================= */}
                    <div className="nf-card nf-mini mt-4">
                        <div className="nf-mini-ico">
                            <i className="far fa-envelope" />
                        </div>
                        <div>
                            <p className="nf-mini-lbl">Questions about your reading?</p>
                            <p className="nf-mini-val">support@vaidikguru.com</p>
                        </div>
                    </div>

                    {/* ================= FAQ ================= */}
                    <div className="pd-faq-wrap">
                        <div className="pd-sec-eyebrow">
                            <span className="pd-eyebrow-line" />
                            <i className="fas fa-om" /> Frequently Asked Questions{' '}
                            <i className="fas fa-om" />
                            <span className="pd-eyebrow-line" />
                        </div>
                        <div className="pd-faq-grid">
                            {NF_FAQS.map((f, i) => (
                                <FaqItem key={i} num={i + 1} q={f.q} a={f.a} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <ScrollTop />
        </div>
    );
};

export default NakshatraFinder;
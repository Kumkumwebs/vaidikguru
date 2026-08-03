import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import { useNavigate } from "react-router-dom";


const pad = (n) => String(n).padStart(2, '0');
const JR_FAQS = [
    {
        q: 'What is a Janma Rashi?',
        a: 'Janma Rashi is the zodiac sign the Moon was transiting at the exact time of your birth. It is a fundamental pillar of Vedic Astrology that defines your mental and emotional state.',
    },
    {
        q: 'Is Janma Rashi more important than my Sun Sign?',
        a: 'In Vedic Astrology, yes. The Moon governs the mind (Manas) and emotions, so your Janma Rashi is considered a more accurate reflection of your inner self than the Western Sun Sign.',
    },
    {
        q: "How do I find my Rashi if I don't know my exact birth time?",
        a: 'The Moon changes signs roughly every 2.25 days, so an approximate time usually still gives the correct Rashi. For borderline cases, VaidikGuru recommends confirming your exact birth time for precise results.',
    },
    {
        q: 'Can my Rashi change over time?',
        a: 'No. Your Janma Rashi is fixed at the moment of birth and never changes. What changes is the Moon\u2019s daily transit (Gochar), which is what our live "Today\u2019s Moon Transit" widget shows.',
    },
    {
        q: 'How does my Rashi affect my career?',
        a: 'Your Rashi and its ruling planet influence your natural temperament, strengths, and favourable timing. Astrologers use it alongside your full chart to suggest suitable career directions and auspicious periods.',
    },
    {
        q: 'What is the connection between Rashi and Nakshatra?',
        a: 'Each Rashi (30\u00b0) contains parts of multiple Nakshatras (13\u00b020\u2019 each). Your Nakshatra is a finer subdivision within your Rashi, giving deeper detail about personality and karmic tendencies.',
    },
    {
        q: 'Does my Rashi determine my name?',
        a: "Traditionally yes. Your Rashi and Nakshatra provide the 'Nama Akshara' \u2014 an auspicious starting syllable \u2014 used to choose a name that stays in harmony with your birth energy.",
    },
    {
        q: "What is 'Rashi Lord'?",
        a: 'The Rashi Lord is the planet that rules your Moon Sign (for example, the Moon rules Cancer, Mars rules Aries). Its placement and strength in your chart deeply influence how your Rashi expresses itself.',
    },
    {
        q: 'Why does VaidikGuru need my birth location?',
        a: 'Birth location determines local time and the exact lunar position at your moment of birth. Without it, the Moon\u2019s degree \u2014 and therefore your precise Rashi \u2014 cannot be calculated accurately.',
    },
    {
        q: 'Can I use Janma Rashi for marriage matching?',
        a: 'Absolutely. Rashi-based compatibility (Bhakoot) and Guna Milan are core parts of Vedic matchmaking, assessing emotional harmony and long-term compatibility between partners.',
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

const JanmaRashiFinder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Live "Today's Moon Transit" for Delhi (default)
    const [todayData] = useState({
        location: 'Delhi, India',
        rashi: 'Sagittarius',
        element: 'Fire',
        time: '02:08:44 IST',
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
                rashi: 'Karka (Cancer)',
                lord: 'Chandra (Moon)',
                element: 'Water (Jala)',
                nature: 'Movable',
                temperament: 'Intuition & Emotion',
                reading:
                    'A Karka Moon gives a deeply intuitive, nurturing and emotionally intelligent mind. You process the world through feeling first — protective of loved ones and guided by memory and empathy.',
            });
            setLoading(false);
            window.scrollTo({ top: 380, behavior: 'smooth' });
        }, 1500);
    };

    const elements = [
        { icon: '🔥', name: 'Fire (Agni)', trait: 'Action & Passion' },
        { icon: '🌱', name: 'Earth (Prithvi)', trait: 'Stability & Logic' },
        { icon: '🌬️', name: 'Air (Vayu)', trait: 'Intellect & Flow' },
        { icon: '💧', name: 'Water (Jala)', trait: 'Intuition & Emotion' },
    ];

    const insights = [
        {
            t: 'Life Cycles (Sade Sati)',
            d: 'Knowing your Janma Rashi is the only way to track your Sade Sati — the 7.5-year cycle of Saturn. This period is crucial for major life transformations and spiritual maturity.',
        },
        {
            t: 'Traditional Alignment',
            d: "Your Rashi determines the 'Nama Akshara' — the specific starting sound for your name — to ensure your life path vibrates in harmony with the cosmos.",
        },
        {
            t: 'Relationship Harmony',
            d: 'In Vedic matchmaking, Rashi compatibility (Bhakoot) is one of the most critical parameters to ensure emotional longevity between partners.',
            highlight: true,
        },
    ];

    return (
        <div className="main-wrapper jr-page">
            <Header />

            {/* ================= SCOPED STYLES ================= */}
            <style>{`
                .jr-page { background: #f7f5f0; }
                .jr-shell { padding: 24px 0 90px; }

                /* Banner */
                .jr-banner {
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
                .jr-banner::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, rgba(48,10,20,.86) 0%, rgba(48,10,20,.55) 45%, rgba(48,10,20,.15) 100%);
                }
                .jr-banner-inner { position: relative; z-index: 2; max-width: 780px; }
                .jr-eyebrow { color: #f0b64a; letter-spacing: .3em; font-size: 13px; font-weight: 700; text-transform: uppercase; }
                .jr-title { color: #fff; font-weight: 800; line-height: 1.05; font-size: clamp(34px, 5vw, 56px); margin: 10px 0 14px; }
                .jr-title span { color: #f0b64a; }
                .jr-sub { color: rgba(255,255,255,.82); max-width: 600px; margin: 0 auto; }
                .jr-underline { width: 120px; height: 3px; background: #f0b64a; border-radius: 3px; margin: 20px auto 0; }

                /* Cards */
                .jr-card { background: #fff; border: 1px solid #efece6; border-radius: 20px; box-shadow: 0 6px 26px rgba(0,0,0,.05); }
                .jr-maroon { background: linear-gradient(160deg, #5b1a2e 0%, #33101d 100%); color: #fff; border-radius: 20px; }

                .jr-live { display:flex; justify-content:space-between; align-items:center; }
                .jr-live-tag { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.65); font-weight: 700; }
                .jr-live-dot { width: 9px; height: 9px; border-radius: 50%; background: #3ddc84; box-shadow: 0 0 0 4px rgba(61,220,132,.2); }
                .jr-live-gold { color: #f0b64a; font-weight: 800; }

                .jr-mini { display:flex; gap:13px; align-items:center; padding: 15px 16px; }
                .jr-mini-ico { width: 44px; height: 44px; border-radius: 13px; background: #fdeef2; color: #c23a63; display:flex; align-items:center; justify-content:center; font-size: 18px; flex-shrink:0; }
                .jr-mini-lbl { font-size: 11.5px; color: #9a8f95; margin: 0; }
                .jr-mini-val { font-size: 14px; font-weight: 700; color: #3a0d16; margin: 0; }

                /* Form */
                .jr-form-title { color: #4a1020; font-weight: 800; }
                .jr-label { display:block; font-size: 12px; font-weight: 700; color: #c23a63; margin-bottom: 7px; }
                .jr-input { width: 100%; border: 1px solid #ececec; background: #faf7f8; border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #3a0d16; transition: .18s; }
                .jr-input::placeholder { color: #b7adb1; }
                .jr-input:focus { outline: none; border-color: #c23a63; background:#fff; box-shadow: 0 0 0 3px rgba(194,58,99,.14); }
                .jr-btn { width: 100%; border: none; border-radius: 12px; padding: 14px; font-weight: 700; color: #fff; letter-spacing:.02em; background: linear-gradient(135deg, #b8496b, #9d2f52); cursor: pointer; transition: .2s; box-shadow: 0 8px 20px rgba(157,47,82,.28); }
                .jr-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
                .jr-btn:disabled { opacity: .7; cursor: default; transform:none; }

                /* Result */
                .jr-empty { border: 2px dashed #e2ddd5; border-radius: 20px; min-height: 100%; display:flex; align-items:center; justify-content:center; text-align:center; padding: 40px; color: #a79f9a; }
                .jr-empty-ico { width: 64px; height: 64px; border-radius: 50%; background: #eef7fb; color: #4bb3d6; display:flex; align-items:center; justify-content:center; margin: 0 auto 16px; font-size: 24px; }
                .jr-glass { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 13px; padding: 14px; }
                .jr-glass-lbl { font-size: 11px; color: rgba(255,255,255,.5); margin: 0 0 4px; }
                .jr-glass-val { font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
                .jr-btn-ghost { background: #f0b64a; color: #3a0d16; border:none; font-weight:700; font-size:13px; padding: 9px 18px; border-radius: 10px; cursor:pointer; }

                /* Info */
                .jr-info-title { color: #c23a63; font-weight: 800; }
                .jr-icon-circle { width: 52px; height: 52px; border-radius: 14px; background: #eef7fb; display:flex; align-items:center; justify-content:center; margin-bottom: 18px; }
                .jr-pill { display:inline-block; background:#f4f1fb; color:#5b3fb0; font-size:12px; font-weight:600; padding:7px 15px; border-radius:20px; margin: 6px 8px 0 0; }

                /* Elemental list */
                .jr-elem { display:flex; align-items:center; justify-content:space-between; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.09); }
                .jr-elem:last-child { border-bottom: none; }
                .jr-elem-name { color: #fff; font-size: 14px; display:flex; align-items:center; gap: 10px; }
                .jr-elem-trait { color: #f0b64a; font-size: 13px; font-weight: 700; }

                /* Insight small cards */
                .jr-insight { background:#fff; border:1px solid #efece6; border-radius: 18px; padding: 26px; height: 100%; box-shadow: 0 6px 22px rgba(0,0,0,.04); }
                .jr-insight.hl { background:#f6f9ff; border-color:#dbe6ff; }
                .jr-insight h4 { font-size: 18px; font-weight: 800; color:#c23a63; margin-bottom: 12px; }
                .jr-insight.hl h4 { color:#3f6fd8; }
                .jr-insight p { font-size: 13.5px; color:#7a7a7a; line-height:1.7; margin:0; }

                @media (max-width: 991px){ .jr-banner{ min-height: 210px; padding: 48px 20px; } }

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

                @media (max-width: 767px){
                    .pd-faq-grid { grid-template-columns: 1fr; gap: 0; }
                    .pd-faq-wrap { padding: 28px 0 6px; }
                }
            `}</style>

            {/* ================= BANNER HERO ================= */}
            <div className="jr-shell">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="jr-banner"
                    >
                        <div className="jr-banner-inner">
                            <div className="jr-eyebrow">Vedic Moon Sign</div>
                            <h1 className="jr-title">
                                Janma Rashi <span>Finder</span>
                            </h1>
                            <p className="jr-sub">
                                Identify your Vedic Moon Sign to unlock the secrets of your
                                emotional DNA and mental state.
                            </p>
                            <div className="jr-underline" />
                        </div>
                    </motion.div>

                    {/* ================= MAIN ROW ================= */}
                    <div className="row g-4 mt-1">
                        {/* SIDEBAR */}
                        <div className="col-12 col-lg-3">
                            <div className="jr-maroon p-4 mb-4">
                                <div className="jr-live mb-3">
                                    <span className="jr-live-tag">Today's Moon Transit</span>
                                    <span className="jr-live-dot" />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="jr-mini-lbl mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
                                            Current Rashi
                                        </p>
                                        <h3 className="jr-live-gold mb-0 h5">{todayData.rashi}</h3>
                                    </div>
                                    <div className="col-6">
                                        <p className="jr-mini-lbl mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
                                            Element
                                        </p>
                                        <h4 className="text-white mb-0 h6 mt-1">{todayData.element}</h4>
                                    </div>
                                </div>
                                <div
                                    className="d-flex justify-content-between mt-3 pt-3"
                                    style={{ borderTop: '1px solid rgba(255,255,255,.12)', fontSize: 12, color: 'rgba(255,255,255,.6)' }}
                                >
                                    <span>{todayData.location}</span>
                                    <span>{todayData.time}</span>
                                </div>
                            </div>

                            <div className="jr-card jr-mini mb-3">
                                <div className="jr-mini-ico">
                                    <i className="fas fa-moon" />
                                </div>
                                <div>
                                    <p className="jr-mini-lbl">What We Map</p>
                                    <p className="jr-mini-val">Moon &amp; Rashi Lord</p>
                                </div>
                            </div>

                            <div className="jr-card jr-mini">
                                <div className="jr-mini-ico">
                                    <i className="fas fa-phone-alt" />
                                </div>
                                <div>
                                    <p className="jr-mini-lbl">Contact Us</p>
                                    <p className="jr-mini-val">support@vaidikguru.com</p>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="jr-card p-4 h-100">
                                <h3 className="jr-form-title h4 mb-4">Enter Birth Details</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="jr-label">Full Name</label>
                                        <input name="name" type="text" className="jr-input" placeholder="Rahul Sharma" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="jr-label">Email Address</label>
                                        <input name="email" type="email" className="jr-input" placeholder="rahul@VaidikGuru.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="jr-label">Birth Date</label>
                                            <input name="date" type="date" className="jr-input" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="jr-label">Birth Time</label>
                                            <input name="time" type="time" className="jr-input" required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="jr-label">Birth Location</label>
                                        <input name="place" type="text" className="jr-input" placeholder="City, Country" required />
                                    </div>
                                    <button type="submit" className="jr-btn" disabled={loading}>
                                        {loading ? 'Reading the Moon...' : 'Find My Moon Sign'}
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
                                        className="jr-empty h-100"
                                    >
                                        <div>
                                            <div className="jr-empty-ico">
                                                <i className="fas fa-moon" />
                                            </div>
                                            <p className="mb-0">
                                                Results will be displayed here <br />
                                                based on your lunar placement.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="jr-maroon p-4 p-md-5 h-100"
                                    >
                                        <div className="text-center mb-4">
                                            <span className="jr-eyebrow" style={{ letterSpacing: '.2em' }}>
                                                Your Janma Rashi
                                            </span>
                                            <h2 className="text-white display-6 mb-0 mt-1">{result.rashi}</h2>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: 'Rashi Lord', v: result.lord },
                                                { l: 'Element', v: result.element },
                                                { l: 'Nature', v: result.nature },
                                                { l: 'Temperament', v: result.temperament },
                                            ].map((s, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="jr-glass">
                                                        <p className="jr-glass-lbl">{s.l}</p>
                                                        <p className="jr-glass-val">{s.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="jr-glass mt-3">
                                            <p className="jr-glass-lbl" style={{ color: '#f0b64a', fontWeight: 700 }}>
                                                VaidikGuru Moon Sign Insight
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
                                                className="jr-btn-ghost"
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

                    {/* ================= INFLUENCE SECTION ================= */}
                    <div className="text-center mt-5 pt-4 mb-4">
                        <div className="jr-eyebrow" style={{ color: '#e0982a', letterSpacing: '.18em' }}>
                            Vedic Wisdom
                        </div>
                        <h2 className="fw-bold mt-2" style={{ color: '#2a2a2a' }}>
                            The Influence of{' '}
                            <span style={{ color: '#7c5cff' }}>Janma Rashi</span>
                        </h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-lg-7">
                            <div className="jr-card p-4 p-md-5 h-100">
                                <div className="jr-icon-circle">
                                    <i className="fas fa-moon" style={{ color: '#4bb3d6', fontSize: 20 }} />
                                </div>
                                <h3 className="jr-info-title h4 mb-3">Understanding Your Moon Sign</h3>
                                <p className="text-muted mb-4" style={{ lineHeight: 1.75 }}>
                                    While the Sun Sign represents your outer personality and ego, the{' '}
                                    <strong>Janma Rashi (Moon Sign)</strong> reveals your inner
                                    emotional landscape. In the VaidikGuru system, we prioritise the Moon
                                    because it governs the <em>Manas</em> (mind), determining how you
                                    process experiences and interact with the world on a subconscious
                                    level.
                                </p>
                                <div>
                                    <span className="jr-pill">Lunar Mindset</span>
                                    <span className="jr-pill">Subconscious Habits</span>
                                    <span className="jr-pill">Karmic Memory</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="jr-maroon p-4 p-md-5 h-100">
                                <h3 className="text-white h5 fw-bold mb-4">The Elemental Temperament</h3>
                                {elements.map((el) => (
                                    <div className="jr-elem" key={el.name}>
                                        <span className="jr-elem-name">
                                            <span>{el.icon}</span> {el.name}
                                        </span>
                                        <span className="jr-elem-trait">{el.trait}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Three insight cards */}
                        {insights.map((c) => (
                            <div className="col-12 col-md-4" key={c.t}>
                                <div className={`jr-insight ${c.highlight ? 'hl' : ''}`}>
                                    <h4>{c.t}</h4>
                                    <p>{c.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= FAQ ================= */}
            <div className="jr-page">
                <div className="container">
                    <div className="pd-faq-wrap">
                        <div className="pd-sec-eyebrow">
                            <span className="pd-eyebrow-line" />
                            <i className="fas fa-om" /> Frequently Asked Questions{' '}
                            <i className="fas fa-om" />
                            <span className="pd-eyebrow-line" />
                        </div>
                        <div className="pd-faq-grid">
                            {JR_FAQS.map((f, i) => (
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

export default JanmaRashiFinder;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';

const pad = (n) => String(n).padStart(2, '0');

const MG_FAQS = [
    {
        q: 'Can a Manglik marry a non-Manglik?',
        a: "Yes, provided the charts are matched for 'Dosha Samya' (balancing factors). VaidikGuru analysis can identify if a non-Manglik chart has enough planetary strength to handle a Manglik spouse.",
    },
    {
        q: 'What is Anshik vs Purna Manglik?',
        a: 'Anshik (partial) Manglik means Mars sits in a Manglik house but is weakened or partially cancelled, giving a milder effect. Purna (full) Manglik means the Dosha is strong and uncancelled, requiring careful matching or remedies.',
    },
    {
        q: 'Why does VaidikGuru need my birth time?',
        a: 'Mangal Dosha depends on the exact house Mars occupies from the Lagna (Ascendant), and the Ascendant changes roughly every two hours. Without an accurate birth time, the house placement \u2014 and the Dosha itself \u2014 cannot be confirmed.',
    },
    {
        q: 'Are remedies permanent?',
        a: 'Remedies such as mantras, fasts, and specific pujas reduce the intensity of the Dosha and are most effective when practised consistently. Many effects also naturally soften with age, especially after the maturity of Mars around 28.',
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

const MangalDoshaFinder = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Live "Mars Transit Today" for Delhi (default)
    const [todayData] = useState({
        location: 'Delhi, India',
        transit: 'Leo',
        energy: 'Fiery / Intense',
        time: '02:22:45 IST',
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
                status: 'Anshik Manglik',
                house: '7th House',
                cancellation: 'Partially Cancelled',
                severity: 'Low – Moderate',
                reading:
                    'Mars sits in your 7th house but receives a benefic aspect that softens its heat. With conscious matching this is an easily balanced, partial Dosha rather than a marriage obstacle.',
            });
            setLoading(false);
            window.scrollTo({ top: 380, behavior: 'smooth' });
        }, 1500);
    };

    const placements = [
        { k: '1st House', v: 'Self & Temperament' },
        { k: '4th House', v: 'Home & Inner Peace' },
        { k: '7th House', v: 'Direct Union Impact' },
        { k: '8th House', v: 'Longevity & Bonding' },
        { k: '12th House', v: 'Intimacy & Expenses' },
    ];

    const insights = [
        {
            t: 'Does it Cancel?',
            d: "VaidikGuru accounts for over 20 cancellation rules, including Jupiter's aspect or Mars in its own sign, which can neutralise even a heavy Dosha.",
        },
        {
            t: 'The Age 28 Factor',
            d: 'Mars reaches full maturity at 28. Usually, the impulsiveness of the Dosha naturally stabilises after this birthday.',
        },
        {
            t: 'Compatibility',
            d: 'Mangal Dosha is a key metric in Guna Milan, ensuring that two life-forces vibrate at a compatible frequency.',
            highlight: true,
        },
    ];

    return (
        <div className="main-wrapper mg-page">
            <Header />

            {/* ================= SCOPED STYLES ================= */}
            <style>{`
                .mg-page { background: #f7f5f0; }
                .mg-shell { padding: 24px 0 90px; }

                /* Banner */
                .mg-banner {
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
                .mg-banner::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(90deg, rgba(48,10,20,.86) 0%, rgba(48,10,20,.55) 45%, rgba(48,10,20,.15) 100%);
                }
                .mg-banner-inner { position: relative; z-index: 2; max-width: 780px; }
                .mg-eyebrow { color: #f0b64a; letter-spacing: .3em; font-size: 13px; font-weight: 700; text-transform: uppercase; }
                .mg-title { color: #fff; font-weight: 800; line-height: 1.05; font-size: clamp(34px, 5vw, 56px); margin: 10px 0 14px; }
                .mg-title span { color: #f0b64a; }
                .mg-sub { color: rgba(255,255,255,.82); max-width: 600px; margin: 0 auto; }
                .mg-underline { width: 120px; height: 3px; background: #f0b64a; border-radius: 3px; margin: 20px auto 0; }

                /* Cards */
                .mg-card { background: #fff; border: 1px solid #efece6; border-radius: 20px; box-shadow: 0 6px 26px rgba(0,0,0,.05); }
                .mg-maroon { background: linear-gradient(160deg, #5b1a2e 0%, #33101d 100%); color: #fff; border-radius: 20px; }

                .mg-live { display:flex; justify-content:space-between; align-items:center; }
                .mg-live-tag { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.65); font-weight: 700; }
                .mg-live-dot { width: 9px; height: 9px; border-radius: 50%; background: #ff5a4d; box-shadow: 0 0 0 4px rgba(255,90,77,.2); }
                .mg-live-gold { color: #f0b64a; font-weight: 800; }

                .mg-mini { display:flex; gap:13px; align-items:center; padding: 15px 16px; }
                .mg-mini-ico { width: 44px; height: 44px; border-radius: 13px; background: #fdeef2; color: #c23a63; display:flex; align-items:center; justify-content:center; font-size: 18px; flex-shrink:0; }
                .mg-mini-lbl { font-size: 11.5px; color: #9a8f95; margin: 0; }
                .mg-mini-val { font-size: 14px; font-weight: 700; color: #3a0d16; margin: 0; }

                /* Form */
                .mg-form-title { color: #c23a63; font-weight: 800; }
                .mg-label { display:block; font-size: 12px; font-weight: 700; color: #c23a63; margin-bottom: 7px; }
                .mg-input { width: 100%; border: 1px solid #ececec; background: #faf7f8; border-radius: 12px; padding: 13px 16px; font-size: 14px; color: #3a0d16; transition: .18s; }
                .mg-input::placeholder { color: #b7adb1; }
                .mg-input:focus { outline: none; border-color: #c23a63; background:#fff; box-shadow: 0 0 0 3px rgba(194,58,99,.14); }
                .mg-btn { width: 100%; border: none; border-radius: 12px; padding: 14px; font-weight: 700; color: #fff; letter-spacing:.02em; background: linear-gradient(135deg, #b8496b, #9d2f52); cursor: pointer; transition: .2s; box-shadow: 0 8px 20px rgba(157,47,82,.28); }
                .mg-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
                .mg-btn:disabled { opacity: .7; cursor: default; transform:none; }

                /* Result */
                .mg-empty { border: 2px dashed #e2ddd5; border-radius: 20px; min-height: 100%; display:flex; align-items:center; justify-content:center; text-align:center; padding: 40px; color: #a79f9a; }
                .mg-empty-ico { width: 64px; height: 64px; border-radius: 50%; background: #eef7fb; color: #4bb3d6; display:flex; align-items:center; justify-content:center; margin: 0 auto 16px; font-size: 24px; }
                .mg-glass { background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12); border-radius: 13px; padding: 14px; }
                .mg-glass-lbl { font-size: 11px; color: rgba(255,255,255,.5); margin: 0 0 4px; }
                .mg-glass-val { font-size: 15px; font-weight: 700; color: #fff; margin: 0; }
                .mg-btn-ghost { background: #f0b64a; color: #3a0d16; border:none; font-weight:700; font-size:13px; padding: 9px 18px; border-radius: 10px; cursor:pointer; }

                /* Info */
                .mg-info-title { color: #c23a63; font-weight: 800; }
                .mg-icon-circle { width: 52px; height: 52px; border-radius: 14px; background: #eef7fb; display:flex; align-items:center; justify-content:center; margin-bottom: 18px; }
                .mg-pill { display:inline-block; background:#f4f1fb; color:#5b3fb0; font-size:12px; font-weight:600; padding:7px 15px; border-radius:20px; margin: 6px 8px 0 0; }

                /* Placement list */
                .mg-elem { display:flex; align-items:center; justify-content:space-between; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,.09); }
                .mg-elem:last-child { border-bottom: none; }
                .mg-elem-name { color: #fff; font-size: 14px; display:flex; align-items:center; gap: 10px; }
                .mg-elem-trait { color: #f0b64a; font-size: 13px; font-weight: 700; }

                /* Insight small cards */
                .mg-insight { background:#fff; border:1px solid #efece6; border-radius: 18px; padding: 26px; height: 100%; box-shadow: 0 6px 22px rgba(0,0,0,.04); }
                .mg-insight.hl { background:#f6f9ff; border-color:#dbe6ff; }
                .mg-insight h4 { font-size: 18px; font-weight: 800; color:#c23a63; margin-bottom: 12px; }
                .mg-insight.hl h4 { color:#3f6fd8; }
                .mg-insight p { font-size: 13.5px; color:#7a7a7a; line-height:1.7; margin:0; }

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

                @media (max-width: 991px){ .mg-banner{ min-height: 210px; padding: 48px 20px; } }
                @media (max-width: 767px){
                    .pd-faq-grid { grid-template-columns: 1fr; gap: 0; }
                    .pd-faq-wrap { padding: 28px 0 6px; }
                }
            `}</style>

            {/* ================= BANNER HERO ================= */}
            <div className="mg-shell">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mg-banner"
                    >
                        <div className="mg-banner-inner">
                            <div className="mg-eyebrow">Marriage Science</div>
                            <h1 className="mg-title">
                                Mangal Dosha <span>Finder</span>
                            </h1>
                            <p className="mg-sub">
                                Analyze Martian influence on your birth chart to ensure long-term
                                relationship harmony and peace.
                            </p>
                            <div className="mg-underline" />
                        </div>
                    </motion.div>

                    {/* ================= MAIN ROW ================= */}
                    <div className="row g-4 mt-1">
                        {/* SIDEBAR */}
                        <div className="col-12 col-lg-3">
                            <div className="mg-maroon p-4 mb-4">
                                <div className="mg-live mb-3">
                                    <span className="mg-live-tag">Mars Transit Today</span>
                                    <span className="mg-live-dot" />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <p className="mg-mini-lbl mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
                                            Current Transit
                                        </p>
                                        <h3 className="mg-live-gold mb-0 h4">{todayData.transit}</h3>
                                    </div>
                                    <div className="col-6">
                                        <p className="mg-mini-lbl mb-1" style={{ color: 'rgba(255,255,255,.55)' }}>
                                            Energy Type
                                        </p>
                                        <h4 className="text-white mb-0 h6 mt-1">{todayData.energy}</h4>
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

                            <div className="mg-card mg-mini mb-3">
                                <div className="mg-mini-ico">
                                    <i className="fas fa-fire" />
                                </div>
                                <div>
                                    <p className="mg-mini-lbl">What We Analyze</p>
                                    <p className="mg-mini-val">Mars &amp; House</p>
                                </div>
                            </div>

                            <div className="mg-card mg-mini">
                                <div className="mg-mini-ico">
                                    <i className="fas fa-phone-alt" />
                                </div>
                                <div>
                                    <p className="mg-mini-lbl">Contact Us</p>
                                    <p className="mg-mini-val">support@vaidikguru.com</p>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <div className="mg-card p-4 h-100">
                                <h3 className="mg-form-title h4 mb-4">Enter Birth Details</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="mg-label">Full Name</label>
                                        <input name="name" type="text" className="mg-input" placeholder="Rahul Sharma" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="mg-label">Email Address</label>
                                        <input name="email" type="email" className="mg-input" placeholder="rahul@VaidikGuru.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="mg-label">Birth Date</label>
                                            <input name="date" type="date" className="mg-input" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="mg-label">Birth Time</label>
                                            <input name="time" type="time" className="mg-input" required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="mg-label">Birth Location</label>
                                        <input name="place" type="text" className="mg-input" placeholder="City, Country" required />
                                    </div>
                                    <button type="submit" className="mg-btn" disabled={loading}>
                                        {loading ? 'Analyzing Mars...' : 'Check Manglik Status'}
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
                                        className="mg-empty h-100"
                                    >
                                        <div>
                                            <div className="mg-empty-ico">
                                                <i className="fas fa-fire" />
                                            </div>
                                            <p className="mb-0">
                                                Mars placement and dosha <br />
                                                analysis will appear here.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.96, y: 16 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mg-maroon p-4 p-md-5 h-100"
                                    >
                                        <div className="text-center mb-4">
                                            <span className="mg-eyebrow" style={{ letterSpacing: '.2em' }}>
                                                Your Manglik Status
                                            </span>
                                            <h2 className="text-white display-6 mb-0 mt-1">{result.status}</h2>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: 'Mars House', v: result.house },
                                                { l: 'Cancellation', v: result.cancellation },
                                                { l: 'Severity', v: result.severity },
                                                { l: 'Energy Type', v: 'Fiery / Intense' },
                                            ].map((s, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="mg-glass">
                                                        <p className="mg-glass-lbl">{s.l}</p>
                                                        <p className="mg-glass-val">{s.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mg-glass mt-3">
                                            <p className="mg-glass-lbl" style={{ color: '#f0b64a', fontWeight: 700 }}>
                                                VaidikGuru Dosha Insight
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
                                            <button className="mg-btn-ghost">Talk to Astrologer</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ================= SCIENCE SECTION ================= */}
                    <div className="text-center mt-5 pt-4 mb-4">
                        <div className="mg-eyebrow" style={{ color: '#e0982a', letterSpacing: '.18em' }}>
                            The Martian Power
                        </div>
                        <h2 className="fw-bold mt-2" style={{ color: '#2a2a2a' }}>
                            The Science of{' '}
                            <span style={{ color: '#7c5cff' }}>Mangal Dosha</span>
                        </h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-lg-7">
                            <div className="mg-card p-4 p-md-5 h-100">
                                <div className="mg-icon-circle">
                                    <i className="fas fa-fire" style={{ color: '#4bb3d6', fontSize: 20 }} />
                                </div>
                                <h3 className="mg-info-title h4 mb-3">Understanding Manglik Status</h3>
                                <p className="text-muted mb-4" style={{ lineHeight: 1.75 }}>
                                    Mangal Dosha is a celestial condition identified by VaidikGuru when
                                    Mars is positioned in the 1st, 4th, 7th, 8th, or 12th house. While
                                    commonly feared, Vedic science views it as a specific
                                    high-intensity energy profile that requires conscious balancing
                                    for marital success.
                                </p>
                                <div>
                                    <span className="mg-pill">Energy Analysis</span>
                                    <span className="mg-pill">Kuja Dosha</span>
                                    <span className="mg-pill">Relationship Heat</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="mg-maroon p-4 p-md-5 h-100">
                                <h3 className="text-white h5 fw-bold mb-4">Critical Placements</h3>
                                {placements.map((p) => (
                                    <div className="mg-elem" key={p.k}>
                                        <span className="mg-elem-name">{p.k}</span>
                                        <span className="mg-elem-trait">{p.v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Three insight cards */}
                        {insights.map((c) => (
                            <div className="col-12 col-md-4" key={c.t}>
                                <div className={`mg-insight ${c.highlight ? 'hl' : ''}`}>
                                    <h4>{c.t}</h4>
                                    <p>{c.d}</p>
                                </div>
                            </div>
                        ))}
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
                            {MG_FAQS.map((f, i) => (
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

export default MangalDoshaFinder;
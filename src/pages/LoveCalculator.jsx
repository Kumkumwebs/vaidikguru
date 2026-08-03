import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';

const pad = (n) => String(n).padStart(2, '0');

const LOVE_FAQS = [
    {
        q: 'Is this Love Calculator 100% accurate?',
        a: 'This tool is based on generalized Vedic algorithms for entertainment purposes. For actual marriage decisions, a comprehensive manual Kundli Milan by a VaidikGuru expert is advised.',
    },
    {
        q: 'What if our Guna score is low?',
        a: "A low score isn't a failure notice. It highlights specific friction points (like communication or health) that partners can consciously work on or balance through remedies.",
    },
    {
        q: 'Does this calculator check Mangal Dosha?',
        a: 'No, this specific tool focuses on Ashta Koota (36 Gunas). Mangal Dosha is a separate analysis which can be checked on our dedicated Mangal Dosha Calculator.',
    },
    {
        q: 'What is a good score for marriage?',
        a: "Traditionally, any score above 18 out of 36 is considered acceptable, provided there are no major 'Maha-Doshas' like Nadi or Bhakoot Dosha.",
    },
];

const LoveFaqItem = ({ num, q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="lc-faq-item" onClick={() => setOpen((o) => !o)}>
            <div className="lc-faq-q">
                <span className="lc-faq-num">{pad(num)}</span>
                <span className="lc-faq-text">{q}</span>
                <div className="lc-faq-toggle">
                    <i className={`fas fa-${open ? 'minus' : 'plus'}`} />
                </div>
            </div>
            {open && <div className="lc-faq-ans">{a}</div>}
        </div>
    );
};

const LoveCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Love Energy" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        venusPosition: "Pisces (Exalted)",
        energy: "High / Romantic",
        time: "02:27:32 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        // --- VEDIC BACKEND LOGIC (Simulated Guna Milan) ---
        setTimeout(() => {
            const gunas = Math.floor(Math.random() * (36 - 16 + 1)) + 16;
            let verdict = "Average Match";
            if (gunas >= 30) verdict = "Celestial Union";
            else if (gunas >= 25) verdict = "Highly Compatible";
            else if (gunas >= 18) verdict = "Good Compatibility";
            else verdict = "Requires Guidance";

            setResult({
                name1: e.target.name1.value,
                name2: e.target.name2.value,
                score: gunas,
                status: verdict,
                bhakoot: gunas > 25 ? "Strong" : "Balanced",
                yoni: gunas > 20 ? "Friendly" : "Neutral",
                varna: "Compatible",
                gan: gunas > 22 ? "Aligned" : "Neutral",
                verdict: gunas >= 18
                    ? "Your planetary energies align for a harmonious long-term bond."
                    : "Astrological frictions detected; mutual effort is essential."
            });
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* CELESTIAL HERO BANNER — image + maroon gradient overlay, standalone rounded card */}
            <div className="container pt-40">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="position-relative overflow-hidden rounded-25 d-flex align-items-center justify-content-center text-center"
                    style={{
                        minHeight: '300px',
                        padding: '70px 30px',
                        backgroundImage:
                            "linear-gradient(100deg, #2c0a17 0%, #3d0f21 46%, rgba(61,15,33,.55) 68%, rgba(61,15,33,0) 100%), url('/assets/img/images/profile-hero-banner.jpeg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="position-relative" style={{ zIndex: 2, maxWidth: '640px' }}>
                        <span
                            className="d-block mb-3 fw-semibold"
                            style={{ color: '#f5bc5e', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase' }}
                        >
                            Vedic Guna Milan
                        </span>
                        <h1 className="text-white mb-3" style={{ fontSize: '3rem', lineHeight: 1.1 }}>
                            Vedic Love <span style={{ color: '#f0a530' }}>Finder</span>
                        </h1>
                        <p className="mb-0" style={{ color: '#e7d9dd' }}>
                            Calculate your relationship strength based on the ancient 36 Guna system of Indian Vedic Astrology.
                        </p>
                        <div className="mx-auto mt-4" style={{ width: '64px', height: '3px', background: '#f0a530', borderRadius: '2px' }} />
                    </div>
                </motion.div>
            </div>

            {/* CALCULATOR SECTION — live card / form / result, 3-column like Nakshatra Finder */}
            <section className="py-10 bg-smoke">
                <div className="container">
                    <div className="row g-4 align-items-stretch">

                        {/* LIVE INFO COLUMN */}
                        <div className="col-lg-3">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="p-4 rounded-25 text-white mb-4"
                                style={{ background: 'linear-gradient(160deg, #3d0f21, #2c0a17)' }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="small opacity-75" style={{ color: '#d9b9c4', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px' }}>
                                        Today in Delhi, India
                                    </span>
                                    <span
                                        className="d-flex align-items-center gap-1 fw-bold px-2 py-1 rounded-pill"
                                        style={{ background: '#f0a530', color: '#2c0a17', fontSize: '10px', textTransform: 'uppercase' }}
                                    >
                                        <span className="pulse-live" style={{ backgroundColor: '#2c0a17', width: '6px', height: '6px', borderRadius: '50%' }}></span>
                                        Live
                                    </span>
                                </div>
                                <div className="row align-items-center mb-3">
                                    <div className="col-6">
                                        <p className="small mb-1" style={{ color: '#d9b9c4' }}>Venus Transit</p>
                                        <h3 className="mb-0" style={{ color: '#f5bc5e' }}>{todayData.venusPosition.split(' ')[0]}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-3">
                                        <p className="small mb-1" style={{ color: '#d9b9c4' }}>Energy</p>
                                        <h4 className="text-white mb-0 h5">{todayData.energy.split(' ')[0]}</h4>
                                    </div>
                                </div>
                                <div className="pt-3 border-top border-white-10 small d-flex justify-content-between" style={{ color: '#e7d3da' }}>
                                    <span>{todayData.location}</span>
                                    <span>{todayData.time}</span>
                                </div>
                            </motion.div>

                            <div className="bg-white p-4 rounded-25 shadow-sm">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-15" style={{ width: '38px', height: '38px', background: '#efe8db', flexShrink: 0 }}>
                                        <img src="assets/img/icon/about_1_1.svg" width="18" alt="" />
                                    </div>
                                    <div>
                                        <small className="d-block text-muted" style={{ fontSize: '10px', textTransform: 'uppercase' }}>What We Match</small>
                                        <strong className="small">36 Guna System</strong>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center justify-content-center rounded-15" style={{ width: '38px', height: '38px', background: '#efe8db', flexShrink: 0 }}>
                                        <img src="assets/img/icon/contact.svg" width="18" alt="" />
                                    </div>
                                    <div>
                                        <small className="d-block text-muted" style={{ fontSize: '10px', textTransform: 'uppercase' }}>Contact Us</small>
                                        <strong className="small">support@vaidikguru.com</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="col-lg-4">
                            <div className="bg-white py-20 px-20 rounded-25 shadow-sm border border-light h-100">
                                <h3 className="h4 mb-30">Check Your Bond</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Partner 1</label>
                                            <input name="name1" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="P1 Name" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">Partner 2</label>
                                            <input name="name2" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="P2 Name" required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Contact Email</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="rahul@VaidikGuru.com" required />
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">P1 Birth Date</label>
                                            <input type="date" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                        <div className="col-6">
                                            <label className="small fw-bold mb-2">P2 Birth Date</label>
                                            <input type="date" className="form-control input-modern py-3 rounded-inner" required />
                                        </div>
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0">
                                        {loading ? "Matching Stars..." : "Find Compatibility"}
                                    </button>
                                </form>
                                <div className="mt-4 p-2 bg-light rounded-15 border border-dashed text-center">
                                    <p className="xsmall text-muted mb-0" style={{ fontSize: '11px' }}>
                                        *Note: This tool is based on generalized Vedic logic for <strong>fun and entertainment purposes only</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RESULT BOX */}
                        <div className="col-lg-5">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-100 rounded-25 border-2 border-dashed border-light d-flex align-items-center justify-content-center text-center p-5 bg-white">
                                        <div className="opacity-30">
                                            <img src="assets/img/icon/about_1_1.svg" width="60" className="mb-3" alt="" />
                                            <p>Ashta Koota matching scores <br /> will appear here.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Compatibility Result</span>
                                            <h2 className="text-white display-5 mb-1 mt-2">{result.score} <small className="h5 opacity-50">/ 36</small></h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill">{result.status}</div>

                                            {/* GUNA PROGRESS BAR */}
                                            <div className="mt-4">
                                                <div className="progress bg-white-10" style={{ height: '10px', borderRadius: '10px' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(result.score / 36) * 100}%` }}
                                                        className="progress-bar bg-theme"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Mental Match", v: result.bhakoot },
                                                { l: "Temperament", v: result.varna },
                                                { l: "Nature (Yoni)", v: result.yoni },
                                                { l: "Lineage (Gan)", v: result.gan }
                                            ].map((item, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="glass-stat p-3 rounded-inner">
                                                        <p className="small text-white-50 mb-1">{item.l}</p>
                                                        <p className="text-white fw-bold mb-0">{item.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 bg-white-10 p-3 rounded-inner border border-white-10">
                                            <p className="small text-theme fw-bold mb-1">VaidikGuru Vedic Verdict:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.verdict}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small">Manual Review</button>
                                            <span className="text-white-50 small">{result.name1} & {result.name2}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCIENCE OF UNION — themed bento to match maroon/gold identity */}
            <section className="lc-science">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="lc-science__eyebrow">The Science of Union</span>
                        <h2 className="lc-science__title">Decoding the <span className="lc-science__accent">36 Gunas</span></h2>
                    </div>

                    <div className="lc-bento-grid">
                        <div className="lc-card lc-bento-main">
                            <div className="lc-bento-main__icon">
                                <img src="assets/img/icon/about_1_1.svg" width="26" alt="" />
                            </div>
                            <h3 className="lc-heading">How Vedic Matching Works?</h3>
                            <p className="lc-prose">
                                In the VaidikGuru system, compatibility is assessed through <strong>Ashta Koota Matching</strong>. This maps 8 critical dimensions of life—from mental health and mutual attraction to longevity and potential for progeny. A score of 18 is the traditional baseline for stability.
                            </p>
                            <div className="lc-pill-row">
                                <span className="lc-pill">Mental Synergy</span>
                                <span className="lc-pill">Emotional DNA</span>
                                <span className="lc-pill">Nadi Match</span>
                            </div>
                        </div>

                        <div className="lc-bento-side">
                            <h3 className="lc-bento-side__title">Score Interpretation</h3>
                            <div className="lc-score-row">
                                <span>31 – 36 Points</span>
                                <span className="lc-score-val lc-score-val--great">Excellent Bond</span>
                            </div>
                            <div className="lc-score-row">
                                <span>21 – 30 Points</span>
                                <span className="lc-score-val lc-score-val--good">Very Good</span>
                            </div>
                            <div className="lc-score-row lc-score-row--last">
                                <span>Below 18 Points</span>
                                <span className="lc-score-val lc-score-val--low">Guidance Needed</span>
                            </div>
                        </div>
                    </div>

                    <div className="lc-mini-grid">
                        <div className="lc-card lc-mini-card">
                            <h4 className="lc-mini-card__title">Moon Sign Role</h4>
                            <p className="lc-mini-card__text">
                                Compatibility is calculated based on the Moon's placement, as it governs the subconscious mind and emotional reactions.
                            </p>
                        </div>
                        <div className="lc-card lc-mini-card">
                            <h4 className="lc-mini-card__title">Nadi Koota</h4>
                            <p className="lc-mini-card__text">
                                The most important factor (8 points), Nadi determines physiological compatibility and the health of future generations.
                            </p>
                        </div>
                        <div className="lc-card lc-mini-card">
                            <h4 className="lc-mini-card__title">Soul Connection</h4>
                            <p className="lc-mini-card__text">
                                Bhakoot analysis ensures that both souls vibrate at a frequency that supports mutual spiritual and mental growth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ (Nakshatra-style numbered accordion) ── */}
            <section className="lc-faq-wrap">
                <div className="container">
                    <div className="lc-sec-eyebrow">
                        <span className="lc-eyebrow-line" />
                        <i className="fas fa-om" /> Frequently Asked Questions{" "}
                        <i className="fas fa-om" />
                        <span className="lc-eyebrow-line" />
                    </div>
                    <div className="lc-faq-grid">
                        {LOVE_FAQS.map((f, i) => (
                            <LoveFaqItem key={i} num={i + 1} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            <style>{`
                .lc-science { padding: 70px 0; background: #faf7f2; }
                .lc-science__eyebrow {
                    display: block; font-family: 'Playfair Display', serif; font-style: italic;
                    color: #f0a530; font-size: 17px; margin-bottom: 8px;
                }
                .lc-science__title { font-size: 32px; font-weight: 800; color: #241318; }
                .lc-science__accent { color: #a4436c; }

                .lc-card {
                    background: #ffffff; border-radius: 18px; box-shadow: 0 4px 20px rgba(61,15,33,0.06);
                }

                .lc-bento-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 22px; margin-bottom: 24px; align-items: stretch; }
                .lc-bento-main { padding: 34px; display: flex; flex-direction: column; justify-content: center; }
                .lc-bento-main__icon {
                    width: 48px; height: 48px; border-radius: 14px; background: #efe8db;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
                }
                .lc-heading { font-size: 21px; font-weight: 800; color: #8a3559; margin: 0 0 14px; }
                .lc-prose { font-size: 14.5px; line-height: 1.85; color: #5a4a50; }
                .lc-pill-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
                .lc-pill { background: #efe8db; color: #5c1730; font-size: 12px; font-weight: 600; padding: 7px 15px; border-radius: 50px; }

                .lc-bento-side {
                    background: linear-gradient(160deg, #a4436c, #3d0f21);
                    border-radius: 18px; padding: 34px; color: #fff;
                    box-shadow: 0 10px 30px rgba(43,15,35,0.25);
                }
                .lc-bento-side__title { font-size: 18px; font-weight: 800; margin: 0 0 20px; }
                .lc-score-row {
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 13.5px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.18);
                    color: rgba(255,255,255,0.8);
                }
                .lc-score-row--last { border-bottom: none; }
                .lc-score-val { font-weight: 700; }
                .lc-score-val--great { color: #8fe6b0; }
                .lc-score-val--good { color: #f5bc5e; }
                .lc-score-val--low { color: #f4a1a1; }

                .lc-mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                .lc-mini-card { padding: 26px; }
                .lc-mini-card__title { font-size: 16px; font-weight: 700; color: #8a3559; margin: 0 0 10px; }
                .lc-mini-card__text { font-size: 13.5px; color: #5a4a50; line-height: 1.7; margin: 0; }

                @media (max-width: 991px) {
                    .lc-bento-grid { grid-template-columns: 1fr; }
                    .lc-mini-grid { grid-template-columns: 1fr; }
                }

                .lc-faq-wrap { padding: 30px 0 70px; border-top: 1px solid #f0e8e0; }
                .lc-sec-eyebrow {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    font-size: 12px; font-weight: 700; color: #a4436c; letter-spacing: 1.2px;
                    text-transform: uppercase; margin-bottom: 30px; flex-wrap: wrap; text-align: center;
                }
                .lc-sec-eyebrow i { font-size: 11px; }
                .lc-eyebrow-line { flex: 1; max-width: 55px; height: 1px; background: #f0d0a8; }
                .lc-faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 36px; }
                .lc-faq-item { border-bottom: 1px solid #f0e8e0; cursor: pointer; }
                .lc-faq-q { display: flex; align-items: center; gap: 10px; padding: 14px 0; font-size: 13.5px; color: #333; }
                .lc-faq-num { font-size: 14px; font-weight: 700; color: #f0a530; width: 26px; flex-shrink: 0; }
                .lc-faq-text { flex: 1; font-weight: 500; }
                .lc-faq-toggle { width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid #ddd; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .lc-faq-toggle i { font-size: 10px; color: #888; }
                .lc-faq-ans { font-size: 13px; color: #777; padding: 0 0 14px 36px; line-height: 1.65; }

                @media (max-width: 767px) {
                    .lc-faq-grid { grid-template-columns: 1fr; gap: 0; }
                }
            `}</style>
        </div>
    );
};

export default LoveCalculator;
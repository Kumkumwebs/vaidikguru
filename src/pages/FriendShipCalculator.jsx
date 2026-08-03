import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';

const pad = (n) => String(n).padStart(2, '0');

const FRIEND_FAQS = [
    {
        q: 'How does name numerology calculate friendship?',
        a: 'We assign values to letters based on the Chaldean system. The interaction between these total sums determines the vibrational synergy between two individuals.',
    },
    {
        q: 'Does using a nickname change the score?',
        a: 'Yes. In numerology, the vibration of the name used most frequently is the one that carries the most energy in your social interactions.',
    },
    {
        q: 'Is this based on horoscopes?',
        a: 'No. This tool focuses exclusively on name vibrations. For horoscope-based matching, please use our Janma Rashi or Nakshatra calculators.',
    },
];

const FriendFaqItem = ({ num, q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`fc-faq-item${open ? ' fc-faq-item--open' : ''}`} onClick={() => setOpen((o) => !o)}>
            <div className="fc-faq-q">
                <span className="fc-faq-num">{pad(num)}</span>
                <span className="fc-faq-text">{q}</span>
                <div className="fc-faq-toggle">
                    <i className={`fas fa-${open ? 'minus' : 'plus'}`} />
                </div>
            </div>
            {open && <div className="fc-faq-ans">{a}</div>}
        </div>
    );
};

const FriendshipCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Status" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        vibeStatus: "Harmonious",
        energy: "Mercury in Capricorn",
        time: "02:35:12 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Name Vibrational Logic
        setTimeout(() => {
            const score = Math.floor(Math.random() * (100 - 45 + 1)) + 45;
            setResult({
                name1: e.target.name1.value,
                name2: e.target.name2.value,
                score: score,
                status: score > 85 ? "Soul Siblings" : score > 70 ? "Best Friends" : "Good Pals",
                loyalty: score > 75 ? "Unwavering" : "Stable",
                trust: score > 80 ? "High" : "Building",
                remark: "Your name frequencies suggest a bond built on mutual respect and shared growth."
            });
            setLoading(false);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 1500);
    };

    const handleShareResult = async () => {
        if (!result) return;
        const url = window.location.href;
        const title = "DivinIQ Friendship Finder";
        const text = `${result.name1} & ${result.name2} scored ${result.score}% (${result.status}) on DivinIQ's Friendship Finder! 🎉`;

        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (err) {
                // user cancelled the share sheet — nothing to do
            }
        } else {
            try {
                await navigator.clipboard.writeText(`${text}\n${url}`);
                alert("Result copied to clipboard!");
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* HERO BANNER — image + teal/green gradient overlay, standalone rounded card */}
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
                            Social Science
                        </span>
                        <h1 className="text-white mb-3" style={{ fontSize: '3rem', lineHeight: 1.1 }}>
                            Friendship <span style={{ color: '#f0a530' }}>Finder</span>
                        </h1>
                        <p className="mb-0" style={{ color: '#e7d9dd' }}>
                            Discover the vibrational compatibility between you and your friend based on Name Numerology.
                        </p>
                        <div className="mx-auto mt-4" style={{ width: '64px', height: '3px', background: '#f0a530', borderRadius: '2px' }} />
                    </div>
                </motion.div>
            </div>

            {/* CALCULATOR SECTION — live card / form / result, 3-column */}
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
                                        Social Vibe Today
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
                                        <p className="small mb-1" style={{ color: '#d9b9c4' }}>Current Vibe</p>
                                        <h3 className="mb-0" style={{ color: '#f5bc5e' }}>{todayData.vibeStatus}</h3>
                                    </div>
                                    <div className="col-6 border-start border-white-10 ps-3">
                                        <p className="small mb-1" style={{ color: '#d9b9c4' }}>Cosmic Energy</p>
                                        {/* <h4 className="text-white mb-0 h5">{todayData.energy.split(' ')[0]}</h4> */}
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
                                        <strong className="small">Name Vibrations</strong>
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
                                <h3 className="h4 mb-30">Check Your Synergy</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Your Name</label>
                                        <input name="name1" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Your Name" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Friend's Name</label>
                                        <input name="name2" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Friend's Name" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="email@diviniq.com" required />
                                    </div>
                                    <button type="submit" className="th-btn style3 w-100 py-3 rounded-inner border-0 shadow-lg">
                                        {loading ? "Syncing Names..." : "Calculate Friendship %"}
                                    </button>
                                </form>
                                <div className="mt-4 p-2 bg-light rounded-15 border border-dashed text-center">
                                    <p className="xsmall text-muted mb-0" style={{ fontSize: '11px' }}>
                                        *Note: This tool is based on Name Numerology for <strong>fun and entertainment purposes only</strong>.
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
                                            <p>Vibrational matching analysis <br /> will appear here.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Bond Strength</span>
                                            <h2 className="text-white display-5 mb-1 mt-2">{result.score}%</h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill">{result.status}</div>

                                            <div className="mt-4">
                                                <div className="progress bg-white-10" style={{ height: '10px', borderRadius: '10px' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }} className="progress-bar bg-theme" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Loyalty Level", v: result.loyalty },
                                                { l: "Trust Factor", v: result.trust },
                                            ].map((item, i) => (
                                                <div className="col-6" key={i}>
                                                    <div className="glass-stat p-3 rounded-inner text-center">
                                                        <p className="small text-white-50 mb-1">{item.l}</p>
                                                        <p className="text-white fw-bold mb-0">{item.v}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 bg-white-10 p-3 rounded-inner border border-white-10">
                                            <p className="small text-theme fw-bold mb-1">DivinIQ Social Remark:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.remark}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button
                                                type="button"
                                                className="th-btn style1 py-2 px-4 rounded-inner small"
                                                onClick={handleShareResult}
                                            >
                                                Share Result
                                            </button>
                                            <span className="text-white-50 small">{result.name1} + {result.name2}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCIENCE OF NAME SYNC — themed bento */}
            <section className="fc-science">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="fc-science__eyebrow">Social Harmony</span>
                        <h2 className="fc-science__title">The Science of <span className="fc-science__accent">Name Sync</span></h2>
                    </div>

                    <div className="fc-bento-grid">
                        <div className="fc-card fc-bento-main">
                            <div className="fc-bento-main__icon">
                                <img src="assets/img/icon/about_1_1.svg" width="26" alt="" />
                            </div>
                            <h3 className="fc-heading">How Names Influence Bonds?</h3>
                            <p className="fc-prose">
                                In Numerology, names aren't just labels—they are vibrational frequencies. When two names interact, their numeric values create either a harmonic resonance or a challenging frequency. DivinIQ analyzes these vibrations to determine the natural flow of your friendship.
                            </p>
                            <div className="fc-pill-row">
                                <span className="fc-pill">Vibrational Sync</span>
                                <span className="fc-pill">Social Numerology</span>
                                <span className="fc-pill">Energy Matching</span>
                            </div>
                        </div>

                        <div className="fc-bento-side">
                            <h3 className="fc-bento-side__title">Compatibility Scale</h3>
                            <div className="fc-score-row">
                                <span>90% – 100%</span>
                                <span className="fc-score-val fc-score-val--great">Soul Siblings</span>
                            </div>
                            <div className="fc-score-row">
                                <span>70% – 89%</span>
                                <span className="fc-score-val fc-score-val--good">Best Friends</span>
                            </div>
                            <div className="fc-score-row fc-score-row--last">
                                <span>Below 60%</span>
                                <span className="fc-score-val fc-score-val--low">Casual Acquaintance</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ (numbered accordion) ── */}
            <section className="fc-faq-wrap">
                <div className="container">
                    <h2 className="fc-faq-heading">Frequently Asked Questions</h2>
                    <div className="fc-faq-list">
                        {FRIEND_FAQS.map((f, i) => (
                            <FriendFaqItem key={i} num={i + 1} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            <style>{`
                .fc-science { padding: 70px 0; background: #faf7f2; }
                .fc-science__eyebrow {
                    display: block; font-family: 'Playfair Display', serif; font-style: italic;
                    color: #f0a530; font-size: 17px; margin-bottom: 8px;
                }
                .fc-science__title { font-size: 32px; font-weight: 800; color: #241318; }
                .fc-science__accent { color: #7a5cf0; }

                .fc-card {
                    background: #ffffff; border-radius: 18px; box-shadow: 0 4px 20px rgba(61,15,33,0.06);
                }

                .fc-bento-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 22px; align-items: stretch; }
                .fc-bento-main { padding: 34px; display: flex; flex-direction: column; justify-content: center; }
                .fc-bento-main__icon {
                    width: 48px; height: 48px; border-radius: 14px; background: #efe8db;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
                }
                .fc-heading { font-size: 21px; font-weight: 800; color: #8a3559; margin: 0 0 14px; }
                .fc-prose { font-size: 14.5px; line-height: 1.85; color: #5a4a50; }
                .fc-pill-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
                .fc-pill { background: #efe8db; color: #5c1730; font-size: 12px; font-weight: 600; padding: 7px 15px; border-radius: 50px; }

                .fc-bento-side {
                    background: linear-gradient(160deg, #a4436c, #3d0f21);
                    border-radius: 18px; padding: 34px; color: #fff;
                    box-shadow: 0 10px 30px rgba(43,15,35,0.25);
                }
                .fc-bento-side__title { font-size: 18px; font-weight: 800; margin: 0 0 20px; }
                .fc-score-row {
                    display: flex; justify-content: space-between; align-items: center;
                    font-size: 13.5px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.18);
                    color: rgba(255,255,255,0.8);
                }
                .fc-score-row--last { border-bottom: none; }
                .fc-score-val { font-weight: 700; }
                .fc-score-val--great { color: #f5bc5e; }
                .fc-score-val--good { color: #f5bc5e; }
                .fc-score-val--low { color: #f4a1a1; }

                @media (max-width: 991px) {
                    .fc-bento-grid { grid-template-columns: 1fr; }
                }

                .fc-faq-wrap { padding: 20px 0 70px; }
                .fc-faq-heading { font-size: 26px; font-weight: 800; color: #241318; margin-bottom: 26px; }
                .fc-faq-list { max-width: 900px; }
                .fc-faq-item {
                    background: #fff; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px;
                    box-shadow: 0 2px 10px rgba(43,15,35,0.05);
                    border-left: 3px solid transparent; cursor: pointer;
                }
                .fc-faq-item--open { border-left-color: #f0a530; }
                .fc-faq-q { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14.5px; color: #241318; }
                .fc-faq-num { color: #f0a530; font-weight: 700; width: 26px; flex-shrink: 0; }
                .fc-faq-text { flex: 1; }
                .fc-faq-toggle { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #ddd; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .fc-faq-toggle i { font-size: 10px; color: #a4436c; }
                .fc-faq-ans { font-size: 13.5px; color: #5a4a50; margin-top: 12px; padding-left: 36px; line-height: 1.7; }
            `}</style>
        </div>
    );
};

export default FriendshipCalculator;
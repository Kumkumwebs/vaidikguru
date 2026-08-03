import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';

const pad = (n) => String(n).padStart(2, '0');

const DESTINY_FAQS = [
    {
        q: 'How is Destiny Number different from Moolank?',
        a: 'Moolank (Psychic Number) is derived only from your birth date (e.g., the 20th). Bhagyank (Destiny Number) is the total sum of your entire date, month, and year of birth.',
    },
    {
        q: 'Can I change my Destiny Number?',
        a: 'No. Your birth date is fixed. However, you can change the spelling of your name (Name Number) to align with your Destiny Number for better luck and harmony.',
    },
    {
        q: 'What is a Master Number?',
        a: 'In some systems, 11, 22, and 33 are Master Numbers. However, in traditional Vedic reduction, we simplify them further to 2, 4, and 6 to find the core planetary ruler.',
    },
];

const DestinyFaqItem = ({ num, q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={`dn-faq-item${open ? ' dn-faq-item--open' : ''}`} onClick={() => setOpen((o) => !o)}>
            <div className="dn-faq-q">
                <span className="dn-faq-num">{pad(num)}</span>
                <span className="dn-faq-text">{q}</span>
                <div className="dn-faq-toggle">
                    <i className={`fas fa-${open ? 'minus' : 'plus'}`} />
                </div>
            </div>
            {open && <div className="dn-faq-ans">{a}</div>}
        </div>
    );
};

const DestinyNumberCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Numerology" for Delhi (Saturday, 20 Dec 2025)
    const [todayData] = useState({
        location: "Delhi, India",
        universalDay: "5",
        energy: "Mercury / Communication",
        time: "02:37:15 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        // --- DESTINY NUMBER LOGIC (Sum of DOB) ---
        const dobValue = e.target.date.value; // YYYY-MM-DD
        const digits = dobValue.replace(/-/g, '').split('').map(Number);
        let sum = digits.reduce((a, b) => a + b, 0);

        // Reduce to single digit (1-9)
        while (sum > 9) {
            sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
        }

        const descriptions = {
            1: "The Leader: Independent, creative, and ambitious.",
            2: "The Diplomat: Sensitive, intuitive, and cooperative.",
            3: "The Expressor: Artistic, social, and optimistic.",
            4: "The Builder: Practical, disciplined, and reliable.",
            5: "The Adventurer: Versatile, energetic, and freedom-loving.",
            6: "The Nurturer: Responsible, loving, and harmonious.",
            7: "The Seeker: Analytical, spiritual, and introspective.",
            8: "The Achiever: Authoritative, business-minded, and powerful.",
            9: "The Humanitarian: Compassionate, idealistic, and creative."
        };

        setTimeout(() => {
            setResult({
                name: e.target.name.value,
                destinyNumber: sum,
                rulingPlanet: ["", "Sun", "Moon", "Jupiter", "Rahu", "Mercury", "Venus", "Ketu", "Saturn", "Mars"][sum],
                nature: descriptions[sum].split(':')[0],
                description: descriptions[sum].split(':')[1],
                luckyColor: ["", "Gold/Yellow", "White", "Yellow", "Grey", "Green", "White/Pink", "Light Blue", "Deep Blue", "Red"][sum]
            });
            setLoading(false);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 1500);
    };

    return (
        <div className="main-wrapper bg-white">
            <Header />

            {/* HERO BANNER — image + maroon/gold gradient overlay, standalone rounded card */}
            <div className="container pt-40">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="position-relative overflow-hidden rounded-25 d-flex align-items-center justify-content-center text-center"
                    style={{
                        minHeight: '300px',
                        padding: '70px 0px',
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
                            Numerology Science
                        </span>
                        <h1 className="text-white mb-3" style={{ fontSize: '3rem', lineHeight: 1.1 }}>
                            Destiny Number <span style={{ color: '#f0a530' }}>Finder</span>
                        </h1>
                        <p className="mb-0" style={{ color: '#e7d9dd' }}>
                            Uncover your Bhagyank—the single most important number that defines your life's ultimate purpose and path.
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
                                        Universal Vibration
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
                                        <p className="small mb-1" style={{ color: '#d9b9c4' }}>Universal Day</p>
                                        <h3 className="mb-0" style={{ color: '#f5bc5e' }}>Number {todayData.universalDay}</h3>
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
                                        <small className="d-block text-muted" style={{ fontSize: '10px', textTransform: 'uppercase' }}>What We Map</small>
                                        <strong className="small">Full Reduction Method</strong>
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
                                <h3 className="h4 mb-30" style={{ color: '#8a3559' }}>Calculate Your Bhagyank</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Full Name</label>
                                        <input name="name" type="text" className="form-control input-modern py-3 rounded-inner" placeholder="Rahul Sharma" required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="small fw-bold mb-2">Email Address</label>
                                        <input name="email" type="email" className="form-control input-modern py-3 rounded-inner" placeholder="rahul@diviniq.com" required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="small fw-bold mb-2">Date of Birth</label>
                                        <input name="date" type="date" className="form-control input-modern py-3 rounded-inner" required />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-100 py-3 rounded-inner border-0 text-white fw-semibold"
                                        style={{ background: 'linear-gradient(120deg, #a4436c, #8a3559)' }}
                                    >
                                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "Reveal My Destiny"}
                                    </button>
                                </form>
                                <div className="mt-4 p-2 bg-light rounded-15 border border-dashed text-center">
                                    <p className="xsmall text-muted mb-0" style={{ fontSize: '11px' }}>
                                        *Your data is encrypted. We use Pythagorean numerology for precision.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RESULT */}
                        <div className="col-lg-5">
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-100 rounded-25 border-2 border-dashed border-light d-flex align-items-center justify-content-center text-center p-5 bg-white">
                                        <div className="opacity-30">
                                            <img src="assets/img/icon/about_1_1.svg" width="60" className="mb-3" alt="" />
                                            <p>Enter your birth date to unlock <br /> your destiny number analysis.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="result-card-premium py-40 px-40 p-md-50 rounded-25 h-100 overflow-hidden shadow-2xl">
                                        <div className="mb-30 text-center">
                                            <span className="text-theme small fw-bold uppercase tracking-widest">Your Destiny Number</span>
                                            <h2 className="text-white display-3 mb-1 mt-2">{result.destinyNumber}</h2>
                                            <div className="badge bg-white-10 text-theme px-3 py-2 rounded-pill">The {result.nature}</div>
                                        </div>

                                        <div className="row g-3">
                                            {[
                                                { l: "Ruling Planet", v: result.rulingPlanet },
                                                { l: "Lucky Color", v: result.luckyColor },
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
                                            <p className="small text-theme fw-bold mb-1">DivinIQ Life Path Insight:</p>
                                            <p className="small text-white-50 mb-0 leading-relaxed">{result.description}</p>
                                        </div>

                                        <div className="mt-40 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                                            <button className="th-btn style1 py-2 px-4 rounded-inner small shadow-none">Full Career Report</button>
                                            <span className="text-white-50 small">Bhagyank for {result.name}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* THE POWER OF DESTINY NUMBERS — themed bento */}
            <section className="dn-science">
                <div className="container">
                    <div className="text-center mb-5">
                        <span className="dn-science__eyebrow">Numerical Secrets</span>
                        <h2 className="dn-science__title">The Power of <span className="dn-science__accent">Destiny Numbers</span></h2>
                    </div>

                    <div className="dn-bento-grid">
                        <div className="dn-card dn-bento-main">
                            <div className="dn-bento-main__icon">
                                <img src="assets/img/icon/about_1_1.svg" width="26" alt="" />
                            </div>
                            <h3 className="dn-heading">What is a Destiny Number?</h3>
                            <p className="dn-prose">
                                While your Psychic Number (Mulank) shows who you are internally, your <strong>Destiny Number (Bhagyank)</strong> reveals where your life is heading. It is the vibration of your purpose—the work you are meant to do and the legacy you are destined to leave behind.
                            </p>
                            <div className="dn-pill-row">
                                <span className="dn-pill">Life Purpose</span>
                                <span className="dn-pill">Karmic Path</span>
                                <span className="dn-pill">Bhagyank Science</span>
                            </div>
                        </div>

                        <div className="dn-bento-side">
                            <h3 className="dn-bento-side__title">Calculation Method</h3>
                            <p className="dn-bento-side__text">
                                VaidikGuru uses the full reduction method:
                                <br /><br />
                                <strong>Example:</strong> Dec 20, 1995<br />
                                1+2 + 2+0 + 1+9+9+5 = 29<br />
                                2+9 = 11 | 1+1 = <strong>2</strong>
                            </p>
                            <div className="dn-bento-side__result">
                                <span className="dn-bento-side__result-label">Result:</span> Your destiny is governed by the Moon.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FAQ (numbered accordion) ── */}
            <section className="dn-faq-wrap">
                <div className="container">
                    <h2 className="dn-faq-heading">Frequently Asked Questions</h2>
                    <div className="dn-faq-list">
                        {DESTINY_FAQS.map((f, i) => (
                            <DestinyFaqItem key={i} num={i + 1} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            <style>{`
                .dn-science { padding: 70px 0; background: #faf7f2; }
                .dn-science__eyebrow {
                    display: block; font-family: 'Playfair Display', serif; font-style: italic;
                    color: #f0a530; font-size: 17px; margin-bottom: 8px;
                }
                .dn-science__title { font-size: 32px; font-weight: 800; color: #241318; }
                .dn-science__accent { color: #7a5cf0; }

                .dn-card {
                    background: #ffffff; border-radius: 18px; box-shadow: 0 4px 20px rgba(61,15,33,0.06);
                }

                .dn-bento-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 22px; align-items: stretch; }
                .dn-bento-main { padding: 34px; display: flex; flex-direction: column; justify-content: center; }
                .dn-bento-main__icon {
                    width: 48px; height: 48px; border-radius: 14px; background: #efe8db;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
                }
                .dn-heading { font-size: 21px; font-weight: 800; color: #8a3559; margin: 0 0 14px; }
                .dn-prose { font-size: 14.5px; line-height: 1.85; color: #5a4a50; }
                .dn-pill-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
                .dn-pill { background: #efe8db; color: #5c1730; font-size: 12px; font-weight: 600; padding: 7px 15px; border-radius: 50px; }

                .dn-bento-side {
                    background: linear-gradient(160deg, #a4436c, #3d0f21);
                    border-radius: 18px; padding: 34px; color: #fff;
                    box-shadow: 0 10px 30px rgba(43,15,35,0.25);
                }
                .dn-bento-side__title { font-size: 18px; font-weight: 800; margin: 0 0 18px; }
                .dn-bento-side__text { font-size: 13.5px; line-height: 1.8; color: rgba(255,255,255,0.85); margin: 0; }
                .dn-bento-side__result {
                    margin-top: 20px; padding: 14px; border-radius: 12px;
                    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.16);
                    font-size: 13.5px; color: rgba(255,255,255,0.9);
                }
                .dn-bento-side__result-label { color: #f5bc5e; font-weight: 700; }

                @media (max-width: 991px) {
                    .dn-bento-grid { grid-template-columns: 1fr; }
                }

                .dn-faq-wrap { padding: 20px 0 70px; }
                .dn-faq-heading { font-size: 26px; font-weight: 800; color: #241318; margin-bottom: 26px; }
                .dn-faq-list { max-width: 900px; }
                .dn-faq-item {
                    background: #fff; border-radius: 12px; padding: 18px 22px; margin-bottom: 14px;
                    box-shadow: 0 2px 10px rgba(43,15,35,0.05);
                    border-left: 3px solid transparent; cursor: pointer;
                }
                .dn-faq-item--open { border-left-color: #f0a530; }
                .dn-faq-q { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14.5px; color: #241318; }
                .dn-faq-num { color: #f0a530; font-weight: 700; width: 26px; flex-shrink: 0; }
                .dn-faq-text { flex: 1; }
                .dn-faq-toggle { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #ddd; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .dn-faq-toggle i { font-size: 10px; color: #a4436c; }
                .dn-faq-ans { font-size: 13.5px; color: #5a4a50; margin-top: 12px; padding-left: 36px; line-height: 1.7; }
            `}</style>
        </div>
    );
};

export default DestinyNumberCalculator;
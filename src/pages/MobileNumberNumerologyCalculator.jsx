import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';

const pad = (n) => String(n).padStart(2, '0');

const PP_FAQS = [
    {
        q: 'How is the mobile number total calculated?',
        a: 'We add every single digit of your 10-digit number. For example, 9876543210 becomes 45, which reduces to 4+5 = 9.',
    },
    {
        q: 'Does the position of digits matter?',
        a: 'Yes, repeating patterns like 777 or 999 increase the power of that specific energy, which can be beneficial or challenging depending on your chart.',
    },
    {
        q: 'Can I use this tool to pick a new number?',
        a: 'Absolutely. Finding a number that aligns with your Driver Number (Birth Date) ensures better energetic harmony in your business and personal communications.',
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

const MobileNumerologyCalculator = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Default "Today's Status" for Delhi (Fixed to your original structure)
    const [todayData] = useState({
        location: "Delhi, India",
        number: "9",
        energy: "Wisdom",
        time: "02:42:49 IST"
    });

    const handleCalculate = (e) => {
        e.preventDefault();
        setLoading(true);

        const mobile = e.target.mobile.value.replace(/\D/g, '');
        const dob = e.target.dob.value;

        // --- BACKEND LOGIC ---
        // 1. Calculate Mobile Total
        const mobileSum = mobile.split('').map(Number).reduce((a, b) => a + b, 0);
        const reduceNum = (n) => {
            if ([11, 22, 33].includes(n)) return n;
            while (n > 9) n = n.toString().split('').map(Number).reduce((a, b) => a + b, 0);
            return n;
        };
        const mobileFinal = reduceNum(mobileSum);

        // 2. Calculate Driver Number (Birth Day)
        const birthDay = parseInt(dob.split('-')[2]);
        const driverNumber = reduceNum(birthDay);

        const meanings = {
            1: "Leader’s Energy: Leadership, independence, and fresh starts. Great for starting new business.",
            2: "Teamwork & Feelings: Building partnerships and understanding emotions. Perfect for counselors.",
            3: "Creativity & Joy: Happiness, fun, and communication. Suits artists and social speakers.",
            4: "Hard Work & Discipline: Stable, serious, and practical. Grounded energy for builders.",
            5: "Change & Adventure: Freedom, travel, and trying new things. Best for sales/tourism.",
            6: "Family & Care: Love, care, and responsibility. Brings comfort and strong family vibes.",
            7: "Spiritual Thinking: Wisdom, deep thinking, and spirituality. Best for researchers.",
            8: "Power & Success: Business wealth and leadership. Ambitious professionals benefit here.",
            9: "Kindness & Completion: Giving, helping others, and finishing what you start.",
            11: "Master Number: High spiritual energy and divine calling.",
            22: "Master Number: Practical visionary power.",
            33: "Master Number: Compassion and transformation."
        };

        setTimeout(() => {
            setResult({
                name: e.target.name.value,
                mobileNumber: mobileFinal,
                driverNumber: driverNumber,
                meaning: meanings[mobileFinal],
                alignment: (mobileFinal === driverNumber) ? "Highly Aligned" : "Neutral Sync",
                originalSum: mobileSum
            });
            setLoading(false);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }, 1500);
    };

    return (
        <div className="pp-root">
            <Header />

            {/* ── Hero ── */}
            <section
                style={{
                    padding: "40px 0",
                    background: "#fff",
                }}
            >
                <div
                    className="container"
                    style={{
                        maxWidth: "1400px",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            minHeight: "300px",
                            backgroundImage: 'url("/assets/img/images/profile-hero-banner.jpeg")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "28px",
                            overflow: "hidden",
                            boxShadow: "0 18px 45px rgba(58,12,27,.18)",
                        }}
                    >
                        {/* Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, rgba(52,10,22,.82) 0%, rgba(70,12,30,.65) 45%, rgba(0,0,0,.15) 100%)",
                            }}
                        />

                        {/* Glow Left */}
                        <div
                            style={{
                                position: "absolute",
                                width: "350px",
                                height: "350px",
                                background: "rgba(255,180,60,.12)",
                                filter: "blur(120px)",
                                borderRadius: "50%",
                                top: "-120px",
                                left: "-120px",
                            }}
                        />

                        {/* Glow Right */}
                        <div
                            style={{
                                position: "absolute",
                                width: "280px",
                                height: "280px",
                                background: "rgba(255,170,40,.08)",
                                filter: "blur(100px)",
                                borderRadius: "50%",
                                bottom: "-100px",
                                right: "-100px",
                            }}
                        />

                        {/* Content */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 2,
                                minHeight: "300px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "40px",
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <span
                                    style={{
                                        color: "#F6B63F",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        letterSpacing: "3px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    DIGITAL VIBRATION
                                </span>

                                <h1
                                    style={{
                                        color: "#fff",
                                        fontSize: "56px",
                                        fontWeight: 800,
                                        marginTop: "18px",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Mobile{" "}
                                    <span style={{ color: "#F6B63F" }}>
                                        Numerology
                                    </span>
                                </h1>

                                <p
                                    style={{
                                        color: "rgba(255,255,255,.88)",
                                        maxWidth: "680px",
                                        margin: "20px auto 0",
                                        fontSize: "18px",
                                        lineHeight: "1.7",
                                    }}
                                >
                                    Discover the hidden energy in your phone number and its alignment
                                    with your birth date.
                                </p>

                                <div
                                    style={{
                                        width: "140px",
                                        height: "4px",
                                        background: "#F6B63F",
                                        borderRadius: "50px",
                                        margin: "28px auto 0",
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Golden Border */}
                        <div
                            style={{
                                position: "absolute",
                                inset: "12px",
                                border: "1px solid rgba(246,182,63,.45)",
                                borderRadius: "20px",
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* ── Content ── */}
            <section className="pp-section">
                <div className="pp-container pp-layout">

                    {/* Sidebar */}
                    <aside className="pp-sidebar">
                        <motion.div whileHover={{ y: -2 }} className="pp-today-card">
                            <div className="pp-today-card__head">
                                <span>Today in {todayData.location}</span>
                                <span className="pp-live-badge">Live</span>
                            </div>
                            <div className="pp-today-card__row">
                                <div>
                                    <p className="pp-today-card__label">Universal Day</p>
                                    <p className="pp-today-card__num">{todayData.number}</p>
                                </div>
                                <div className="pp-today-card__divider" />
                                <div>
                                    <p className="pp-today-card__label">Core Energy</p>
                                    <p className="pp-today-card__energy">{todayData.energy}</p>
                                </div>
                            </div>
                            <div className="pp-today-card__foot">
                                <span>Saturday, 20 Dec 2025</span>
                                <span>{todayData.time}</span>
                            </div>
                        </motion.div>

                        <div className="pp-sidebar__card">
                            <div className="pp-sidebar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-sidebar__label">What We Analyze</p>
                                <p className="pp-sidebar__value">Digit Sum & Sync</p>
                            </div>
                        </div>

                        <div className="pp-sidebar__card">
                            <div className="pp-sidebar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .6 3a2 2 0 01-.5 2.1L8 10a16 16 0 006 6z" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-sidebar__label">Contact Us</p>
                                <p className="pp-sidebar__value">support@vaidikguru.com</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="pp-main">
                        <div className="pp-calc-grid">
                            {/* Form */}
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="pp-card pp-calc-form"
                            >
                                <h3 className="pp-heading">Analyze Your Number</h3>
                                <form onSubmit={handleCalculate}>
                                    <div className="pp-field">
                                        <label className="pp-field__label">Full Name</label>
                                        <input name="name" type="text" className="pp-input" placeholder="Your Name" required />
                                    </div>
                                    <div className="pp-field">
                                        <label className="pp-field__label">Mobile Number</label>
                                        <input name="mobile" type="text" className="pp-input" placeholder="9876543210" required maxLength="10" />
                                    </div>
                                    <div className="pp-field">
                                        <label className="pp-field__label">Date of Birth</label>
                                        <input name="dob" type="date" className="pp-input" required />
                                    </div>
                                    <div className="pp-field">
                                        <label className="pp-field__label">Email Address</label>
                                        <input name="email" type="email" className="pp-input" placeholder="email@VaidikGuru.com" required />
                                    </div>
                                    <button type="submit" className="pp-print-btn pp-calc-submit" disabled={loading}>
                                        {loading ? "Analyzing Sync..." : "Check Energetic Alignment"}
                                    </button>
                                </form>
                            </motion.div>

                            {/* Result */}
                            <AnimatePresence mode="wait">
                                {!result ? (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="pp-card pp-result-placeholder"
                                    >
                                        <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#d8cdd3", marginBottom: "16px" }}>
                                            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                        <p className="pp-muted-text">Your alignment results will<br />appear here after analysis.</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="pp-result-card"
                                    >
                                        <div className="pp-result-card__top">
                                            <span className="pp-result-card__eyebrow">Alignment Analysis</span>
                                            <h2 className="pp-result-card__number">Number {result.mobileNumber}</h2>
                                            <span className="pp-result-card__badge">{result.alignment}</span>
                                        </div>

                                        <div className="pp-result-stats">
                                            <div className="pp-result-stat">
                                                <p>Driver No. (DOB)</p>
                                                <strong>Number {result.driverNumber}</strong>
                                            </div>
                                            <div className="pp-result-stat">
                                                <p>Digital Total</p>
                                                <strong>{result.originalSum}</strong>
                                            </div>
                                        </div>

                                        <div className="pp-result-reading">
                                            <p className="pp-result-reading__label">Energy Reading:</p>
                                            <p className="pp-result-reading__text">{result.meaning}</p>
                                        </div>

                                        <div className="pp-result-foot">
                                            <span>Generated for {result.name}</span>
                                            <button className="pp-print-btn pp-print-btn--strip">Expert Advice</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Info bento */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="pp-bento-grid"
                        >
                            <div className="pp-card pp-bento-main">
                                <h3 className="pp-heading">What is Mobile Numerology?</h3>
                                <p className="pp-prose">
                                    Your phone number is a digital gateway. By adding all digits, we reduce it to a
                                    core single-digit frequency. This result can then be compared with your{" "}
                                    <strong>Driver Number</strong> (Birth Date) to determine if your digital energy
                                    supports or clashes with your personal path.
                                </p>
                                <div className="pp-pill-row">
                                    <span className="pp-pill">Digital Alignment</span>
                                    <span className="pp-pill">Driver Number Sync</span>
                                    <span className="pp-pill">Lo Shu Grid</span>
                                </div>
                            </div>

                            <div className="pp-bento-side">
                                <h3 className="pp-bento-side__title">Number Meanings</h3>
                                <ul className="pp-bento-side__list">
                                    <li><b>1:</b> Leader’s Energy</li>
                                    <li><b>2:</b> Teamwork &amp; Feelings</li>
                                    <li><b>3:</b> Creativity &amp; Joy</li>
                                    <li><b>4:</b> Hard Work &amp; Discipline</li>
                                    <li><b>5:</b> Change &amp; Adventure</li>
                                    <li><b>🌟 Master:</b> 11, 22, 33</li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Footer strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="pp-strip"
                        >
                            <div className="pp-strip__contact">
                                <div className="pp-strip__avatar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="pp-strip__label">Questions about your reading?</p>
                                    <a className="pp-strip__email" href="mailto:support@vaidikguru.com">support@vaidikguru.com</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── FAQ ── */}
                        <div className="pd-faq-wrap">
                            <div className="pd-sec-eyebrow">
                                <span className="pd-eyebrow-line" />
                                <i className="fas fa-om" /> Frequently Asked Questions{" "}
                                <i className="fas fa-om" />
                                <span className="pd-eyebrow-line" />
                            </div>
                            <div className="pd-faq-grid">
                                {PP_FAQS.map((f, i) => (
                                    <FaqItem key={i} num={i + 1} q={f.q} a={f.a} />
                                ))}
                            </div>
                        </div>
                    </main>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            <style>{`
        :root {
          --pp-bg: #faf9f7;
          --pp-gold: #c9882a;
          --pp-gold-light: #f0a93b;
          --pp-maroon: #3a1330;
          --pp-maroon-deep: #2b0f23;
          --pp-ink: #1a1118;
          --pp-muted: #6b6070;
          --pp-line: #ede8eb;
          --pp-card: #ffffff;
          --pp-radius: 18px;
        }

        .pp-root { background: var(--pp-bg); font-family: 'Poppins', sans-serif; color: var(--pp-ink); }
        .pp-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        .pp-section { padding: 60px 0 80px; }
        .pp-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .pp-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 24px; }

        .pp-today-card {
          background: linear-gradient(135deg, var(--pp-maroon-deep) 0%, #5c1f3e 100%);
          border-radius: 18px;
          padding: 22px;
          color: #fff;
          box-shadow: 0 10px 30px rgba(43,15,35,0.25);
        }
        .pp-today-card__head {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px; letter-spacing: 1px; text-transform: uppercase;
          color: rgba(255,255,255,0.65); margin-bottom: 16px; font-weight: 600;
        }
        .pp-live-badge {
          background: var(--pp-gold-light); color: #2b0f23;
          font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
          padding: 3px 9px; border-radius: 20px; text-transform: uppercase;
        }
        .pp-today-card__row { display: flex; align-items: center; gap: 18px; }
        .pp-today-card__divider { width: 1px; height: 36px; background: rgba(255,255,255,0.15); }
        .pp-today-card__label { font-size: 11px; color: rgba(255,255,255,0.5); margin: 0 0 4px; }
        .pp-today-card__num { font-size: 26px; font-weight: 800; color: var(--pp-gold-light); margin: 0; }
        .pp-today-card__energy { font-size: 16px; font-weight: 700; color: #fff; margin: 0; }
        .pp-today-card__foot {
          display: flex; justify-content: space-between;
          font-size: 11.5px; color: rgba(255,255,255,0.55);
          margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.12);
        }

        .pp-sidebar__card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 2px 8px rgba(60,20,40,0.04);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .pp-sidebar__card:hover {
          box-shadow: 0 6px 20px rgba(60,20,40,0.09);
          transform: translateY(-2px);
        }
        .pp-sidebar__icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #c2185b;
        }
        .pp-sidebar__label { font-size: 11px; color: var(--pp-muted); font-weight: 500; margin: 0 0 2px; }
        .pp-sidebar__value { font-size: 13.5px; font-weight: 600; color: var(--pp-ink); margin: 0; }

        /* ── Card / buttons ── */
        .pp-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 36px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }
        .pp-heading { font-size: 22px; font-weight: 800; color: var(--pp-maroon); margin: 0 0 22px; }
        .pp-prose { font-size: 15px; line-height: 1.85; color: #3d343b; }

        .pp-print-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, var(--pp-gold-light), var(--pp-gold));
          border: none; color: #fff; font-size: 13.5px; font-weight: 600;
          font-family: 'Poppins', sans-serif; padding: 12px 20px; border-radius: 12px;
          cursor: pointer; text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pp-print-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(201,136,42,0.35); color: #fff; }
        .pp-print-btn--strip { border-radius: 10px; }
        .pp-print-btn:disabled { opacity: 0.7; cursor: default; transform: none; }

        /* ── Calculator ── */
        .pp-calc-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; align-items: stretch; margin-bottom: 40px; }

        .pp-field { margin-bottom: 16px; }
        .pp-field__label { display: block; font-size: 12.5px; font-weight: 600; color: var(--pp-ink); margin-bottom: 6px; }
        .pp-input {
          width: 100%; border: 1px solid var(--pp-line); background: #fbf6f4;
          border-radius: 12px; padding: 13px 16px; font-family: 'Poppins', sans-serif;
          font-size: 14px; color: var(--pp-ink); outline: none;
          transition: border-color 0.18s ease, background 0.18s ease;
        }
        .pp-input:focus { border-color: var(--pp-gold-light); background: #fff; }
        .pp-calc-submit { width: 100%; padding: 14px; border-radius: 12px; margin-top: 6px; }

        .pp-result-placeholder {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; border: 2px dashed var(--pp-line); box-shadow: none;
        }
        .pp-muted-text { color: var(--pp-muted); font-size: 14px; line-height: 1.6; }

        .pp-result-card {
          background: linear-gradient(135deg, var(--pp-maroon-deep) 0%, #7a1a4a 100%);
          border-radius: var(--pp-radius);
          padding: 36px;
          color: #fff;
          box-shadow: 0 16px 40px rgba(43,15,35,0.28);
        }
        .pp-result-card__top { text-align: center; margin-bottom: 24px; }
        .pp-result-card__eyebrow { color: var(--pp-gold-light); font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .pp-result-card__number { font-size: 34px; font-weight: 800; margin: 8px 0 12px; }
        .pp-result-card__badge {
          display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
          color: var(--pp-gold-light); font-size: 12px; font-weight: 600; padding: 6px 16px; border-radius: 50px;
        }
        .pp-result-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .pp-result-stat {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 14px; text-align: center;
        }
        .pp-result-stat p { font-size: 11.5px; color: rgba(255,255,255,0.55); margin: 0 0 4px; }
        .pp-result-stat strong { font-size: 15px; color: #fff; }
        .pp-result-reading {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 16px; margin-bottom: 24px;
        }
        .pp-result-reading__label { font-size: 12.5px; font-weight: 700; color: var(--pp-gold-light); margin: 0 0 6px; }
        .pp-result-reading__text { font-size: 13.5px; color: rgba(255,255,255,0.7); line-height: 1.7; margin: 0; }
        .pp-result-foot {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.12);
          font-size: 12.5px; color: rgba(255,255,255,0.55);
        }

        /* ── Bento ── */
        .pp-bento-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; margin-bottom: 24px; }
        .pp-bento-main { display: flex; flex-direction: column; justify-content: center; }
        .pp-pill-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .pp-pill {
          background: #fdeef0; color: #c2185b; font-size: 12px; font-weight: 600;
          padding: 8px 16px; border-radius: 50px;
        }
        .pp-bento-side {
          background: linear-gradient(135deg, var(--pp-maroon-deep), #5c1f3e);
          border-radius: var(--pp-radius); padding: 32px 28px; color: #fff;
        }
        .pp-bento-side__title { font-size: 16px; font-weight: 700; color: #fff; margin: 0 0 18px; }
        .pp-bento-side__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .pp-bento-side__list li { font-size: 13.5px; color: rgba(255,255,255,0.75); }
        .pp-bento-side__list b { color: var(--pp-gold-light); }

        /* ── Bottom strip ── */
        .pp-strip {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px; background: var(--pp-card);
          border: 1px solid var(--pp-line); border-radius: 16px; padding: 20px 28px;
          box-shadow: 0 2px 10px rgba(60,20,40,0.04);
        }
        .pp-strip__contact { display: flex; align-items: center; gap: 16px; }
        .pp-strip__avatar {
          width: 44px; height: 44px; border-radius: 12px; background: #fdeef0;
          display: flex; align-items: center; justify-content: center; color: #c2185b; flex-shrink: 0;
        }
        .pp-strip__label { font-size: 12px; color: var(--pp-muted); margin: 0 0 3px; }
        .pp-strip__email { font-size: 14.5px; font-weight: 600; color: var(--pp-maroon); text-decoration: none; }
        .pp-strip__email:hover { color: var(--pp-gold); }

        /* ── FAQ (Puja-details style) ── */
        .pd-faq-wrap { margin-top: 26px; padding: 30px 0 6px; border-top: 1px solid var(--pp-line); }
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

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .pp-calc-grid { grid-template-columns: 1fr; }
          .pp-bento-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 860px) {
          .pp-layout { grid-template-columns: 1fr; }
          .pp-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
          .pp-sidebar__card { flex: 1 1 200px; }
          .pp-today-card { flex: 1 1 100%; }
          .pp-card { padding: 26px 20px; }
        }
        @media (max-width: 767px) {
          .pd-faq-grid { grid-template-columns: 1fr; gap: 0; }
        }
        @media (max-width: 520px) {
          .pp-sidebar { flex-direction: column; }
          .pp-strip { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
        </div>
    );
};

export default MobileNumerologyCalculator;
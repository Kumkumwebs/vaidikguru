import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import ScrollTop from '../components/common/ScrollTop';

function HelpCenter() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [query, setQuery] = useState('');

    const suggestedQuestions = [
        "How do I book a consultation?",
        "What services does VaidikGuru offer?",
        "How do refunds work?",
        "How can I reschedule my session?",
        "Is my personal data secure?",
        "How do I contact customer support?",
    ];

    const categories = [
        { icon: "📅", label: "Bookings", desc: "Schedule, manage & reschedule sessions" },
        { icon: "💳", label: "Payments", desc: "Billing, refunds & transaction history" },
        { icon: "🔒", label: "Privacy", desc: "Data security & account protection" },
        { icon: "🕉️", label: "Services", desc: "Puja, Chadhava, Astrology & more" },
        { icon: "👤", label: "Account", desc: "Profile, login & preferences" },
        { icon: "📞", label: "Contact", desc: "Reach our support team anytime" },
    ];

    return (
        <div className="pp-root">
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
            />

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
                            backgroundImage: 'url("/assets/img/images/profile-hero-banner.jpeg")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            minHeight: "300px",
                            borderRadius: "28px",
                            overflow: "hidden",
                            boxShadow: "0 18px 45px rgba(58, 12, 27, 0.18)",
                        }}
                    >
                        {/* Dark Gradient Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, rgba(52,10,22,.82) 0%, rgba(70,12,30,.68) 45%, rgba(0,0,0,.18) 100%)",
                            }}
                        />

                        {/* Left Glow */}
                        <div
                            style={{
                                position: "absolute",
                                width: "350px",
                                height: "350px",
                                background: "rgba(255,180,60,.12)",
                                filter: "blur(120px)",
                                top: "-120px",
                                left: "-100px",
                                borderRadius: "50%",
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
                                padding: "0 30px",
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
                                    LEGAL INFORMATION
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
                                    Help &{" "}
                                    <span style={{ color: "#F6B63F" }}>
                                        Center
                                    </span>
                                </h1>

                                <p
                                    style={{
                                        color: "rgba(255,255,255,.88)",
                                        maxWidth: "650px",
                                        margin: "20px auto 0",
                                        fontSize: "18px",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Get quick assistance, guidance, and expert support for all
                                    VaidikGuru services.
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

                        {/* Premium Inner Border */}
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
                        <div className="pp-sidebar__card">
                            <div className="pp-sidebar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-sidebar__label">Quick Search</p>
                                <p className="pp-sidebar__value">Find answers fast</p>
                            </div>
                        </div>

                        <div className="pp-sidebar__card">
                            <div className="pp-sidebar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-5.5 8-12a8 8 0 10-16 0c0 6.5 8 12 8 12z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-sidebar__label">Availability</p>
                                <p className="pp-sidebar__value">Support all day</p>
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

                        <div className="pp-sidebar__card pp-sidebar__card--tags">
                            <p className="pp-sidebar__label" style={{ marginBottom: "10px" }}>Popular Questions</p>
                            <div className="pp-tags">
                                {suggestedQuestions.slice(0, 4).map((q, i) => (
                                    <a
                                        key={i}
                                        href="#"
                                        className="pp-tag"
                                        onClick={(e) => { e.preventDefault(); setQuery(q); }}
                                    >
                                        {q}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="pp-main">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="pp-card"
                        >
                            {/* Search box */}
                            <div className="pp-search">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pp-search__icon">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    className="pp-search__input"
                                    type="text"
                                    placeholder="Search for help articles, topics, or keywords…"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button className="pp-print-btn pp-search__btn">Search</button>
                            </div>

                            <h2 className="pp-heading">How can we help you?</h2>
                            <p className="pp-prose" style={{ marginBottom: "28px" }}>
                                Browse a topic below or reach out to our support team — we're here to make your
                                VaidikGuru experience smooth, secure, and simple.
                            </p>

                            {/* Category Grid */}
                            <div className="pp-cat-grid">
                                {categories.map((cat, i) => (
                                    <motion.a
                                        key={i}
                                        href="#"
                                        className="pp-cat-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.06 }}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="pp-cat-card__icon">{cat.icon}</div>
                                        <h5 className="pp-cat-card__title">{cat.label}</h5>
                                        <p className="pp-cat-card__desc">{cat.desc}</p>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Footer strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="pp-strip"
                        >
                            <div className="pp-strip__contact">
                                <div className="pp-strip__avatar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 18v-6a9 9 0 0118 0v6" /><path d="M21 19a2 2 0 01-2 2h-1v-7h3z" /><path d="M3 19a2 2 0 002 2h1v-7H3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="pp-strip__label">Need personal assistance?</p>
                                    <a className="pp-strip__email" href="mailto:support@vaidikguru.com">support@vaidikguru.com</a>
                                </div>
                            </div>

                            <a href="mailto:support@vaidikguru.com" className="pp-print-btn pp-print-btn--strip">
                                Contact Support
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </a>
                        </motion.div>
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

        /* ── Reset ── */
        .pp-root { background: var(--pp-bg); font-family: 'Poppins', sans-serif; color: var(--pp-ink); }
        .pp-container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        /* ── Layout ── */
        .pp-section { padding: 60px 0 80px; }
        .pp-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 28px;
          align-items: start;
        }

        /* ── Sidebar ── */
        .pp-sidebar { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 24px; }

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
        .pp-sidebar__card--tags { flex-direction: column; align-items: flex-start; }
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

        .pp-tags { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .pp-tag {
          font-size: 12.5px;
          color: var(--pp-ink);
          background: #fbf6f4;
          border: 1px solid var(--pp-line);
          border-radius: 8px;
          padding: 8px 10px;
          text-decoration: none;
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .pp-tag:hover { background: #fdeef0; border-color: #f0c2cf; color: var(--pp-ink); }

        /* ── Print / action button ── */
        .pp-print-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, var(--pp-gold-light), var(--pp-gold));
          border: none;
          color: #fff;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pp-print-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(201,136,42,0.35);
          color: #fff;
        }
        .pp-print-btn--strip { border-radius: 10px; }

        /* ── Main card ── */
        .pp-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 48px 52px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }

        /* ── Search bar ── */
        .pp-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fbf6f4;
          border: 1px solid var(--pp-line);
          border-radius: 50px;
          padding: 6px 6px 6px 20px;
          margin-bottom: 36px;
        }
        .pp-search__icon { color: var(--pp-muted); flex-shrink: 0; }
        .pp-search__input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-family: 'Poppins', sans-serif;
          font-size: 14.5px;
          color: var(--pp-ink);
          padding: 10px 4px;
        }
        .pp-search__input::placeholder { color: #b7adb3; }
        .pp-search__btn { border-radius: 40px; padding: 12px 26px; margin-top: 0; }

        .pp-heading {
          font-size: 24px;
          font-weight: 800;
          color: var(--pp-maroon);
          margin: 0 0 10px;
        }

        /* ── Prose ── */
        .pp-prose {
          font-size: 15.5px;
          line-height: 1.85;
          color: #3d343b;
        }

        /* ── Category grid ── */
        .pp-cat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .pp-cat-card {
          background: #fff;
          border: 1px solid var(--pp-line);
          border-radius: 16px;
          padding: 22px 20px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .pp-cat-card:hover {
          border-color: #f0c2cf;
          box-shadow: 0 10px 26px rgba(58,19,48,0.10);
          color: inherit;
          text-decoration: none;
        }
        .pp-cat-card__icon { font-size: 30px; line-height: 1; margin-bottom: 2px; }
        .pp-cat-card__title { font-size: 15px; font-weight: 700; color: var(--pp-maroon); margin: 0; }
        .pp-cat-card__desc { font-size: 12.5px; color: var(--pp-muted); line-height: 1.5; margin: 0; }

        /* ── Bottom strip ── */
        .pp-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: 16px;
          padding: 20px 28px;
          margin-top: 20px;
          box-shadow: 0 2px 10px rgba(60,20,40,0.04);
        }
        .pp-strip__contact { display: flex; align-items: center; gap: 16px; }
        .pp-strip__avatar {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          color: #c2185b;
          flex-shrink: 0;
        }
        .pp-strip__label { font-size: 12px; color: var(--pp-muted); margin: 0 0 3px; }
        .pp-strip__email {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--pp-maroon);
          text-decoration: none;
        }
        .pp-strip__email:hover { color: var(--pp-gold); }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .pp-layout { grid-template-columns: 1fr; }
          .pp-sidebar { position: static; }
          .pp-card { padding: 28px 22px; }
          .pp-cat-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 520px) {
          .pp-strip { flex-direction: column; align-items: flex-start; }
          .pp-cat-grid { grid-template-columns: 1fr; }
          .pp-search { padding: 5px 5px 5px 14px; }
        }
      `}</style>
        </div>
    );
}

export default HelpCenter;
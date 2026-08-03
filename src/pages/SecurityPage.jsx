import React, { useState } from "react";
import { motion } from "framer-motion";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import SideMenu from "../components/layout/SideMenu";
import ScrollTop from "../components/common/ScrollTop";

function SecurityPolicy() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const securityColumns = [
        {
            icon: "🔐",
            title: "Data Privacy",
            desc: "Your cosmic data and birth details are protected by AES-256 military-grade encryption standards.",
        },
        {
            icon: "🔑",
            title: "Secure Access",
            desc: "Multi-factor authentication and secure token-based sessions for every spiritual consultation.",
        },
        {
            icon: "🧑‍⚖️",
            title: "Master Vetting",
            desc: "A rigorous 5-step background verification for every Vedic Master before they join our platform.",
        },
        {
            icon: "☁️",
            title: "Vault Storage",
            desc: "Private, decentralized cloud storage ensuring your ritual records are never accessible by third parties.",
        },
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
                        className="pp-hero"
                        style={{
                            position: "relative",
                            minHeight: "320px",
                            backgroundImage: 'url("/assets/img/images/profile-hero-banner.jpeg")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "28px",
                            overflow: "hidden",
                            boxShadow: "0 18px 45px rgba(58,12,27,.18)",
                        }}
                    >
                        {/* Dark Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, rgba(52,10,22,.85) 0%, rgba(70,12,30,.68) 45%, rgba(0,0,0,.18) 100%)",
                            }}
                        />

                        {/* Left Glow */}
                        <div
                            style={{
                                position: "absolute",
                                width: "360px",
                                height: "360px",
                                background: "rgba(255,180,60,.12)",
                                filter: "blur(120px)",
                                borderRadius: "50%",
                                top: "-120px",
                                left: "-120px",
                            }}
                        />

                        {/* Right Glow */}
                        <div
                            style={{
                                position: "absolute",
                                width: "300px",
                                height: "300px",
                                background: "rgba(255,180,60,.08)",
                                filter: "blur(100px)",
                                borderRadius: "50%",
                                bottom: "-120px",
                                right: "-120px",
                            }}
                        />

                        {/* Content */}
                        <div
                            className="pp-hero__inner"
                            style={{
                                position: "relative",
                                zIndex: 2,
                                minHeight: "320px",
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
                                    className="pp-hero__eyebrow"
                                    style={{
                                        color: "#F6B63F",
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        letterSpacing: "3px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    DIVINE PROTECTION
                                </span>

                                <h1
                                    className="pp-hero__title"
                                    style={{
                                        color: "#fff",
                                        fontSize: "56px",
                                        fontWeight: 800,
                                        marginTop: "18px",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Security &{" "}
                                    <span style={{ color: "#F6B63F" }}>
                                        Privacy
                                    </span>
                                </h1>

                                <p
                                    className="pp-hero__sub"
                                    style={{
                                        color: "rgba(255,255,255,.88)",
                                        maxWidth: "720px",
                                        margin: "20px auto 0",
                                        fontSize: "18px",
                                        lineHeight: "1.7",
                                    }}
                                >
                                    Uncover our approach to security. We combine the sanctity of ancient
                                    tradition with the strength of modern cybersecurity. Your spiritual
                                    journey is protected at every step.
                                </p>

                                <div
                                    className="pp-hero__dash"
                                    style={{
                                        width: "140px",
                                        height: "4px",
                                        background: "#F6B63F",
                                        borderRadius: "50px",
                                        margin: "30px auto 0",
                                    }}
                                />
                            </motion.div>
                        </div>

                        {/* Golden Inner Border */}
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
                        {securityColumns.map((item, index) => (
                            <div className="pp-sidebar__card" key={index}>
                                <div className="pp-sidebar__icon pp-sidebar__icon--emoji">{item.icon}</div>
                                <div>
                                    <p className="pp-sidebar__label">{item.title}</p>
                                </div>
                            </div>
                        ))}

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
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="pp-card"
                        >
                            <h2 className="pp-heading">Uncover our approach to security</h2>
                            <p className="pp-prose">
                                We combine the sanctity of ancient tradition with the strength of modern
                                cybersecurity. Your spiritual journey is protected at every step.
                            </p>

                            {/* Feature grid */}
                            <div className="pp-feature-grid">
                                {securityColumns.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="pp-feature-card"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.08 }}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="pp-feature-card__icon">{item.icon}</div>
                                        <h4 className="pp-feature-card__title">{item.title}</h4>
                                        <p className="pp-feature-card__desc">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* App security links */}
                            <div className="pp-app-links">
                                <a href="#" className="pp-print-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                    iOS Security
                                </a>
                                <a href="#" className="pp-print-btn pp-print-btn--outline">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                                    </svg>
                                    Android Safety
                                </a>
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
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="M2 7l10 6 10-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="pp-strip__label">© 2025 VaidikGuru</p>
                                    <a className="pp-strip__email" href="mailto:support@vaidikguru.com">support@vaidikguru.com</a>
                                </div>
                            </div>
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
        .pp-sidebar__icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #c2185b;
        }
        .pp-sidebar__icon--emoji { font-size: 20px; }
        .pp-sidebar__label { font-size: 13px; color: var(--pp-ink); font-weight: 600; margin: 0; }
        .pp-sidebar__value { font-size: 12.5px; font-weight: 500; color: var(--pp-muted); margin: 3px 0 0; }

        /* ── Buttons ── */
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
        .pp-print-btn--outline {
          background: #fff;
          border: 1px solid var(--pp-line);
          color: var(--pp-maroon);
        }
        .pp-print-btn--outline:hover { box-shadow: 0 6px 18px rgba(60,20,40,0.10); color: var(--pp-maroon); }

        /* ── Main card ── */
        .pp-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 48px 52px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }
        .pp-heading { font-size: 24px; font-weight: 800; color: var(--pp-maroon); margin: 0 0 12px; }
        .pp-prose { font-size: 15.5px; line-height: 1.85; color: #3d343b; margin: 0 0 36px; }

        /* ── Feature grid ── */
        .pp-feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
          margin-bottom: 36px;
        }
        .pp-feature-card {
          background: #fbf6f4;
          border: 1px solid var(--pp-line);
          border-radius: 16px;
          padding: 24px;
          transition: box-shadow 0.2s ease;
        }
        .pp-feature-card:hover { box-shadow: 0 10px 26px rgba(58,19,48,0.10); }
        .pp-feature-card__icon { font-size: 30px; line-height: 1; margin-bottom: 12px; }
        .pp-feature-card__title { font-size: 15.5px; font-weight: 700; color: var(--pp-maroon); margin: 0 0 6px; }
        .pp-feature-card__desc { font-size: 13px; color: var(--pp-muted); line-height: 1.6; margin: 0; }

        /* ── App links ── */
        .pp-app-links { display: flex; gap: 12px; flex-wrap: wrap; }

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
          .pp-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
          .pp-sidebar__card { flex: 1 1 200px; }
          .pp-card { padding: 28px 22px; }
          .pp-feature-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .pp-sidebar { flex-direction: row; flex-wrap: wrap; }
          .pp-sidebar__card { flex: 1 1 calc(50% - 7px); }
          .pp-sidebar__card:last-child { flex: 1 1 100%; }
          .pp-strip { flex-direction: column; align-items: flex-start; }
          .pp-app-links { flex-direction: column; }
        }

        /* =========================================================
           HERO — RESPONSIVE (uses !important to override the
           fixed-pixel inline styles set in JSX; inline styles always
           beat plain CSS, so this is required to make it responsive)
           ========================================================= */
        @media (max-width: 992px) {
          .pp-hero { min-height: 280px !important; }
          .pp-hero__inner { min-height: 280px !important; padding: 32px !important; }
          .pp-hero__title { font-size: 40px !important; }
          .pp-hero__sub { font-size: 16px !important; }
        }
        @media (max-width: 768px) {
          .pp-hero { min-height: 260px !important; border-radius: 20px !important; }
          .pp-hero__inner { min-height: 260px !important; padding: 24px !important; }
          .pp-hero__eyebrow { font-size: 12px !important; letter-spacing: 2px !important; }
          .pp-hero__title { font-size: 30px !important; margin-top: 12px !important; }
          .pp-hero__sub { font-size: 14.5px !important; margin-top: 14px !important; }
          .pp-hero__dash { width: 100px !important; margin-top: 20px !important; }
        }
        @media (max-width: 480px) {
          .pp-hero { min-height: 240px !important; border-radius: 16px !important; }
          .pp-hero__inner { min-height: 240px !important; padding: 18px !important; }
          .pp-hero__eyebrow { font-size: 11px !important; letter-spacing: 1.5px !important; }
          .pp-hero__title { font-size: 24px !important; }
          .pp-hero__sub { font-size: 13.5px !important; }
        }

        /* ── Main card / feature cards on small phones ── */
        @media (max-width: 480px) {
          .pp-card { padding: 20px 16px; }
          .pp-heading { font-size: 20px; }
          .pp-prose { font-size: 14px; }
          .pp-feature-card { padding: 18px; }
        }
      `}</style>
        </div>
    );
}

export default SecurityPolicy;
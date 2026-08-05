import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import SideMenu from "../components/layout/SideMenu";
import ScrollTop from "../components/common/ScrollTop";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = "https://admin.vaidikguru.com";

// ── Static fallback content (mirrors the content used in the v2 page) ──
const STATIC_SECTIONS = [
    {
        title: "1. Information We Collect",
        html: `
            <ul>
                <li>Mobile number and country code provided during login.</li>
                <li>Name, email, date of birth, birth time, and birth place after sign-up.</li>
                <li>Device FCM token for push notifications.</li>
                <li>Usage data such as features accessed and session duration.</li>
            </ul>
        `,
    },
    {
        title: "2. How We Use Your Information",
        html: `
            <ul>
                <li>Authenticate users via OTP and maintain sessions.</li>
                <li>Provide personalised astrology consultations and recommendations.</li>
                <li>Send updates and promotional content via push notifications.</li>
                <li>Improve the performance and features of our application.</li>
                <li>Comply with applicable legal obligations.</li>
            </ul>
        `,
    },
    {
        title: "3. Sharing of Information",
        html: `
            <p>We do not sell, trade, or rent your personal information to third parties.
            We may share data with trusted service providers operating under strict
            confidentiality agreements.</p>
        `,
    },
    {
        title: "4. Data Retention",
        html: `
            <p>We retain your personal data only for as long as necessary to fulfil the
            purposes outlined in this policy, or as required by applicable law.</p>
        `,
    },
    {
        title: "5. Security",
        html: `
            <p>We implement appropriate technical and organisational measures to protect
            your information against unauthorised access, alteration, disclosure, or
            destruction.</p>
        `,
    },
    {
        title: "6. Your Rights",
        html: `
            <ul>
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data, subject to legal requirements.</li>
                <li>Opt out of promotional notifications via device settings.</li>
            </ul>
        `,
    },
    {
        title: "7. Children's Privacy",
        html: `
            <p>Our services are not directed to individuals under the age of 13. We do
            not knowingly collect personal information from children.</p>
        `,
    },
    {
        title: "8. Changes to This Policy",
        html: `
            <p>We may update this Privacy Policy periodically. Changes will be reflected
            by the updated date shown above.</p>
        `,
    },
    {
        title: "9. Contact Us",
        html: `
            <p>For questions about this Privacy Policy, please contact us at
            <a href="mailto:support@vaidikguru.com">support@vaidikguru.com</a></p>
        `,
    },
];

const PrivacyPolicy = () => {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    // Splits raw HTML (headings + paragraphs/lists) into individual
    // section objects so each one can be rendered as its own card.
    const parseSectionsFromHtml = (htmlString) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, "text/html");
            const nodes = Array.from(doc.body.childNodes);
            const result = [];
            let current = null;

            nodes.forEach((node) => {
                const isHeading =
                    node.nodeType === 1 && /^H[1-4]$/.test(node.tagName);

                if (isHeading) {
                    current = { title: node.textContent.trim(), html: "" };
                    result.push(current);
                } else {
                    if (!current) {
                        current = { title: "", html: "" };
                        result.push(current);
                    }
                    if (node.nodeType === 1) {
                        current.html += node.outerHTML;
                    } else if (node.nodeType === 3 && node.textContent.trim()) {
                        current.html += `<p>${node.textContent.trim()}</p>`;
                    }
                }
            });

            return result.filter((s) => s.title || s.html.trim());
        } catch (e) {
            console.error("Error parsing privacy policy content:", e);
            return [];
        }
    };

    useEffect(() => {
        // Matches the fetch approach used on the v2 page: hits the settings
        // endpoint and reads `results.privacy_policy`, falling back to static
        // content (silently) if the request fails or the field is missing.
        const fetchSettings = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/user_api/setting`);
                if (res.data?.status && res.data?.results?.privacy_policy) {
                    setSections(parseSectionsFromHtml(res.data.results.privacy_policy));
                } else {
                    setSections(STATIC_SECTIONS);
                }
            } catch (error) {
                console.error("Error fetching privacy policy:", error);
                setSections(STATIC_SECTIONS);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

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
                            minHeight: "240px",
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
                                background: "rgba(240,169,59,.12)",
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
                                background: "rgba(240,169,59,.08)",
                                filter: "blur(100px)",
                                borderRadius: "50%",
                                bottom: "-120px",
                                right: "-120px",
                            }}
                        />

                        {/* Content */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 2,
                                minHeight: "240px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                padding: "30px",
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
                                        fontSize: "40px",
                                        fontWeight: 800,
                                        marginTop: "14px",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Privacy &{" "}
                                    <span style={{ color: "#F6B63F" }}>
                                        Policy
                                    </span>
                                </h1>

                                <p
                                    style={{
                                        color: "rgba(255,255,255,.88)",
                                        maxWidth: "720px",
                                        margin: "16px auto 0",
                                        fontSize: "18px",
                                        lineHeight: "1.7",
                                    }}
                                >
                                    Your privacy is our priority — learn how VaidikGuru securely
                                    collects and protects your information for a safe, trusted
                                    spiritual experience.
                                </p>

                                <div
                                    style={{
                                        width: "140px",
                                        height: "4px",
                                        background: "#F6B63F",
                                        borderRadius: "50px",
                                        margin: "20px auto 0",
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

                    {/* Info row — Jurisdiction / Data Security / Contact Us in one scrollable line */}
                    <div className="pp-infobar">
                        <div className="pp-infobar__card">
                            <div className="pp-infobar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-5.5 8-12a8 8 0 10-16 0c0 6.5 8 12 8 12z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-infobar__label">Jurisdiction</p>
                                <p className="pp-infobar__value">Republic of India</p>
                            </div>
                        </div>

                        <div className="pp-infobar__card">
                            <div className="pp-infobar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-infobar__label">Data Security</p>
                                <p className="pp-infobar__value">SSL Encrypted</p>
                            </div>
                        </div>

                        <div className="pp-infobar__card">
                            <div className="pp-infobar__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .6 3a2 2 0 01-.5 2.1L8 10a16 16 0 006 6z" />
                                </svg>
                            </div>
                            <div>
                                <p className="pp-infobar__label">Contact Us</p>
                                <p className="pp-infobar__value">support@vaidikguru.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Main content */}
                    <main className="pp-main">
                        {loading ? (
                            <div className="pp-card">
                                <div className="pp-loader">
                                    <div className="pp-loader__ring">
                                        <div /><div /><div /><div />
                                    </div>
                                    <p className="pp-loader__text">Loading Privacy Policy…</p>
                                </div>
                            </div>
                        ) : (
                            <div className="pp-content-grid">
                                {sections.map((section, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.06 * i, ease: "easeOut" }}
                                        className="pp-section-card"
                                    >
                                        {section.title && (
                                            <h3 className="pp-section-card__title">{section.title}</h3>
                                        )}
                                        <div
                                            className="pp-section-card__body"
                                            dangerouslySetInnerHTML={{ __html: section.html }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

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
                                        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 6 10-6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="pp-strip__label">Questions about this policy?</p>
                                    <a className="pp-strip__email" href="mailto:support@vaidikguru.com">support@vaidikguru.com</a>
                                </div>
                            </div>

                            <button className="pp-print-btn pp-print-btn--strip" onClick={() => window.print()}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                                </svg>
                                Print
                            </button>
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
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        /* ── Info row (Jurisdiction / Data Security / Contact Us) — single scrollable line ── */
        .pp-infobar {
          display: flex;
          flex-direction: row;
          gap: 12px;
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          padding-bottom: 4px;
        }
        .pp-infobar::-webkit-scrollbar { height: 5px; }
        .pp-infobar::-webkit-scrollbar-thumb { background: rgba(201,136,42,0.3); border-radius: 10px; }
        .pp-infobar::-webkit-scrollbar-track { background: transparent; }

        .pp-infobar__card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1 1 220px;
          min-width: 220px;
          box-shadow: 0 2px 8px rgba(60,20,40,0.04);
          transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
        }
        .pp-infobar__card:hover {
          box-shadow: 0 10px 26px rgba(60,20,40,0.12);
          transform: translateY(-4px);
          border-color: rgba(201,136,42,0.35);
        }
        .pp-infobar__icon {
          width: 40px; height: 40px;
          border-radius: 11px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #c2185b;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        .pp-infobar__icon svg { width: 19px; height: 19px; }
        .pp-infobar__card:hover .pp-infobar__icon {
          transform: scale(1.1) rotate(-6deg);
          background: #fbdfe6;
        }
        .pp-infobar__label {
          font-size: 11px;
          color: var(--pp-muted);
          font-weight: 500;
          margin: 0 0 2px;
          white-space: nowrap;
        }
        .pp-infobar__value {
          font-size: 13px;
          font-weight: 600;
          color: var(--pp-ink);
          margin: 0;
          white-space: nowrap;
        }

        /* ── Print button ── */
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
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }
        .pp-print-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(201,136,42,0.35);
          filter: brightness(1.05);
        }
        .pp-print-btn:active { transform: translateY(0); }
        .pp-print-btn--strip { border-radius: 10px; }

        /* ── Main card (loading state) ── */
        .pp-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 48px 52px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }

        /* ── Content shown as individual section cards, 2 per row ── */
        .pp-content-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        .pp-section-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 28px 30px;
          box-shadow: 0 4px 18px rgba(60,20,40,0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .pp-section-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 32px rgba(60,20,40,0.13);
          border-color: rgba(201,136,42,0.4);
        }

        .pp-section-card__title {
          color: var(--pp-maroon);
          font-weight: 700;
          font-size: 18px;
          line-height: 1.3;
          margin: 0 0 14px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--pp-line);
          transition: border-color 0.25s ease, color 0.25s ease;
        }
        .pp-section-card:hover .pp-section-card__title {
          border-bottom-color: var(--pp-gold-light);
          color: var(--pp-gold);
        }

        .pp-section-card__body {
          font-size: 14.5px;
          line-height: 1.8;
          color: #3d343b;
        }
        .pp-section-card__body h1, .pp-section-card__body h2,
        .pp-section-card__body h3, .pp-section-card__body h4 {
          color: var(--pp-maroon);
          font-weight: 700;
          font-size: 16px;
          margin: 14px 0 8px;
        }
        .pp-section-card__body p  { margin: 0 0 14px;  color: #3d343b; }
        .pp-section-card__body p:last-child { margin-bottom: 0;  color: #3d343b; }
        .pp-section-card__body ul, .pp-section-card__body ol { padding-left: 20px; margin: 0 0 14px; }
        .pp-section-card__body li { margin-bottom: 6px; }
        .pp-section-card__body a  {
          color: var(--pp-gold);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s ease;
        }
        .pp-section-card__body a:hover { color: var(--pp-maroon); }
        .pp-section-card__body strong { color: var(--pp-ink); font-weight: 600; }

        /* ── Loader ── */
        .pp-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 0;
          gap: 20px;
        }
        .pp-loader__ring {
          position: relative;
          width: 48px; height: 48px;
        }
        .pp-loader__ring div {
          box-sizing: border-box;
          position: absolute;
          inset: 0;
          border: 4px solid transparent;
          border-top-color: var(--pp-gold-light);
          border-radius: 50%;
          animation: pp-spin 1s cubic-bezier(.5,0,.5,1) infinite;
        }
        .pp-loader__ring div:nth-child(1) { animation-delay: -0.45s; }
        .pp-loader__ring div:nth-child(2) { animation-delay: -0.3s; }
        .pp-loader__ring div:nth-child(3) { animation-delay: -0.15s; }
        @keyframes pp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .pp-loader__text { color: var(--pp-muted); font-size: 14px; margin: 0; }

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
          transition: box-shadow 0.25s ease;
        }
        .pp-strip:hover { box-shadow: 0 8px 22px rgba(60,20,40,0.09); }
        .pp-strip__contact { display: flex; align-items: center; gap: 16px; }
        .pp-strip__avatar {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          color: #c2185b;
          flex-shrink: 0;
          transition: transform 0.25s ease;
        }
        .pp-strip:hover .pp-strip__avatar { transform: scale(1.08); }
        .pp-strip__label { font-size: 12px; color: var(--pp-muted); margin: 0 0 3px; }
        .pp-strip__email {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--pp-maroon);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pp-strip__email:hover { color: var(--pp-gold); }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .pp-card { padding: 28px 22px; }
          .pp-content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .pp-infobar__card { min-width: 200px; padding: 12px 14px; }
          .pp-infobar__icon { width: 34px; height: 34px; }
          .pp-infobar__icon svg { width: 16px; height: 16px; }
          .pp-infobar__label { font-size: 10px; }
          .pp-infobar__value { font-size: 12px; }
        }
        @media (max-width: 520px) {
          .pp-strip { flex-direction: column; align-items: flex-start; }
          .pp-section-card { padding: 22px 20px; }
        }

        @media print {
          .pp-infobar, .pp-strip, .pp-print-btn { display: none !important; }
          .pp-content-grid { grid-template-columns: 1fr; gap: 12px; }
          .pp-section-card { box-shadow: none; border: none; padding: 0 0 16px; }
          .pp-section-card__body { font-size: 13px; }
        }
      `}</style>
        </div>
    );
};

export default PrivacyPolicy;
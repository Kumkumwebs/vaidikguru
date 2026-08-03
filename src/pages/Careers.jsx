import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import ScrollTop from '../components/common/ScrollTop';

// ── Static job listings (ported from the v2 Careers page) ──────
const JOBS = [
    { id: 1, title: "Senior Vedic Astrologer", department: "Astrology", location: "Remote / Pan India", type: "Full-time", experience: "3+ Years", icon: "🔭" },
    { id: 2, title: "Tarot Card Reader", department: "Astrology", location: "Remote", type: "Part-time / Freelance", experience: "1+ Years", icon: "🃏" },
    { id: 3, title: "Numerology Expert", department: "Astrology", location: "Remote", type: "Freelance", experience: "2+ Years", icon: "🔢" },
    { id: 4, title: "React / React Native Developer", department: "Engineering", location: "Jaipur / Remote", type: "Full-time", experience: "2+ Years", icon: "💻" },
    { id: 5, title: "UI / UX Designer", department: "Design", location: "Jaipur / Remote", type: "Full-time", experience: "2+ Years", icon: "🎨" },
    { id: 6, title: "Customer Support Executive", department: "Operations", location: "Jaipur", type: "Full-time", experience: "0–1 Year", icon: "🎧" },
    { id: 7, title: "Digital Marketing Manager", department: "Marketing", location: "Jaipur / Remote", type: "Full-time", experience: "3+ Years", icon: "📈" },
    { id: 8, title: "Content Writer – Astrology", department: "Content", location: "Remote", type: "Full-time / Freelance", experience: "1+ Years", icon: "✍️" },
];

const DEPARTMENTS = ["All", ...Array.from(new Set(JOBS.map((j) => j.department)))];

const PERKS = [
    { icon: "🏠", title: "Remote Friendly", desc: "Most roles are fully remote or hybrid — work from anywhere." },
    { icon: "📈", title: "Growth Fast-Track", desc: "We're a fast-growing startup. Your impact is visible and rewarded quickly." },
    { icon: "💰", title: "Competitive Pay", desc: "Market-rate salaries with performance bonuses and incentives." },
    { icon: "🌟", title: "Meaningful Work", desc: "Help millions of people find clarity and direction in their lives." },
    { icon: "🤝", title: "Great Culture", desc: "Collaborative, inclusive, and spiritually positive workplace." },
    { icon: "📚", title: "Learning Budget", desc: "Annual budget for courses, certifications, and skill development." },
];

const stats = [
    { value: "50+", label: "Team Members" },
    { value: "12+", label: "Expert Domains" },
    { value: "4.9★", label: "Culture Rating" },
    { value: "100%", label: "Remote Friendly" },
];

// ── Job card ─────────────────────────────────────────────────
function JobCard({ job, onApply }) {
    return (
        <motion.div
            className="pp-job-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
        >
            <div className="pp-job-card__top">
                <div className="pp-job-card__icon">{job.icon}</div>
                <div className="pp-job-card__info">
                    <h4 className="pp-job-card__title">{job.title}</h4>
                    <div className="pp-job-card__badges">
                        <span className={`pp-badge pp-badge--${job.department.toLowerCase()}`}>{job.department}</span>
                        <span className="pp-badge pp-badge--type">{job.type}</span>
                    </div>
                </div>
            </div>

            <div className="pp-job-card__meta">
                <span>📍 {job.location}</span>
                <span>⏱️ {job.experience}</span>
            </div>

            <button className="pp-print-btn pp-job-card__btn" onClick={() => onApply(job.title)}>
                Apply Now
            </button>
        </motion.div>
    );
}

// ── Perk card ────────────────────────────────────────────────
function PerkCard({ icon, title, desc }) {
    return (
        <div className="pp-perk">
            <div className="pp-perk__icon">{icon}</div>
            <div>
                <p className="pp-perk__title">{title}</p>
                <p className="pp-perk__desc">{desc}</p>
            </div>
        </div>
    );
}

// ── Application modal ──────────────────────────────────────────
function ApplicationModal({ position, onClose }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        position,
        experience: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.phone) {
            alert("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        // Simulate API call — wire to your backend as needed
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <div className="pp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="pp-modal">
                <div className="pp-modal__header">
                    <div>
                        <h3 className="pp-modal__title">Apply for Position</h3>
                        <p className="pp-modal__subtitle">{position}</p>
                    </div>
                    <button className="pp-modal__close" onClick={onClose}>✕</button>
                </div>

                {submitted ? (
                    <div className="pp-modal__success">
                        <div className="pp-modal__success-icon">✅</div>
                        <h4 className="pp-modal__success-title">Application Submitted!</h4>
                        <p className="pp-modal__success-text">
                            Thank you for applying. Our team will review your application and reach out
                            to you within 3–5 business days.
                        </p>
                        <button className="pp-print-btn" onClick={onClose}>Close</button>
                    </div>
                ) : (
                    <div className="pp-modal__body">
                        <div className="pp-form-group">
                            <label className="pp-form-label">Full Name <span className="pp-form-required">*</span></label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="pp-form-input"
                            />
                        </div>

                        <div className="pp-form-row">
                            <div className="pp-form-group">
                                <label className="pp-form-label">Email <span className="pp-form-required">*</span></label>
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@email.com"
                                    className="pp-form-input"
                                />
                            </div>
                            <div className="pp-form-group">
                                <label className="pp-form-label">Phone <span className="pp-form-required">*</span></label>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="pp-form-input"
                                />
                            </div>
                        </div>

                        <div className="pp-form-group">
                            <label className="pp-form-label">Position Applying For</label>
                            <input name="position" value={form.position} readOnly className="pp-form-input pp-form-input--readonly" />
                        </div>

                        <div className="pp-form-group">
                            <label className="pp-form-label">Years of Experience</label>
                            <select name="experience" value={form.experience} onChange={handleChange} className="pp-form-input">
                                <option value="">Select experience</option>
                                <option value="fresher">Fresher (0–1 yr)</option>
                                <option value="1-2">1–2 years</option>
                                <option value="2-5">2–5 years</option>
                                <option value="5-10">5–10 years</option>
                                <option value="10+">10+ years</option>
                            </select>
                        </div>

                        <div className="pp-form-group">
                            <label className="pp-form-label">Why do you want to join us?</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Tell us a bit about yourself and why you'd be a great fit..."
                                className="pp-form-input pp-form-textarea"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="pp-print-btn pp-modal__submit"
                        >
                            {loading ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Careers() {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [activeDept, setActiveDept] = useState("All");
    const [applyFor, setApplyFor] = useState(null);

    const filtered = activeDept === "All" ? JOBS : JOBS.filter((j) => j.department === activeDept);

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
                            backgroundImage: 'url("/assets/img/images/profile-hero-banner.jpeg")',
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: "30px",
                            overflow: "hidden",
                            minHeight: "320px",
                            boxShadow: "0 18px 45px rgba(65, 15, 25, 0.18)",
                        }}
                    >
                        {/* Dark Overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, rgba(45,8,18,.85) 0%, rgba(70,10,25,.65) 45%, rgba(0,0,0,.20) 100%)",
                            }}
                        />

                        {/* Decorative Blur */}
                        <div
                            style={{
                                position: "absolute",
                                width: "350px",
                                height: "350px",
                                background: "rgba(255,170,40,.12)",
                                filter: "blur(120px)",
                                top: "-120px",
                                left: "-100px",
                                borderRadius: "50%",
                            }}
                        />

                        {/* Content */}
                        <div
                            className="container pp-hero__inner"
                            style={{
                                position: "relative",
                                zIndex: 2,
                                minHeight: "320px",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 70px",
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
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        letterSpacing: "3px",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    EXPERT PORTAL REGISTRATION
                                </span>

                                <h1
                                    className="pp-hero__title"
                                    style={{
                                        color: "#fff",
                                        fontSize: "58px",
                                        fontWeight: 800,
                                        marginTop: "18px",
                                        lineHeight: 1.15,
                                    }}
                                >
                                    Join the{" "}
                                    <span style={{ color: "#F6B63F" }}>
                                        Expert Lineage
                                    </span>
                                </h1>

                                <p
                                    className="pp-hero__sub"
                                    style={{
                                        color: "rgba(255,255,255,.85)",
                                        maxWidth: "620px",
                                        fontSize: "18px",
                                        marginTop: "20px",
                                    }}
                                >
                                    Register as a verified astrologer and start guiding seekers on
                                    VaidikGuru.
                                </p>

                                <div
                                    className="pp-hero__dash"
                                    style={{
                                        width: "150px",
                                        height: "4px",
                                        background: "#F6B63F",
                                        borderRadius: "50px",
                                        marginTop: "30px",
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
                                borderRadius: "22px",
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
                        {stats.map((s, i) => (
                            <div className="pp-sidebar__card" key={i}>
                                <div className="pp-sidebar__icon pp-sidebar__icon--stat">{s.value}</div>
                                <div>
                                    <p className="pp-sidebar__label">{s.label}</p>
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
                                <p className="pp-sidebar__label">Careers Team</p>
                                <p className="pp-sidebar__value">careers@vaidikguru.com</p>
                            </div>
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="pp-main">

                        {/* Why Work With Us */}
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                            className="pp-card"
                        >
                            <h2 className="pp-heading">Why Work With Us?</h2>
                            <p className="pp-prose" style={{ marginBottom: "28px" }}>
                                Be part of a mission-driven team changing how India seeks guidance —
                                from spiritual masters to tech visionaries, working together to
                                redefine spiritual wellness.
                            </p>

                            <div className="pp-perks-grid">
                                {PERKS.map((p) => (
                                    <PerkCard key={p.title} {...p} />
                                ))}
                            </div>
                        </motion.div>

                        {/* Open Positions */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="pp-card"
                            style={{ marginTop: "20px" }}
                        >
                            <div className="pp-positions-header">
                                <h2 className="pp-heading" style={{ marginBottom: 0 }}>
                                    Open Positions
                                    <span className="pp-positions-count"> ({filtered.length} roles)</span>
                                </h2>

                                <div className="pp-dept-filter">
                                    {DEPARTMENTS.map((dept) => (
                                        <button
                                            key={dept}
                                            onClick={() => setActiveDept(dept)}
                                            className={`pp-dept-btn ${activeDept === dept ? "pp-dept-btn--active" : ""}`}
                                        >
                                            {dept}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {filtered.length === 0 ? (
                                <div className="pp-empty-state">
                                    <span style={{ fontSize: "36px" }}>🔍</span>
                                    <p className="pp-prose" style={{ margin: "10px 0" }}>
                                        No openings in this department right now.
                                    </p>
                                    <button className="pp-dept-btn pp-dept-btn--link" onClick={() => setActiveDept("All")}>
                                        View all positions
                                    </button>
                                </div>
                            ) : (
                                <div className="pp-jobs-grid">
                                    {filtered.map((job) => (
                                        <JobCard key={job.id} job={job} onApply={setApplyFor} />
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="pp-cta"
                        >
                            <div className="pp-cta__left">
                                <div className="pp-cta__icon">✉️</div>
                                <div>
                                    <h4 className="pp-cta__heading">Don't see your role?</h4>
                                    <p className="pp-cta__sub">
                                        Send your CV to <strong>careers@vaidikguru.com</strong>
                                    </p>
                                </div>
                            </div>
                            <button className="pp-print-btn pp-apply-btn" onClick={() => setApplyFor("Open Application")}>
                                Send Open Application
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
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
                                    <p className="pp-strip__label">Questions about a role?</p>
                                    <a className="pp-strip__email" href="mailto:careers@vaidikguru.com">careers@vaidikguru.com</a>
                                </div>
                            </div>
                        </motion.div>
                    </main>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            {applyFor && (
                <ApplicationModal position={applyFor} onClose={() => setApplyFor(null)} />
            )}

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
        .pp-sidebar__icon--stat {
          width: 52px; height: 42px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          color: var(--pp-maroon);
          background: #fdeef0;
        }
        .pp-sidebar__label { font-size: 12px; color: var(--pp-muted); font-weight: 500; margin: 0; }
        .pp-sidebar__value { font-size: 13.5px; font-weight: 600; color: var(--pp-ink); margin: 0; }

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
        .pp-print-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .pp-apply-btn { padding: 14px 30px; border-radius: 50px; white-space: nowrap; }

        /* ── Main card ── */
        .pp-card {
          background: var(--pp-card);
          border: 1px solid var(--pp-line);
          border-radius: var(--pp-radius);
          padding: 48px 52px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }
        .pp-heading { font-size: 24px; font-weight: 800; color: var(--pp-maroon); margin: 0 0 10px; }
        .pp-prose { font-size: 15.5px; line-height: 1.85; color: #3d343b; }

        /* ── Perks grid ── */
        .pp-perks-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px 20px;
        }
        .pp-perk { display: flex; gap: 12px; align-items: flex-start; }
        .pp-perk__icon {
          width: 40px; height: 40px; flex-shrink: 0;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          font-size: 19px;
        }
        .pp-perk__title { font-size: 13.5px; font-weight: 700; color: var(--pp-ink); margin: 0; }
        .pp-perk__desc { font-size: 12.5px; color: var(--pp-muted); line-height: 1.6; margin: 3px 0 0; }

        /* ── Positions header + department filter ── */
        .pp-positions-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          margin-bottom: 22px;
        }
        .pp-positions-count { font-size: 14px; font-weight: 500; color: var(--pp-muted); }
        .pp-dept-filter { display: flex; flex-wrap: wrap; gap: 8px; }
        .pp-dept-btn {
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 16px;
          border-radius: 50px;
          border: 1px solid var(--pp-line);
          background: #fff;
          color: var(--pp-muted);
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .pp-dept-btn:hover { border-color: var(--pp-gold-light); color: var(--pp-gold); }
        .pp-dept-btn--active {
          background: linear-gradient(135deg, var(--pp-gold-light), var(--pp-gold));
          border-color: transparent;
          color: #fff;
        }
        .pp-dept-btn--active:hover { color: #fff; }
        .pp-dept-btn--link { border: none; background: none; text-decoration: underline; color: var(--pp-gold); padding: 0; }

        /* ── Jobs grid + job card ── */
        .pp-jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .pp-job-card {
          border: 1px solid var(--pp-line);
          border-radius: 16px;
          padding: 20px;
          background: #fbf6f4;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: box-shadow 0.2s ease;
        }
        .pp-job-card:hover { box-shadow: 0 10px 26px rgba(58,19,48,0.10); }
        .pp-job-card__top { display: flex; gap: 12px; align-items: flex-start; }
        .pp-job-card__icon {
          width: 44px; height: 44px; flex-shrink: 0;
          border-radius: 12px;
          background: #fdeef0;
          display: flex; align-items: center; justify-content: center;
          font-size: 21px;
        }
        .pp-job-card__title { font-size: 14px; font-weight: 700; color: var(--pp-ink); margin: 0; line-height: 1.3; }
        .pp-job-card__badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
        .pp-badge {
          font-size: 10px; font-weight: 700; padding: 2px 9px;
          border-radius: 50px; border: 1px solid var(--pp-line);
          background: #f4f0f2; color: var(--pp-muted);
        }
        .pp-badge--astrology { background: #fff7ec; color: var(--pp-gold); border-color: #f0d9a8; }
        .pp-badge--engineering { background: #ebf5ff; color: #1976d2; border-color: #b3d4f5; }
        .pp-badge--design { background: #f3ebff; color: #9c27b0; border-color: #ddb3f5; }
        .pp-badge--operations { background: #e8f5e9; color: #34a853; border-color: #b3e0bc; }
        .pp-badge--marketing { background: #fff8e1; color: #b98900; border-color: #ffe98a; }
        .pp-badge--content { background: #fff0f0; color: #d41000; border-color: #ffb3b3; }
        .pp-job-card__meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 12px; color: var(--pp-muted); }
        .pp-job-card__btn { width: 100%; padding: 10px 16px; border-radius: 10px; font-size: 13px; }

        /* ── Empty state ── */
        .pp-empty-state { text-align: center; padding: 40px 0; }

        /* ── CTA ── */
        .pp-cta {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
          background: linear-gradient(135deg, var(--pp-maroon-deep) 0%, #7a1a4a 100%);
          border-radius: 20px; padding: 30px 36px; margin-top: 20px;
        }
        .pp-cta__left { display: flex; align-items: center; gap: 18px; }
        .pp-cta__icon {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
        }
        .pp-cta__heading { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 4px; }
        .pp-cta__sub { font-size: 13.5px; color: rgba(255,255,255,0.65); margin: 0; }
        .pp-cta__sub strong { color: var(--pp-gold-light); font-weight: 600; }

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

        /* ── Application modal ── */
        .pp-modal-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(26,17,24,0.45);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        .pp-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%; max-width: 520px;
          overflow: hidden;
          box-shadow: 0 30px 70px rgba(0,0,0,0.3);
        }
        .pp-modal__header {
          background: linear-gradient(135deg, var(--pp-gold-light), var(--pp-gold));
          padding: 18px 22px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pp-modal__title { font-size: 16px; font-weight: 700; color: #fff; margin: 0; }
        .pp-modal__subtitle { font-size: 12px; color: rgba(255,255,255,0.85); margin: 2px 0 0; }
        .pp-modal__close {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: none;
          color: #fff; font-size: 14px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s ease;
        }
        .pp-modal__close:hover { background: rgba(255,255,255,0.32); }
        .pp-modal__body { padding: 22px; max-height: 70vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; }
        .pp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pp-form-group { display: flex; flex-direction: column; gap: 6px; }
        .pp-form-label { font-size: 12px; font-weight: 600; color: var(--pp-ink); }
        .pp-form-required { color: var(--pp-gold); }
        .pp-form-input {
          border: 1px solid var(--pp-line);
          border-radius: 12px;
          padding: 11px 13px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: var(--pp-ink);
          background: #fff;
          transition: border-color 0.15s ease;
        }
        .pp-form-input:focus { outline: none; border-color: var(--pp-gold); }
        .pp-form-input--readonly { background: #fdf6ea; cursor: not-allowed; }
        .pp-form-textarea { resize: none; }
        .pp-modal__submit { width: 100%; padding: 13px 20px; border-radius: 12px; font-size: 14px; }
        .pp-modal__success { padding: 44px 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
        .pp-modal__success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: #e8f5e9; display: flex; align-items: center; justify-content: center;
          font-size: 30px;
        }
        .pp-modal__success-title { font-size: 16px; font-weight: 700; color: var(--pp-ink); margin: 0; }
        .pp-modal__success-text { font-size: 13px; color: var(--pp-muted); max-width: 320px; margin: 0; }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .pp-layout { grid-template-columns: 1fr; }
          .pp-sidebar { position: static; flex-direction: row; flex-wrap: wrap; }
          .pp-sidebar__card { flex: 1 1 160px; }
          .pp-card { padding: 28px 22px; }
          .pp-perks-grid { grid-template-columns: repeat(2, 1fr); }
          .pp-jobs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .pp-perks-grid { grid-template-columns: 1fr; }
          .pp-jobs-grid { grid-template-columns: 1fr; }
          .pp-cta { flex-direction: column; text-align: center; padding: 26px 22px; }
          .pp-cta__left { flex-direction: column; text-align: center; }
          .pp-form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .pp-sidebar { flex-direction: row; flex-wrap: wrap; }
          .pp-strip { flex-direction: column; align-items: flex-start; }
        }

        /* =========================================================
           HERO — RESPONSIVE (uses !important to override the
           fixed-pixel inline styles set in JSX; inline styles always
           beat plain CSS, so this is required to make it responsive)
           ========================================================= */
        @media (max-width: 992px) {
          .pp-hero { min-height: 280px !important; }
          .pp-hero__inner { min-height: 280px !important; padding: 0 40px !important; }
          .pp-hero__title { font-size: 42px !important; }
          .pp-hero__sub { font-size: 16px !important; }
        }
        @media (max-width: 768px) {
          .pp-hero { min-height: 260px !important; border-radius: 20px !important; }
          .pp-hero__inner { min-height: 260px !important; padding: 0 28px !important; }
          .pp-hero__eyebrow { font-size: 12px !important; letter-spacing: 2px !important; }
          .pp-hero__title { font-size: 32px !important; margin-top: 12px !important; }
          .pp-hero__sub { font-size: 14.5px !important; margin-top: 14px !important; }
          .pp-hero__dash { width: 100px !important; margin-top: 20px !important; }
        }
        @media (max-width: 480px) {
          .pp-hero { min-height: 230px !important; border-radius: 16px !important; }
          .pp-hero__inner { min-height: 230px !important; padding: 0 20px !important; }
          .pp-hero__eyebrow { font-size: 11px !important; letter-spacing: 1.5px !important; }
          .pp-hero__title { font-size: 26px !important; }
          .pp-hero__sub { font-size: 13.5px !important; }
        }

        /* ── Sidebar stat cards: 2 per row on small phones ──
           (the last card, "Careers Team", stays full-width since
           it has more content and shouldn't be squeezed) */
        @media (max-width: 520px) {
          .pp-sidebar__card { flex: 1 1 calc(50% - 7px); }
          .pp-sidebar__card:last-child { flex: 1 1 100%; }
        }

        /* ── Main card padding on small phones ── */
        @media (max-width: 480px) {
          .pp-card { padding: 20px 16px; }
          .pp-heading { font-size: 20px; }
          .pp-prose { font-size: 14px; }
        }

        /* ── CTA button full-width on small phones ── */
        @media (max-width: 480px) {
          .pp-apply-btn { width: 100%; justify-content: center; }
        }
      `}</style>
        </div>
    );
}

export default Careers;
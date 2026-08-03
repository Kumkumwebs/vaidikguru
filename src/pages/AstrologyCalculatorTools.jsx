import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideMenu from '../components/layout/SideMenu';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import ScrollTop from '../components/common/ScrollTop';
import './AstrologyCalculatorTools.css';

/* ── Tools Data ── */
const TOOLS = [
  {
    title: 'Nakshatra Finder',
    desc: 'Discover your birth star and lunar mansion identity.',
    link: '/nakshatra_finder',
    icon: 'fas fa-star',
    tag: 'High Precision',
    tagColor: '#6366f1',
    tagBg: '#eef2ff',
    icoBg: '#eef2ff',
    icoColor: '#6366f1',
    dotColor: '#10b981',
    launchColor: '#6366f1',
  },
  {
    title: 'Janma Rashi Finder',
    desc: 'Identify your Vedic Moon sign and emotional DNA.',
    link: '/janm_rashi_finder',
    icon: 'fas fa-moon',
    tag: 'Vedic Soul',
    tagColor: '#0891b2',
    tagBg: '#ecfeff',
    icoBg: '#ecfeff',
    icoColor: '#0891b2',
    dotColor: '#10b981',
    launchColor: '#0891b2',
  },
  {
    title: 'Mangal Dosha',
    desc: 'Check Manglik status and mangal marriage compatibility.',
    link: '/mangal_dosh_calculator',
    icon: 'fas fa-heart',
    tag: 'Relationship',
    tagColor: '#e11d48',
    tagBg: '#fff1f2',
    icoBg: '#fff1f2',
    icoColor: '#e11d48',
    dotColor: '#ef4444',
    launchColor: '#e11d48',
  },
  {
    title: 'Love Compatibility',
    desc: '36 Guna Milan based on ancient Ashta Koota logic.',
    link: '/love_calculator',
    icon: 'fas fa-heart-pulse',
    tag: 'Fun Match',
    tagColor: '#a855f7',
    tagBg: '#faf5ff',
    icoBg: '#faf5ff',
    icoColor: '#a855f7',
    dotColor: '#10b981',
    launchColor: '#a855f7',
  },
  {
    title: 'Friendship Compatibility',
    desc: '36 Guna Milan based on ancient Ashta Koota logic.',
    link: '/friendship_calculator',
    icon: 'fas fa-user-friends',
    tag: 'Fun Match',
    tagColor: '#a855f7',
    tagBg: '#faf5ff',
    icoBg: '#faf5ff',
    icoColor: '#a855f7',
    dotColor: '#10b981',
    launchColor: '#a855f7',
  },
  {
    title: 'Destiny Number',
    desc: "Calculate your Bhagyank and life's ultimate purpose.",
    link: '/destiny_number_calculator',
    icon: 'fas fa-hashtag',
    tag: 'Numerology',
    tagColor: '#d97706',
    tagBg: '#fffbeb',
    icoBg: '#fffbeb',
    icoColor: '#d97706',
    dotColor: '#f59e0b',
    launchColor: '#d97706',
  },
  {
    title: 'Mobile Numerology',
    desc: 'Sync your phone number with your Destiny Number.',
    link: '/mobile_numerology_calculator',
    icon: 'fas fa-mobile-alt',
    tag: 'Digital Sync',
    tagColor: '#059669',
    tagBg: '#ecfdf5',
    icoBg: '#ecfdf5',
    icoColor: '#059669',
    dotColor: '#10b981',
    launchColor: '#059669',
  },
];

const TRUST_FEATS = [
  { ic: 'fas fa-book-open',  icoBg: '#fef9e7', icoColor: '#d97706', name: 'Ancient Vedic Science',    sub: 'Based on authentic scriptures and timeless knowledge.' },
  { ic: 'fas fa-satellite',  icoBg: '#eef2ff', icoColor: '#6366f1', name: 'Astronomical Accuracy',    sub: 'Real-time planetary positions for precise calculations.' },
  { ic: 'fas fa-lock',       icoBg: '#ecfdf5', icoColor: '#059669', name: 'Privacy First',             sub: 'Your data is safe, secure and never shared.' },
  { ic: 'fas fa-users',      icoBg: '#fdf4ff', icoColor: '#a855f7', name: 'Trusted by Millions',       sub: 'Used and trusted by devotees worldwide.' },
];

const STEPS = [
  { ic: 'fas fa-user', icoBg: '#eef2ff', icoColor: '#6366f1', num: 'Step 1', name: 'Enter Details',        desc: 'Provide basic birth or number details.' },
  { ic: 'fas fa-calculator', icoBg: '#ecfdf5', icoColor: '#059669', num: 'Step 2', name: 'Advanced Calculation', desc: 'Our engine runs Vedic algorithms instantly.' },
  { ic: 'fas fa-file-alt',   icoBg: '#fff7ed', icoColor: '#d97706', num: 'Step 3', name: 'Get Instant Results',  desc: 'Receive accurate insights & analysis.' },
  { ic: 'fas fa-seedling',   icoBg: '#fdf4ff', icoColor: '#a855f7', num: 'Step 4', name: 'Apply & Empower',      desc: 'Use insights to make better life decisions.' },
];

/* ── Main Page ── */
const AstrologyCalculatorHub = () => {
  const [showSideMenu,   setShowSideMenu]   = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch,     setShowSearch]     = useState(false);

  return (
    <div className="main-wrapper" style={{paddingTop:0,marginTop:0}}>
      <ScrollTop />
      <SideMenu    isOpen={showSideMenu}   onClose={()=>setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch}     onClose={()=>setShowSearch(false)} />
      <MobileMenu  isOpen={showMobileMenu} onClose={()=>setShowMobileMenu(false)} />
      <Header
        onMenuToggle={()=>setShowMobileMenu(true)}
        onSideMenuToggle={()=>setShowSideMenu(true)}
        onSearchToggle={()=>setShowSearch(true)}
      />

      {/* ══ HERO ══ */}
      <div className="at-hero-outer">
        <div className="container">
          <img
            src="/assets/img/tool_img/tool_banner.webp"
            alt="Vedic & Numerology Calculators"
            className="at-hero-img"
          />
        </div>
      </div>

      {/* ══ TOOLS GRID ══ */}
      <section className="py-5" style={{background:'#f6f7fb'}}>
        <div className="container">
          <div className="at-section-title">
            <div className="at-section-eyebrow">Explore Our Powerful Tools</div>
            <p className="at-section-sub">Discover profound insights with our advanced Vedic & Numerology calculators.</p>
          </div>
          <div className="row g-3">
            {TOOLS.map((t, i) => (
              <motion.div key={t.title} className="col-12 col-md-6 col-lg-4"
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.28,delay:i*.06}}>
                <div className="at-card">
                  <div className="at-card-top">
                    <div className="at-card-ico" style={{background:t.icoBg}}>
                      <i className={t.icon} style={{color:t.icoColor}} />
                    </div>
                    <span className="at-card-tag" style={{color:t.tagColor, background:t.tagBg, borderColor:`${t.tagColor}33`}}>
                      {t.tag}
                    </span>
                  </div>
                  <div className="at-card-name">{t.title}</div>
                  <div className="at-card-desc">{t.desc}</div>
                  <div className="at-card-foot">
                    <div className="at-card-status">
                      <span className="at-card-dot" style={{background:t.dotColor}} />
                      Ready
                    </div>
                    <Link to={t.link} className="at-launch-btn" style={{color:t.launchColor}}>
                      Launch <i className="fas fa-arrow-right" style={{fontSize:11}} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY TRUST OUR TOOLS ══ */}
      <section className="at-trust">
        <div className="container">
          <div className="row g-md-5 align-items-center">
            {/* Left */}
            <div className="col-lg-5">
              <span className="at-trust-eyebrow">✦ Why Trust Our</span>
              <h2 className="at-trust-h2">
                Precision<br /><span>Tools?</span>
              </h2>
              <p className="at-trust-desc">
                Built using real astronomical ephemeris data and classical Vedic algorithms for unmatched accuracy.
              </p>
              <div className="row g-3">
                {TRUST_FEATS.map(f=>(
                  <div key={f.name} className="col-6">
                    <div className="at-trust-feat">
                      <div className="at-trust-feat-ico" style={{background:f.icoBg}}>
                        <i className={f.ic} style={{color:f.icoColor}} />
                      </div>
                      <div>
                        <div className="at-trust-feat-name">{f.name}</div>
                        <div className="at-trust-feat-sub">{f.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right — image with stats overlay */}
            <div className="col-lg-7 col-12">
              <div className="at-stats-img">
                <img src="/assets/img/tool_img/tool_precision.png" alt="Precision Tools" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="at-how">
        <div className="container">
          <div className="at-section-title">
            <div className="at-section-eyebrow">How Our Tools Work</div>
          </div>
          <div className="at-steps">
            {STEPS.map((s, i) => (
              <motion.div key={s.name} className="at-step"
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.28,delay:i*.08}}>
                <div className="at-step-ico" style={{background:s.icoBg}}>
                  <i className={s.ic} style={{color:s.icoColor, fontSize:22}} />
                </div>
                <div className="at-step-num">{s.num}</div>
                <div className="at-step-name">{s.name}</div>
                <div className="at-step-desc">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="at-cta">
        <div className="container">
          <div className="row align-items-center justify-content-between g-3">
            <div className="col-12 col-md-7 text-start">
              <div className="at-cta-text text-md-center text-center">
                Unlock the secrets of the universe<br />
                with <u>DivinIQ</u>'s advanced tools.
              </div>
            </div>
            <div className="col-12 col-md-4 text-md-end text-center">
              <Link to="/nakshatra_finder" className="at-cta-btn">
                Explore All Tools <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AstrologyCalculatorHub;
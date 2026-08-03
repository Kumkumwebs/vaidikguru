import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Sparkles, Heart, Briefcase, Activity, Flame, Mountain, Wind, Droplet,
    Orbit, Layers, Hash, Palette, CalendarDays, ThumbsUp, ThumbsDown, Zap,
    AlertTriangle, MapPin, Gem, Clock, ArrowRight, PhoneCall, Star,
} from 'lucide-react';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import SideMenu from '../components/layout/SideMenu';
import ScrollTop from '../components/common/ScrollTop';

/* ── Zodiac static data ── */
const ELEMENT_ICON = { Fire: <Flame size={16} />, Earth: <Mountain size={16} />, Air: <Wind size={16} />, Water: <Droplet size={16} /> };

const ZODIAC_SIGNS = [
    {
        key: "aries",
        name: "Aries",
        symbol: "♈",
        icon: "/assets/img/images/aries.png",
        range: "March 21 – April 19",
        element: "Fire",
        ruler: "Mars",
        quality: "Cardinal",
        gemstone: "Red Coral",
        direction: "East",
        compatibility: ["Leo", "Sagittarius"],
        positive: "Courageous, Confident, Enthusiastic, Honest",
        negative: "Impulsive, Short-tempered, Selfish, Moody",
        strength: "Leadership, Determination, Optimism",
        weakness: "Impatience, Aggression, Stubbornness",
        about:
            "Aries is the first sign of the zodiac. You are a natural leader, full of energy and passion.",
    },
    {
        key: 'taurus', name: 'Taurus', symbol: '♉', icon: '/assets/img/images/taurus.png', range: 'April 20 – May 20',
        element: 'Earth', ruler: 'Venus', quality: 'Fixed', gemstone: 'Diamond', direction: 'South',
        compatibility: ['Virgo', 'Capricorn'],
        positive: 'Reliable, Patient, Practical, Devoted',
        negative: 'Stubborn, Possessive, Uncompromising',
        strength: 'Loyalty, Stability, Determination',
        weakness: 'Laziness, Materialism, Inflexibility',
        about: 'Taurus is grounded and steady, valuing comfort, beauty and security. Your patience and reliability make you a rock for those around you.',
    },
    {
        key: 'gemini', name: 'Gemini', symbol: '♊', icon: '/assets/img/images/gemini.png', range: 'May 21 – June 20',
        element: 'Air', ruler: 'Mercury', quality: 'Mutable', gemstone: 'Emerald', direction: 'West',
        compatibility: ['Libra', 'Aquarius'],
        positive: 'Gentle, Affectionate, Curious, Adaptable',
        negative: 'Nervous, Inconsistent, Indecisive',
        strength: 'Communication, Wit, Versatility',
        weakness: 'Restlessness, Superficiality',
        about: 'Gemini is quick-witted and endlessly curious. Your gift for communication helps you connect with almost anyone you meet.',
    },
    {
        key: 'cancer', name: 'Cancer', symbol: '♋', icon: '/assets/img/images/cancer.png', range: 'June 21 – July 22',
        element: 'Water', ruler: 'Moon', quality: 'Cardinal', gemstone: 'Pearl', direction: 'North',
        compatibility: ['Scorpio', 'Pisces'],
        positive: 'Tenacious, Loyal, Emotional, Sympathetic',
        negative: 'Moody, Pessimistic, Suspicious',
        strength: 'Intuition, Compassion, Protectiveness',
        weakness: 'Overemotional, Clinginess',
        about: 'Cancer is deeply intuitive and nurturing. Home and family matter most to you, and your loyalty runs as deep as your emotions.',
    },
    {
        key: 'leo', name: 'Leo', symbol: '♌', icon: '/assets/img/images/leo.png', range: 'July 23 – August 22',
        element: 'Fire', ruler: 'Sun', quality: 'Fixed', gemstone: "Ruby", direction: 'East',
        compatibility: ['Aries', 'Sagittarius'],
        positive: 'Creative, Passionate, Generous, Warm-hearted',
        negative: 'Arrogant, Stubborn, Self-centered',
        strength: 'Confidence, Charisma, Leadership',
        weakness: 'Pride, Domineering nature',
        about: 'Leo radiates warmth and confidence. You were born to stand out, and your generosity draws people naturally into your orbit.',
    },
    {
        key: 'virgo', name: 'Virgo', symbol: '♍', icon: '/assets/img/images/virgo.png', range: 'August 23 – September 22',
        element: 'Earth', ruler: 'Mercury', quality: 'Mutable', gemstone: 'Emerald', direction: 'South',
        compatibility: ['Taurus', 'Capricorn'],
        positive: 'Loyal, Analytical, Kind, Hardworking',
        negative: 'Shy, Worrisome, Overly critical',
        strength: 'Precision, Reliability, Practicality',
        weakness: 'Perfectionism, Overthinking',
        about: 'Virgo brings order and care to everything you touch. Your attention to detail and dependability make you invaluable to others.',
    },
    {
        key: 'libra', name: 'Libra', symbol: '♎', icon: '/assets/img/images/libra.png', range: 'September 23 – October 22',
        element: 'Air', ruler: 'Venus', quality: 'Cardinal', gemstone: 'Opal', direction: 'West',
        compatibility: ['Gemini', 'Aquarius'],
        positive: 'Cooperative, Diplomatic, Fair-minded, Social',
        negative: 'Indecisive, Avoids confrontation',
        strength: 'Balance, Charm, Sense of Justice',
        weakness: 'Indecision, People-pleasing',
        about: 'Libra seeks harmony in all things. Your diplomatic nature and love of beauty make you a natural peacemaker and connector.',
    },
    {
        key: 'scorpio', name: 'Scorpio', symbol: '♏', icon: '/assets/img/images/scorpio.png', range: 'October 23 – November 21',
        element: 'Water', ruler: 'Mars / Pluto', quality: 'Fixed', gemstone: 'Red Coral', direction: 'North',
        compatibility: ['Cancer', 'Pisces'],
        positive: 'Resourceful, Brave, Passionate, Loyal',
        negative: 'Jealous, Secretive, Resentful',
        strength: 'Determination, Intensity, Intuition',
        weakness: 'Possessiveness, Vengefulness',
        about: 'Scorpio feels everything deeply and holds nothing back once committed. Your intensity and intuition give you rare emotional power.',
    },
    {
        key: 'sagittarius', name: 'Sagittarius', symbol: '♐', icon: '/assets/img/images/sagittarius.png', range: 'November 22 – December 21',
        element: 'Fire', ruler: 'Jupiter', quality: 'Mutable', gemstone: 'Yellow Sapphire', direction: 'East',
        compatibility: ['Aries', 'Leo'],
        positive: 'Generous, Idealistic, Great sense of humour',
        negative: 'Impatient, Tactless, Overconfident',
        strength: 'Optimism, Adventurousness, Honesty',
        weakness: 'Carelessness, Bluntness',
        about: 'Sagittarius is the eternal explorer, driven by a hunger for freedom and truth. Your optimism is contagious wherever you go.',
    },
    {
        key: 'capricorn', name: 'Capricorn', symbol: '♑', icon: '/assets/img/images/capricorn.png', range: 'December 22 – January 19',
        element: 'Earth', ruler: 'Saturn', quality: 'Cardinal', gemstone: 'Blue Sapphire', direction: 'South',
        compatibility: ['Taurus', 'Virgo'],
        positive: 'Responsible, Disciplined, Self-controlled',
        negative: 'Pessimistic, Unforgiving, Condescending',
        strength: 'Ambition, Patience, Practicality',
        weakness: 'Rigidity, Pessimism',
        about: 'Capricorn climbs steadily toward every goal. Your discipline and patience turn long-term ambitions into lasting achievements.',
    },
    {
        key: 'aquarius', name: 'Aquarius', symbol: '♒', icon: '/assets/img/images/aquarius.png', range: 'January 20 – February 18',
        element: 'Air', ruler: 'Saturn / Uranus', quality: 'Fixed', gemstone: 'Blue Sapphire', direction: 'West',
        compatibility: ['Gemini', 'Libra'],
        positive: 'Progressive, Original, Independent, Humanitarian',
        negative: 'Aloof, Stubborn, Emotionally detached',
        strength: 'Innovation, Vision, Independence',
        weakness: 'Detachment, Unpredictability',
        about: 'Aquarius marches to its own rhythm, always a step ahead. Your original thinking and humanitarian spirit inspire real change.',
    },
    {
        key: 'pisces', name: 'Pisces', symbol: '♓', icon: '/assets/img/images/pisces.png', range: 'February 19 – March 20',
        element: 'Water', ruler: 'Jupiter / Neptune', quality: 'Mutable', gemstone: 'Yellow Sapphire', direction: 'North',
        compatibility: ['Cancer', 'Scorpio'],
        positive: 'Compassionate, Artistic, Intuitive, Gentle',
        negative: 'Escapist, Overly trusting, Melancholic',
        strength: 'Empathy, Creativity, Imagination',
        weakness: 'Overwhelm, Self-sacrifice',
        about: 'Pisces feels the world through imagination and empathy. Your compassion and creativity leave a gentle mark on everyone you meet.',
    },
];

/* ── Deterministic "daily" content generator (no backend required) ── */
const GENERAL = [
    'Today brings energy and enthusiasm to help you move forward with confidence. Your determination will open new doors. Stay focused and trust your instincts.',
    'A calm, steady rhythm settles over your day. Use it to reconnect with your priorities and recharge before the week ahead.',
    'Conversations flow easily today and could open doors you did not expect. Stay open to unplanned opportunities.',
    'Your ambition is in the spotlight today — channel it into the one project that matters most to you.',
    'Emotional clarity arrives after some inner back-and-forth. Trust what your instincts are telling you.',
];
const LOVE = [
    'Your relationship will see warmth and understanding. Singles may meet someone interesting through mutual friends.',
    'Romance takes a gentle, thoughtful turn — small gestures mean more than grand ones today.',
    'Old misunderstandings may resurface; this is a good moment for honest conversation, not conflict.',
    'Your charm is magnetic right now, drawing people naturally toward you.',
];
const CAREER = [
    'Good day for professionals. New opportunities may come your way, and hard work will be recognised by your seniors.',
    'A pending decision at work finally moves forward — stay patient a little longer.',
    'Collaboration brings better results than working solo today.',
    'Recognition for past effort is on its way, even if it feels overdue.',
];
const MONEY = [
    'Financial condition looks stable. You may plan a long-term investment today — avoid unnecessary expenses.',
    'A small financial adjustment now will pay off later. Review your budget before any big purchase.',
    'Unexpected income or a good deal may come your way — use it wisely rather than spending impulsively.',
    'This is a good day to clear pending dues and simplify your finances.',
];
const HEALTH = [
    'You will feel energetic. A short meditation or yoga session will help you relax and stay balanced.',
    'Your energy levels are strong — a good day for physical activity or starting a new routine.',
    'Rest is more valuable than pushing through fatigue today; listen to your body.',
    'Hydration and a balanced meal will keep your energy steady through the day.',
];
const LUCKY_TIMES = ['9:00 AM – 10:30 AM', '10:30 AM – 12:00 PM', '1:00 PM – 2:30 PM', '4:00 PM – 5:30 PM', '6:30 PM – 8:00 PM'];
const LUCKY_COLORS = ['Red', 'Gold', 'Emerald Green', 'Sky Blue', 'Ivory', 'Maroon'];

const hashSeed = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};
const pick = (arr, seed) => arr[seed % arr.length];

const formatToday = () => {
    const d = new Date();
    const day = d.toLocaleDateString('en-US', { day: 'numeric' });
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const year = d.getFullYear();
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    return { dateStr: `${day} ${month} ${year}`, weekday, seedKey: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` };
};

const getDailyReading = (sign, seedKey) => {
    const seed = hashSeed(`${sign.key}-${seedKey}`);
    return {
        general: pick(GENERAL, seed),
        love: pick(LOVE, seed + 3),
        career: pick(CAREER, seed + 7),
        money: pick(MONEY, seed + 11),
        health: pick(HEALTH, seed + 13),
        luckyNumber: (seed % 9) + 1,
        luckyColor: pick(LUCKY_COLORS, seed + 5),
        luckyTime: pick(LUCKY_TIMES, seed + 9),
        ratings: {
            love: 3 + (seed % 3),
            career: 2 + ((seed + 2) % 4),
            money: 3 + ((seed + 4) % 3),
            health: 3 + ((seed + 6) % 3),
        },
    };
};

const StarRow = ({ count }) => (
    <div className="hs-stars">
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={15} className={i <= count ? 'hs-star hs-star--filled' : 'hs-star'} />
        ))}
    </div>
);

const HoroscopePage = () => {
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [selectedKey, setSelectedKey] = useState('aries');

    const selectedSign = ZODIAC_SIGNS.find(s => s.key === selectedKey);
    const { dateStr, weekday, seedKey } = useMemo(() => formatToday(), []);
    const reading = useMemo(() => getDailyReading(selectedSign, seedKey), [selectedSign, seedKey]);

    return (
        <div className="hs-root">
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
                className="hs-hero"
                style={{
                    backgroundImage: 'url("/assets/img/images/horoscope-banner.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="hs-container hs-hero__inner">
                    <motion.div
                        className="hs-hero__text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="hs-hero__title">Daily <span>Horoscope</span></h1>
                        <p className="hs-hero__sub">
                            Know what the stars have in store for you today.<br />
                            Guidance for a better tomorrow.
                        </p>
                        <div className="hs-hero__dash" />
                    </motion.div>
                </div>
            </section>

            {/* ── Zodiac tab strip ── */}
            <div className="hs-tabbar">
                <div className="hs-container hs-tabbar__scroll">
                    {ZODIAC_SIGNS.map(s => (
                        <button
                            key={s.key}
                            className={`hs-tab ${selectedKey === s.key ? 'hs-tab--active' : ''}`}
                            onClick={() => setSelectedKey(s.key)}
                        >
                            {s.icon ? (
                                <img src={s.icon} alt={s.name} className="hs-tab__icon-img" />
                            ) : (
                                <span className="hs-tab__symbol">{s.symbol}</span>
                            )}
                            <span className="hs-tab__name" style={{ marginTop: '4px' }}>{s.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <section className="hs-section">
                <div className="hs-container hs-layout">

                    {/* Main card */}
                    <AnimatePresence mode="wait">
                        <motion.main
                            key={selectedKey}
                            className="hs-main"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Head */}
                            <div className="hs-card-head">
                                <div className="hs-card-head__badge">
                                    {selectedSign.icon ? (
                                        <img src={selectedSign.icon} alt={selectedSign.name} className="hs-card-head__icon-img" />
                                    ) : (
                                        <span>{selectedSign.symbol}</span>
                                    )}
                                </div>
                                <div className="hs-card-head__info">
                                    <h2>{selectedSign.name}</h2>
                                    <p>{selectedSign.range}</p>
                                </div>
                                <div className="hs-date-badge">
                                    <CalendarDays size={20} />
                                    <div>
                                        <strong>{dateStr}</strong>
                                        <span>{weekday}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick facts */}
                            <div className="hs-facts">
                                <div className="hs-fact">
                                    <span className="hs-fact__label">{ELEMENT_ICON[selectedSign.element]} Element</span>
                                    <span className="hs-fact__value">• {selectedSign.element}</span>
                                </div>
                                <div className="hs-fact">
                                    <span className="hs-fact__label"><Orbit size={16} /> Ruling Planet</span>
                                    <span className="hs-fact__value">• {selectedSign.ruler}</span>
                                </div>
                                <div className="hs-fact">
                                    <span className="hs-fact__label"><Layers size={16} /> Quality</span>
                                    <span className="hs-fact__value">• {selectedSign.quality}</span>
                                </div>
                                <div className="hs-fact">
                                    <span className="hs-fact__label"><Hash size={16} /> Lucky Number</span>
                                    <span className="hs-fact__value">• {reading.luckyNumber}</span>
                                </div>
                                <div className="hs-fact">
                                    <span className="hs-fact__label"><Palette size={16} /> Lucky Color</span>
                                    <span className="hs-fact__value">• {reading.luckyColor}</span>
                                </div>
                            </div>

                            <p className="hs-intro">{reading.general}</p>

                            {/* Sections */}
                            <div className="hs-sections">
                                <div className="hs-item">
                                    <div className="hs-item__icon"><Sparkles size={22} /></div>
                                    <div>
                                        <h4>General</h4>
                                        <p>{reading.general}</p>
                                    </div>
                                </div>
                                <div className="hs-item">
                                    <div className="hs-item__icon"><Heart size={22} /></div>
                                    <div>
                                        <h4>Love</h4>
                                        <p>{reading.love}</p>
                                    </div>
                                </div>
                                <div className="hs-item">
                                    <div className="hs-item__icon"><Briefcase size={22} /></div>
                                    <div>
                                        <h4>Career</h4>
                                        <p>{reading.career}</p>
                                    </div>
                                </div>
                                <div className="hs-item">
                                    <div className="hs-item__icon hs-item__icon--rupee">₹</div>
                                    <div>
                                        <h4>Money</h4>
                                        <p>{reading.money}</p>
                                    </div>
                                </div>
                                <div className="hs-item">
                                    <div className="hs-item__icon"><Activity size={22} /></div>
                                    <div>
                                        <h4>Health</h4>
                                        <p>{reading.health}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom facts row */}
                            <div className="hs-bottom-facts">
                                <div className="hs-bottom-fact">
                                    <p className="hs-bottom-fact__label"><Clock size={16} /> Lucky Time</p>
                                    <p className="hs-bottom-fact__value">{reading.luckyTime}</p>
                                </div>
                                <div className="hs-bottom-fact">
                                    <p className="hs-bottom-fact__label"><MapPin size={16} /> Lucky Direction</p>
                                    <p className="hs-bottom-fact__value">{selectedSign.direction}</p>
                                </div>
                                <div className="hs-bottom-fact">
                                    <p className="hs-bottom-fact__label"><Gem size={16} /> Lucky Gemstone</p>
                                    <p className="hs-bottom-fact__value">{selectedSign.gemstone}</p>
                                </div>
                                <div className="hs-bottom-fact hs-bottom-fact--accent">
                                    <p className="hs-bottom-fact__label">Compatibility</p>
                                    <p className="hs-bottom-fact__value">{selectedSign.compatibility.join(', ')}</p>
                                </div>
                            </div>
                        </motion.main>
                    </AnimatePresence>

                    {/* Sidebar */}
                    <AnimatePresence mode="wait">
                        <motion.aside
                            key={selectedKey + '-side'}
                            className="hs-sidebar"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, delay: 0.05 }}
                        >
                            {/* Today's Overview */}
                            <div className="hs-panel">
                                <h3 className="hs-panel__title">Today's Overview</h3>
                                <div className="hs-overview-list">
                                    <div className="hs-overview-row">
                                        <span className="hs-overview-row__label"><Heart size={18} /> Love</span>
                                        <StarRow count={reading.ratings.love} />
                                    </div>
                                    <div className="hs-overview-row">
                                        <span className="hs-overview-row__label"><Briefcase size={18} /> Career</span>
                                        <StarRow count={reading.ratings.career} />
                                    </div>
                                    <div className="hs-overview-row">
                                        <span className="hs-overview-row__label hs-overview-row__label--rupee">₹ Money</span>
                                        <StarRow count={reading.ratings.money} />
                                    </div>
                                    <div className="hs-overview-row">
                                        <span className="hs-overview-row__label"><Activity size={18} /> Health</span>
                                        <StarRow count={reading.ratings.health} />
                                    </div>
                                </div>
                            </div>

                            {/* Traits */}
                            <div className="hs-panel">
                                <h3 className="hs-panel__title">{selectedSign.name} Traits</h3>
                                <div className="hs-traits">
                                    <div className="hs-trait">
                                        <div className="hs-trait__icon hs-trait__icon--pos"><ThumbsUp size={17} /></div>
                                        <p><strong>Positive:</strong> {selectedSign.positive}</p>
                                    </div>
                                    <div className="hs-trait">
                                        <div className="hs-trait__icon hs-trait__icon--neg"><ThumbsDown size={17} /></div>
                                        <p><strong>Negative:</strong> {selectedSign.negative}</p>
                                    </div>
                                    <div className="hs-trait">
                                        <div className="hs-trait__icon hs-trait__icon--str"><Zap size={17} /></div>
                                        <p><strong>Strength:</strong> {selectedSign.strength}</p>
                                    </div>
                                    <div className="hs-trait">
                                        <div className="hs-trait__icon hs-trait__icon--weak"><AlertTriangle size={17} /></div>
                                        <p><strong>Weakness:</strong> {selectedSign.weakness}</p>
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div className="hs-panel hs-panel--about">
                                <h3 className="hs-panel__title">About {selectedSign.name}</h3>
                                <p className="hs-about-text">{selectedSign.about}</p>
                                {/* <span className="hs-about-symbol">{selectedSign.symbol}</span> */}
                            </div>
                        </motion.aside>
                    </AnimatePresence>
                </div>

                {/* CTA banner */}
                <div className="hs-container">
                    <motion.div
                        className="hs-cta"
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="hs-cta__left">
                            <p className="hs-cta__eyebrow">Want Personalized Guidance?</p>
                            <p className="hs-cta__sub">Talk to our expert astrologers and get solutions tailored just for you.</p>
                        </div>
                        <a href="/astrologer" className="hs-cta__btn">
                            <PhoneCall size={16} /> Consult Astrologer <ArrowRight size={16} />
                        </a>
                    </motion.div>
                </div>
            </section>

            <Footer />
            <ScrollTop />

            <style>{`
        :root {
          --hs-bg: #faf9f7;
          --hs-gold: #c9882a;
          --hs-gold-light: #f0a93b;
          --hs-maroon: #3a1330;
          --hs-maroon-deep: #2b0f23;
          --hs-ink: #1a1118;
          --hs-muted: #6b6070;
          --hs-line: #ede8eb;
          --hs-card: #ffffff;
          --hs-radius: 18px;
        }

        .hs-root { background: var(--hs-bg); font-family: 'Poppins', sans-serif; color: var(--hs-ink); }
        .hs-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

        /* ── Hero ── */
        .hs-hero {
         position: relative;
        overflow: hidden;
        padding: 90px 0px;
         display: block;
         object-fit: cover;
         object-position: center top;
         vertical-align: bottom;
         border-radius: 16px;
         margin-left: 4%;
         margin-right: 4%;
        }
        .hs-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, rgba(26,10,20,0.55) 0%, rgba(26,10,20,0.15) 55%, rgba(26,10,20,0) 75%);
          pointer-events: none;
        }

        .hs-hero__inner { display: flex; align-items: center; position: relative; z-index: 2; }
        .hs-hero__text { max-width: 480px; }
        .hs-hero__title { font-size: 44px; font-weight: 800; color: #fff; margin: 0 0 14px; letter-spacing: -0.5px; text-shadow: 0 2px 12px rgba(0,0,0,0.35); }
        .hs-hero__title span { color: var(--hs-gold-light); }
        .hs-hero__sub { font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.7; margin: 0 0 18px; text-shadow: 0 1px 8px rgba(0,0,0,0.3); }
        .hs-hero__dash { width: 60px; height: 2px; background: var(--hs-gold-light); }

        /* ── Tab strip ── */
        .hs-tabbar { background: #fff; border-bottom: 1px solid var(--hs-line); position: sticky; top: 0; z-index: 20; }
        .hs-tabbar__scroll { display: flex; gap: 6px; overflow-x: auto; padding: 14px 24px; scrollbar-width: none; }
        .hs-tabbar__scroll::-webkit-scrollbar { display: none; }
        .hs-tab {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          border: none; background: transparent; padding: 10px 16px; border-radius: 14px;
          cursor: pointer; flex-shrink: 0; font-family: 'Poppins', sans-serif;
          transition: background 0.18s ease;
        }
        .hs-tab:hover { background: #fbf6f4; }
        .hs-tab--active { background: var(--hs-maroon-deep); }
        .hs-tab__symbol { font-size: 26px; color: var(--hs-gold); }
        .hs-tab--active .hs-tab__symbol { color: var(--hs-gold-light); }
        .hs-tab__icon-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid var(--hs-gold);
          object-fit: cover;
          transition: border-color 0.18s ease;
        }
        .hs-tab--active .hs-tab__icon-img {
          border-color: var(--hs-gold-light);
        }
        .hs-tab__name { font-size: 11px; font-weight: 600; color: var(--hs-muted); }
        .hs-tab--active .hs-tab__name { color: #fff; }

        /* ── Layout ── */
        .hs-section { padding: 32px 0 70px; }
        .hs-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; margin-bottom: 28px; }

        /* ── Main card ── */
        .hs-main {
          background: var(--hs-card); border: 1px solid var(--hs-line);
          border-radius: var(--hs-radius); padding: 34px 36px;
          box-shadow: 0 4px 24px rgba(60,20,40,0.06);
        }
        .hs-card-head { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
        .hs-card-head__badge {
          width: 100px; height: 100px; border-radius: 50%;
          background: linear-gradient(135deg, var(--hs-maroon-deep), #5c1f3e);
          border: 3px solid var(--hs-gold-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 42px; color: var(--hs-gold-light); flex-shrink: 0;
          overflow: hidden;
        }
        .hs-card-head__icon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hs-card-head__info { flex: 1; }
        .hs-card-head__info h2 { font-size: 26px; font-weight: 800; color: var(--hs-maroon); margin: 0; }
        .hs-card-head__info p { font-size: 13px; color: var(--hs-muted); margin: 2px 0 0; }
        .hs-date-badge {
          display: flex; align-items: center; gap: 8px;
          background: #fdf3ee; border: 1px solid rgba(240,169,59,0.3);
          border-radius: 12px; padding: 10px 14px; color: var(--hs-gold);
        }
        .hs-date-badge div { display: flex; flex-direction: column; line-height: 1.3; }
        .hs-date-badge strong { font-size: 12.5px; color: var(--hs-ink); }
        .hs-date-badge span { font-size: 10.5px; color: var(--hs-muted); }

        .hs-facts {
          display: flex; flex-wrap: wrap; gap: 20px;
          padding: 16px 0; margin-bottom: 20px;
          border-top: 1px solid var(--hs-line); border-bottom: 1px solid var(--hs-line);
        }
        .hs-fact { display: flex; flex-direction: column; gap: 4px; }
        .hs-fact__label { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--hs-gold); font-weight: 600; }
        .hs-fact__value { font-size: 12.5px; color: var(--hs-ink); font-weight: 600; }

        .hs-intro { font-size: 14.5px; line-height: 1.8; color: #3d343b; margin: 0 0 26px; }

        .hs-sections { display: flex; flex-direction: column; gap: 22px; margin-bottom: 28px; }
        .hs-item { display: flex; align-items: flex-start; gap: 16px; }
        .hs-item__icon {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
          background: var(--hs-maroon-deep); color: var(--hs-gold-light);
          display: flex; align-items: center; justify-content: center;
        }
        .hs-item__icon--rupee { font-size: 18px; font-weight: 700; }
        .hs-item h4 { font-size: 14.5px; font-weight: 700; color: var(--hs-ink); margin: 0 0 4px; }
        .hs-item p { font-size: 13px; color: var(--hs-muted); line-height: 1.7; margin: 0; }

        .hs-bottom-facts {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
          padding-top: 22px; border-top: 1px solid var(--hs-line);
        }
        .hs-bottom-fact { background: #fbf6f4; border-radius: 12px; padding: 14px; }
        .hs-bottom-fact__label { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--hs-muted); margin: 0 0 6px; }
        .hs-bottom-fact__value { font-size: 13px; font-weight: 700; color: var(--hs-ink); margin: 0; }
        .hs-bottom-fact--accent { background: #fdf3ee; }
        .hs-bottom-fact--accent .hs-bottom-fact__label,
        .hs-bottom-fact--accent .hs-bottom-fact__value { color: var(--hs-gold); }

        /* ── Sidebar ── */
        .hs-sidebar { display: flex; flex-direction: column; gap: 18px; }
        .hs-panel {
          background: var(--hs-card); border: 1px solid var(--hs-line);
          border-radius: 16px; padding: 22px 24px;
          box-shadow: 0 2px 10px rgba(60,20,40,0.04);
        }
        .hs-panel__title { font-size: 15px; font-weight: 800; color: var(--hs-maroon); margin: 0 0 16px; }

        .hs-overview-list { display: flex; flex-direction: column; gap: 14px; }
        .hs-overview-row { display: flex; align-items: center; justify-content: space-between; }
        .hs-overview-row__label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--hs-ink); font-weight: 600; }
        .hs-overview-row__label--rupee::before { content: ''; }
        .hs-stars { display: flex; gap: 2px; }
        .hs-star { color: #e4dee1; }
        .hs-star--filled { color: var(--hs-gold-light); fill: var(--hs-gold-light); }

        .hs-traits { display: flex; flex-direction: column; gap: 14px; }
        .hs-trait { display: flex; align-items: flex-start; gap: 10px; }
        .hs-trait__icon {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .hs-trait__icon--pos { background: #eefaf1; color: #2e7d5b; }
        .hs-trait__icon--neg { background: #fdeceb; color: #e0554f; }
        .hs-trait__icon--str { background: #fdf3ee; color: var(--hs-gold); }
        .hs-trait__icon--weak { background: #f1ecef; color: var(--hs-muted); }
        .hs-trait p { font-size: 12.5px; color: var(--hs-muted); line-height: 1.6; margin: 0; }
        .hs-trait p strong { color: var(--hs-ink); }

        .hs-panel--about { position: relative; overflow: hidden; }
        .hs-about-text { font-size: 12.5px; color: var(--hs-muted); line-height: 1.7; margin: 0; position: relative; z-index: 1; }
        .hs-about-symbol {
          position: absolute; bottom: -14px; right: -6px;
          font-size: 76px; color: #fdeef0; z-index: 0; line-height: 1;
        }

        /* ── CTA ── */
        .hs-cta {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
          background: linear-gradient(135deg, var(--hs-maroon-deep), #6e1f4d);
          border-radius: 20px; padding: 30px 40px;
        }
        .hs-cta__eyebrow { font-size: 18px; font-weight: 800; color: var(--hs-gold-light); margin: 0 0 6px; }
        .hs-cta__sub { font-size: 13.5px; color: rgba(255,255,255,0.7); margin: 0; }
        .hs-cta__btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, var(--hs-gold-light), var(--hs-gold));
          color: #fff; font-size: 14px; font-weight: 700;
          padding: 14px 26px; border-radius: 50px; text-decoration: none; white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hs-cta__btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(201,136,42,0.4); color: #fff; }

        /* ── Responsive ── */
        @media (max-width: 980px) {
          .hs-hero__inner { flex-direction: column; text-align: center; }
          .hs-hero__text { max-width: 100%; }
          .hs-hero__dash { margin: 0 auto; }
          .hs-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 760px) {
          .hs-main { padding: 26px 20px; }
          .hs-card-head { flex-wrap: wrap; }
          .hs-date-badge { margin-left: auto; }
          .hs-bottom-facts { grid-template-columns: repeat(2, 1fr); }
          .hs-cta { flex-direction: column; text-align: center; padding: 26px 24px; }
        }
        @media (max-width: 480px) {
          .hs-wheel { width: 200px; height: 200px; }
          .hs-hero__title { font-size: 34px; }
        }

        /* =========================================================
           RESPONSIVE ENHANCEMENTS (added — no existing rules changed)
           ========================================================= */
        @media (max-width: 980px) {
          .hs-hero {
            margin-left: 5%;
            margin-right: 5%;
            padding: 60px 0;
          }
        }
        @media (max-width: 760px) {
          .hs-hero {
            margin-left: 4%;
            margin-right: 4%;
            padding: 44px 0;
            border-radius: 14px;
          }
          .hs-hero__title { font-size: 30px; }
          .hs-hero__sub { font-size: 13.5px; }
          .hs-container { padding: 0 16px; }
          .hs-card-head__badge { width: 76px; height: 76px; font-size: 30px; }
          .hs-card-head__info h2 { font-size: 21px; }
          .hs-date-badge { padding: 8px 12px; }
          .hs-tab__icon-img { width: 48px; height: 48px; }
          .hs-facts { gap: 14px; padding: 14px 0; }
          .hs-item { gap: 12px; }
          .hs-item__icon { width: 38px; height: 38px; }
        }
        @media (max-width: 480px) {
          .hs-hero {
            margin-left: 3%;
            margin-right: 3%;
            padding: 34px 0;
          }
          .hs-hero__inner { padding: 0 6px; }
          .hs-hero__sub br { display: none; }
          .hs-container { padding: 0 14px; }
          .hs-card-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .hs-date-badge { margin-left: 0; width: 100%; }
          .hs-bottom-facts { grid-template-columns: 1fr 1fr; gap: 10px; }
          .hs-bottom-fact { padding: 12px; }
          .hs-main { padding: 20px 16px; }
          .hs-panel { padding: 18px 16px; }
          .hs-tab { padding: 8px 10px; }
          .hs-tab__icon-img { width: 42px; height: 42px; }
          .hs-cta { padding: 22px 18px; }
          .hs-cta__eyebrow { font-size: 16px; }
          .hs-cta__btn { width: 100%; justify-content: center; }
        }
        @media (max-width: 360px) {
          .hs-bottom-facts { grid-template-columns: 1fr; }
          .hs-hero__title { font-size: 26px; }
          .hs-card-head__badge { width: 64px; height: 64px; font-size: 24px; }
        }
      `}</style>
        </div>
    );
};

export default HoroscopePage;
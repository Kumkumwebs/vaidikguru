import React, { useState } from 'react'; // Added useState import
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import 'swiper/css';
import NewAppDownloadModal from '../common/NewAppDownloadModel';

const TeamSection = ({ astrologer }) => {
    // 1. Initialize state
    const [selectedAstro, setSelectedAstro] = useState(null);
    
    if (!astrologer || astrologer.length === 0) return null;

    return (
        <section className="team-area-modern space overflow-hidden" style={{ background: '#f8fafc' }}>
            <div className="container">
                {/* --- Top Bar --- */}
                <div className="title-area text-center mb-50">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        className="sub-title style1 text-theme"
                    >
                        Divine Lineage
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="sec-title"
                    >
                        Consult our <span className="text-gradient">Vedic Masters</span>
                    </motion.h2>
                    <p className="sec-text mt-3 mx-auto" style={{ maxWidth: '600px' }}>
                        Connect with verified experts across Vedic Astrology, Numerology, and 
                        Palmistry to find clarity on your cosmic path.
                    </p>
                </div>

                <div className="slider-area">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        autoplay={{ delay: 3500, disableOnInteraction: false }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                            1200: { slidesPerView: 4 },
                        }}
                        className="astroSlider"
                    >
                        {astrologer.map((item, index) => (
                            <SwiperSlide key={index}>
                                <motion.div 
                                    whileHover={{ y: -10 }}
                                    className="astro-scroll-card"
                                >
                                    <div className="astro-circle-avatar">
                                        <img 
                                            src={item.profile_img || 'assets/img/team/team_1_1.jpg'} 
                                            alt={item.name} 
                                        />
                                        <div className="status-dot-neon"></div>
                                    </div>

                                    <div className="media-body text-center">
                                        <h3 className="h5 fw-bold mb-1">
                                            {/* Keep Link for navigation to details page */}
                                            <Link to="#" className="text-dark">
                                                {item.name}
                                            </Link>
                                        </h3>
                                        <span className="small text-theme fw-bold d-block mb-3">
                                            {item.experience}+ Years Experience
                                        </span>

                                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
                                            {item.language?.map((lang, idx) => (
                                                <span key={idx} className="lang-badge">
                                                    {lang.name}
                                                </span>
                                            ))}
                                        </div>

                                        {/* 2. FIX: Change Link to button for modal trigger */}
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedAstro(item)}
                                            className="th-btn style3 py-2 px-4 rounded-pill border-0 small shadow-none"
                                        >
                                            Chat Now
                                        </button>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* 3. Reusable Modal Call */}
            <NewAppDownloadModal 
                isOpen={!!selectedAstro} 
                onClose={() => setSelectedAstro(null)}
                title={selectedAstro ? `Consult ${selectedAstro.name}` : "Consult Master"}
                subtitle={selectedAstro ? `Speak with ${selectedAstro.name} for clarity on ${selectedAstro.category?.[0]?.name || 'Life'}.` : "Join thousands who found clarity."}
            />
        </section>
    );
};

export default TeamSection;
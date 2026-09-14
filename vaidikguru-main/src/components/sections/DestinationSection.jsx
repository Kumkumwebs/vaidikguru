import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import { Link } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-coverflow';

const destinations = [
    {
        video: 'https://srm-sbox-cdn.a4b.io/yoda/1749223654986.mp4',
        title: 'Varanasi Arati',
        listings: 'Ganga Spiritual Hub',
    },
    {
        video: 'https://srm-sbox-cdn.a4b.io/yoda/1749223553429.mp4',
        title: 'Chidambaram',
        listings: 'Ancient Cosmic Energy',
    },
];

const DestinationSection = () => {
    const [activeVideo, setActiveVideo] = useState(null);

    return (
        <>
            <div className="position-relative overflow-hidden py-100 pt-30" id="destination-sec">
                <div className="container">
                    {/* REPHRASED TOP SECTION FOR DIVIN IQ */}
                    <div className="title-area text-center mb-50">
                        <span className="sub-title style1 text-theme">Divine Connectivity</span>
                        <h2 className="sec-title text-white-gradient">Can Spiritual Energy Transcend Distance?</h2>
                        <p className="sec-text mt-3 mx-auto" style={{maxWidth: '800px', color: '#64748b'}}>
                            Discover how intention and Vedic sound science create a bridge to the divine. 
                            Learn why a ritual performed with true <strong>Sankalpa</strong> is equally potent, 
                            whether you are at the temple altar or connecting from your home.
                        </p>
                    </div>

                    <Swiper
                        modules={[EffectCoverflow]}
                        effect="coverflow"
                        centeredSlides
                        grabCursor
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 95,
                            depth: 212,
                            modifier: 1,
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 2 },
                            992: { slidesPerView: 3 },
                        }}
                        className="th-slider destination-slider slider-drag-wrap"
                    >
                        {destinations.map((dest, index) => (
                            <SwiperSlide key={index}>
                                <div className="destination-box elite-card-shadow">
                                    <div className="destination-img overflow-hidden rounded-30">

                                        {/* VIDEO USED AS THUMBNAIL */}
                                        <video
                                            src={dest.video}
                                            muted
                                            loop
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => e.target.pause()}
                                            preload="metadata"
                                            playsInline
                                            className="destination-video-thumb"
                                            style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                                        />

                                        <button
                                            className="video-play-btn pulse-live"
                                            onClick={() => setActiveVideo(dest.video)}
                                            style={{ background: 'var(--theme-color)', color: '#fff' }}
                                        >
                                            <i className="fas fa-play"></i>
                                        </button>

                                        {/* <div className="destination-content backdrop-blur">
                                            <div className="media-left">
                                                <h4 className="box-title">
                                                    <Link to="/service-details" className="text-white">
                                                        {dest.title}
                                                    </Link>
                                                </h4>
                                                <span className="destination-subtitle text-theme">
                                                    {dest.listings}
                                                </span>
                                            </div>
                                            <Link
                                                to="/service-details"
                                                className="th-btn style3 py-2 px-3 rounded-inner small"
                                            >
                                                Explore
                                            </Link>
                                        </div> */}

                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* MODAL (CUSTOM STYLING) */}
            {activeVideo && (
                <div className="diviniq-video-modal" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div
                        className="video-overlay"
                        onClick={() => setActiveVideo(null)}
                        style={{ background: 'rgba(15, 23, 42, 0.9)', position: 'absolute', inset: 0, backdropFilter: 'blur(10px)' }}
                    />
                    <div className="video-container position-relative" style={{ width: '90%', maxWidth: '900px', zIndex: 1 }}>
                        <button
                            className="video-close text-white"
                            onClick={() => setActiveVideo(null)}
                            style={{ position: 'absolute', top: '-40px', right: 0, background: 'none', border: 'none', fontSize: '30px' }}
                        >
                            <i className="fal fa-times"></i>
                        </button>
                        <video
                            src={activeVideo}
                            className="rounded-30 shadow-2xl"
                            controls
                            autoPlay
                            style={{ width: '100%', border: '2px solid rgba(255,255,255,0.1)' }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default DestinationSection;
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Adding motion for consistency
import 'swiper/css';
import apiService from '../../services/apiServices';

const BlogSection = ({ blog }) => {
    if (!blog || blog.length === 0) return null;

    return (
        <section
            className="bg-smoke overflow-hidden space"
            id="blog-sec"
            style={{ background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)' }}
        >
            <div className="container">
                <div className="mb-40 text-center text-md-start">
                    <div className="row align-items-end justify-content-between">
                        <div className="col-md-8">
                            <div className="title-area mb-md-0">
                                <motion.span 
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="sub-title style1 text-theme"
                                >
                                    Celestial Wisdom
                                </motion.span>
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="sec-title"
                                >
                                    Insights from the <span className="text-gradient">Vedic Cosmos</span>
                                </motion.h2>
                                <p className="mt-3 text-muted d-none d-md-block" style={{ maxWidth: '600px' }}>
                                    Deepen your understanding of Astrology, Vastu, and Vedic rituals 
                                    through our curated collection of spiritual articles.
                                </p>
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <Link to="/blog" className="th-btn style3 py-2 px-4 rounded-inner small border-0">
                                Explore All Wisdom <i className="far fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="slider-area">
                    <Swiper
                        modules={[Autoplay]}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        spaceBetween={30}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            576: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                        }}
                        className="th-slider has-shadow"
                    >
                        {blog.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="blog-box elite-card-shadow rounded-25 overflow-hidden bg-white h-100 transition-all">
                                    <div className="blog-img overflow-hidden" style={{ height: '240px' }}>
                                        <img 
                                            src={item.img} 
                                            alt={item.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            className="transition-all"
                                        />
                                    </div>
                                    <div className="blog-box_content p-4">
                                        <div className="blog-meta mb-3 d-flex gap-3 small text-muted">
                                            <span>
                                                <i className="fal fa-calendar-alt text-theme me-2"></i>
                                                {apiService.formatDate(item.Created_date)}
                                            </span>
                                            <span>
                                                <i className="fal fa-user text-theme me-2"></i>
                                                By {item.auther}
                                            </span>
                                        </div>
                                        <h3 className="box-title h5 mb-4 line-clamp-2">
                                            <Link to="/blog-details" className="text-dark hover-theme">
                                                {item.title}
                                            </Link>
                                        </h3>
                                        <Link to="/blog-details" className="text-theme fw-bold small text-decoration-none">
                                            Continue Reading <i className="far fa-long-arrow-right ms-2"></i>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Decorative Shapes */}
                <div className="shape-mockup d-none d-xxl-block" data-bottom="20%" data-left="-10%" style={{ opacity: 0.2 }}>
                    <img src="/assets/img/shape/shape_1.png" alt="sacred geometry" />
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
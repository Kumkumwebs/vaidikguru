import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";

const TestimonialSection = ({ testimonial }) => {
    if (!testimonial || testimonial.length === 0) return null;

    return (
        <section className="space overflow-hidden bg-smoke">
            <div className="container">
                
                {/* REPHRASED HEADER */}
                <div className="title-area text-center mb-40">
                    <span className="sub-title style1 text-theme">Sacred Voices</span>
                    <h2 className="sec-title">Journeys of <span className="text-gradient">Transformation</span></h2>
                </div>

                <div className="slider-area">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 5000 }}
                        loop={true}
                        spaceBetween={20}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                        }}
                    >
                        {testimonial.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="testi-card-compact shadow-sm">
                                    
                                    <div className="testi-stars-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fa-solid fa-star"></i>
                                        ))}
                                    </div>

                                    <div 
                                        className="testi-text-sm"
                                        dangerouslySetInnerHTML={{ __html: `"${item.description}"` }}
                                    ></div>

                                    <div className="testi-header d-flex align-items-center mt-auto pt-3 border-top border-light">
                                        <div className="avatar-fixed">
                                            <img 
                                                src={item.img || '/assets/img/testimonial/default.jpg'} 
                                                alt={item.title} 
                                            />
                                        </div>
                                        <div className="ms-3 text-start">
                                            <h6 className="mb-0 fw-bold" style={{fontSize: '15px'}}>{item.title}</h6>
                                            <span className="xsmall text-theme opacity-75 fw-bold uppercase">Verified Seeker</span>
                                        </div>
                                        {/* Floating Quote Icon */}
                                        <img 
                                            src="/assets/img/icon/testi-quote.svg" 
                                            alt="quote" 
                                            style={{width: '24px', opacity: '0.1', marginLeft: 'auto'}} 
                                        />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSection;
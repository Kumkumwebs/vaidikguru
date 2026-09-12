import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ShopChadhava from "./shopChadhava";
import TestimonialSection from "./TestimonialSection";
import FaqSection from "./FAQSection";
import BenefitOfOfferingsWidget from "./BenefitOfferingWidget";
import DescriptionBlock from "../common/DescriptionText";

const Chadhava = ({ chadhava }) => {
    if (!chadhava) return null;
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const images = [
        "assets/img/tour/tour_inner_1.jpg",
        "assets/img/tour/tour_inner_2.jpg",
        "assets/img/tour/tour_inner_3.jpg",
    ];

    return (
        <div>
            <section className="space">
                <div className="container">
                    <div className="row">
                        {/* LEFT CONTENT */}
                        <div className="col-xxl-6 col-lg-6">
                            <div className="tour-page-single">

                                {/* ===== IMAGE SLIDER ===== */}
                                <div className="slider-area tour-slider1">

                                    {/* MAIN SLIDER */}
                                    <Swiper
                                        modules={[Thumbs, EffectFade, Navigation]}
                                        effect="fade"
                                        loop
                                        navigation={{
                                            nextEl: ".slider-next",
                                            prevEl: ".slider-prev",
                                        }}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        className="th-slider mb-4"
                                    >
                                        {chadhava.bannerImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tour-slider-img">
                                                    <img src={img} alt="tour" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* THUMB SLIDER */}
                                    <Swiper
                                        modules={[Thumbs]}
                                        onSwiper={setThumbsSwiper}
                                        loop
                                        watchSlidesProgress
                                        slidesPerView={3}
                                        spaceBetween={10}
                                        breakpoints={{
                                            0: { slidesPerView: 2 },
                                            768: { slidesPerView: 3 },
                                        }}
                                        className="th-slider tour-thumb-slider"
                                    >
                                        {chadhava.bannerImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tour-slider-img">
                                                    <img src={img} alt="thumb" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* ARROWS */}
                                    <button className="slider-arrow style3 slider-prev">
                                        <img src="assets/img/icon/hero-arrow-left.svg" alt="" />
                                    </button>
                                    <button className="slider-arrow style3 slider-next">
                                        <img src="assets/img/icon/hero-arrow-right.svg" alt="" />
                                    </button>
                                </div>



                            </div>
                        </div>
                        {/* RIGHT SIDEBAR */}
                        <div className="col-xxl-6 col-lg-6">
                            <aside className="sidebar-area">

                                <div className="widget widget_tour_summary modern-summary">
                                    {/* Availability Notice */}
                                    <div className="time-alert">
                                        <div className="availability-text">
                                            Limited availability · Final day to participate
                                        </div>
                                        <div className="time-alert-bar"></div>
                                    </div>



                                    <div className="tour-summary-content">

                                        {/* Meta */}
                                        <div className="page-meta mb-20">
                                            <span className="page-tag premium-tag">Featured Offering</span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="box-title summary-title">
                                            {chadhava.title}
                                        </h3>

                                        {/* Price */}
                                        <h4 className="tour-price modern-price">
                                            <span className="currency">₹18,999</span>
                                            <span className="price-note">per person</span>
                                        </h4>

                                        {/* Description */}
                                        <DescriptionBlock text={chadhava.description} />
                                        <p className="box-text mb-25 summary-desc temple-line">
                                            <i className="fa-solid fa-gopuram temple-fa"></i>
                                            {chadhava.templeName}
                                        </p>

                                        {/* CTA */}
                                        <a href="#" className="th-btn style3 w-100 modern-cta">
                                            Reserve Your Offering
                                        </a>

                                    </div>

                                </div>

                            </aside>
                        </div>


                    </div>



                </div>
            </section>
            <ShopChadhava chadhava={chadhava} />
            <div className="container">
                <h2 class="box-title">How it Works?</h2>
                <div class="service-img"><img src="https://vama.app/_next/static/media/en_how_works_dweb.f1c6b13d.jpg" alt="" /></div>
            </div>
            <div className="container">
                <h2 class="box-title">More About Chadhava</h2>
                <DescriptionBlock text={chadhava.description} />

            </div>
            <BenefitOfOfferingsWidget />
            <FaqSection faq={[
                {
                    question: "How do I begin the process of purchasing a home?",
                    answer: "Start by defining your budget, getting pre-approved for a loan, and identifying your preferred location. This ensures a smooth and confident buying journey."
                },
                {
                    question: "What should I look for when selecting a neighborhood?",
                    answer: "Consider safety, accessibility, nearby amenities, schools, future development plans, and overall lifestyle compatibility before making a decision."
                },
                {
                    question: "How can I determine the right selling price for my property?",
                    answer: "Analyze local market trends, recent comparable sales, and consult a professional valuation to set a competitive and realistic price."
                },
                {
                    question: "What are closing costs and who typically pays them?",
                    answer: "Closing costs include legal fees, taxes, and administrative charges. Payment responsibility varies based on negotiation and local regulations."
                },
                {
                    question: "How can I negotiate effectively when buying property?",
                    answer: "Research the market thoroughly, stay within budget, remain flexible, and be prepared to walk away if the deal doesn’t align with your goals."
                },
                {
                    question: "Is a home inspection really necessary?",
                    answer: "Yes. A professional inspection helps identify structural or maintenance issues early, protecting you from unexpected expenses later."
                },
            ]} />
            <TestimonialSection />
        </div>
    );
};

export default Chadhava;

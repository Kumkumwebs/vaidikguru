import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, EffectFade, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import TestimonialSection from "./TestimonialSection";
import FaqSection from "./FAQSection";
import BenefitOfOfferingsWidget from "./BenefitOfferingWidget";
import DescriptionBlock from "../common/DescriptionText";
import CountdownTimer from "../common/CountDownTimmer";
import BenefitsPujaWidget from "./BenefitsPujaWidget";
import PujaProcessWidget from "./PujaProcessWidget";
import PujaProcessFlow from "./PujaProcessWidget";
import PujaPackages from "./PujaPackages";
import UserReviews from "./UserReviews";
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";

const Puja = ({ puja }) => {
    if (!puja) return null;
    const [thumbsSwiper, setThumbsSwiper] = useState(null);



    return (
        <div className="pj-page">
            {/* =========================================================
                RESPONSIVE ENHANCEMENTS (added only — no other rules/JSX changed)
                ========================================================= */}
            <style>{`
                /* ── fully isolated to this component ──
                   every rule below targets only pj- prefixed classes
                   added directly in this JSX, so nothing here can ever
                   match or override elements on other pages, even if
                   those pages reuse theme class names like
                   tour-slider-img, summary-title, modern-summary,
                   puja-purpose-title, time-alert, slider-arrow, etc. */

                .pj-banner-img {
                  border-radius: 14px;
                  overflow: hidden;
                }
                .pj-banner-img__el {
                  width: 100% !important;
                  height: 300px !important;
                  object-fit: cover !important;
                  display: block !important;
                }
                .pj-thumb-img {
                  border-radius: 10px;
                  overflow: hidden;
                }
                .pj-thumb-img__el {
                  width: 100% !important;
                  height: 74px !important;
                  object-fit: cover !important;
                  display: block !important;
                }

                .pj-summary-title {
                  font-size: inherit;
                }
                .pj-purpose-title {
                  font-size: inherit;
                }
                .pj-summary-card {
                  /* placeholder for future overrides, unique hook */
                }
                .pj-time-alert {
                  /* placeholder for future overrides, unique hook */
                }
                .pj-availability-text {
                  /* placeholder for future overrides, unique hook */
                }
                .pj-slider-arrow {
                  /* placeholder for future overrides, unique hook */
                }

                @media (max-width: 991px) {
                  .pj-row-fix {
                    flex: 0 0 100%;
                    max-width: 100%;
                    width: 100%;
                  }
                  .pj-tour-single {
                    margin-bottom: 24px;
                  }
                  .pj-banner-img__el {
                    height: 260px !important;
                  }
                }
                @media (max-width: 767px) {
                  .pj-banner-img__el {
                    height: 220px !important;
                  }
                  .pj-thumb-img__el {
                    height: 60px !important;
                  }
                  .pj-summary-title {
                    font-size: 20px !important;
                    line-height: 1.3 !important;
                  }
                  .pj-availability-text {
                    font-size: 12.5px !important;
                  }
                  .pj-purpose-title {
                    font-size: 20px !important;
                    line-height: 1.4 !important;
                  }
                  .pj-summary-card {
                    padding: 16px !important;
                  }
                }
                @media (max-width: 480px) {
                  .pj-banner-img__el {
                    height: 190px !important;
                  }
                  .pj-summary-title {
                    font-size: 18px !important;
                  }
                  .pj-purpose-title {
                    font-size: 18px !important;
                  }
                  .pj-slider-arrow {
                    width: 34px !important;
                    height: 34px !important;
                  }
                }
            `}</style>

            <section className="space">
                <div className="container">
                    <div className="row pj-row">
                        {/* LEFT CONTENT */}
                        <div className="col-xxl-6 col-lg-6 pj-row-fix">
                            <div className="tour-page-single pj-tour-single">

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
                                        {puja.bannerImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tour-slider-img pj-banner-img">
                                                    <img src={img} alt="tour" className="pj-banner-img__el" />
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
                                        {puja.bannerImages.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="tour-slider-img pj-thumb-img">
                                                    <img src={img} alt="thumb" className="pj-thumb-img__el" />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* ARROWS */}
                                    <button className="slider-arrow style3 slider-prev pj-slider-arrow">
                                        <img src="assets/img/icon/hero-arrow-left.svg" alt="" />
                                    </button>
                                    <button className="slider-arrow style3 slider-next pj-slider-arrow">
                                        <img src="assets/img/icon/hero-arrow-right.svg" alt="" />
                                    </button>
                                </div>



                            </div>
                        </div>
                        {/* RIGHT SIDEBAR */}
                        <div className="col-xxl-6 col-lg-6 pj-row-fix">
                            <aside className="sidebar-area">

                                <div className="widget widget_tour_summary modern-summary pj-summary-card">
                                    {/* Availability Notice */}
                                    <div className="time-alert pj-time-alert">
                                        <div className="availability-text pj-availability-text">
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
                                        <h3 className="box-title summary-title pj-summary-title">
                                            {puja.title}
                                        </h3>



                                        {/* Description */}
                                        <DescriptionBlock text={puja.purposeOfPooja} />
                                        <p className="box-text mb-10 summary-desc temple-line">
                                            <i className="fa-solid fa-gopuram temple-fa me-2"></i>

                                            {puja.mandirName}
                                        </p>
                                        <p className="box-text mb-10 summary-desc temple-line">

                                            <i className="fa-solid fa-calendar-days me-2"></i>
                                            {puja.mandirName}
                                        </p>
                                        <p className="box-text summary-desc mb-10">
                                            Over <strong>3,00,000+ devotees</strong>  have participated in pujas conducted by
                                            <strong> VaidikGuru</strong>.
                                        </p>






                                        {/* CTA */}
                                        <a href="#" className="th-btn style3 w-100 modern-cta">
                                            Select Puja Package
                                        </a>

                                    </div>

                                </div>

                            </aside>
                        </div>


                    </div>



                </div>
            </section>
            <CountdownTimer pujaDate={puja.pujaDate}/>
            <div className="container pt-20 mb-30">
  <div className="puja-purpose-block">

    {/* Heading with icon */}
    <h2 className="box-title puja-purpose-title pj-purpose-title">
      <span className="puja-purpose-icon">🕉️</span>
      {puja.purposeOfPooja}
    </h2>

    {/* Description */}
    <DescriptionBlock text={puja.aboutPuja} />

  </div>
</div>

            {/* <ShopPuja Puja={Puja} /> */}


            <BenefitsPujaWidget />
            <PujaProcessFlow/>
            <PujaPackages puja={puja}/>
            <UserReviews
  reviews={[
    {
      userName: "Rakesh Sharma",
      userImage: "/assets/img/user/user1.jpg",
      location: "Delhi",
      rating: 5,
      comment:
        "The puja was performed with great devotion. I received the video and blessings exactly as promised. Truly divine experience.",
      date: "2025-02-12",
    },
    {
      userName: "Anita Verma",
      userImage: "/assets/img/user/user2.jpg",
      location: "Mumbai",
      rating: 4,
      comment:
        "Very peaceful experience. The pandit ji called out our names clearly during sankalp. Felt blessed.",
      date: "2025-02-08",
    },
  ]}
/>


            <FaqSection faq={puja.faq} />
            <TestimonialSection />
        </div>
    );
};

export default Puja;
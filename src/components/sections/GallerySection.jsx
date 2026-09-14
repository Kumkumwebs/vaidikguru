import React, { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

const galleryImages = [
  { src: "/assets/img/bg/6.png", alt: "Sacred Ritual" },
  { src: "/assets/img/bg/Untitled design (7).png", alt: "Temple Darshan" },
  { src: "/assets/img/bg/2.png", alt: "Vedic Altar" },
  { src: "/assets/img/bg/Untitled design (9).png", alt: "Homa Ritual" },
  { src: "/assets/img/bg/3.png", alt: "Divine Idol" },
  { src: "/assets/img/bg/4.png", alt: "Temple Architecture" },
  { src: "/assets/img/bg/5.png", alt: "Evening Arati" },
];

const GalleryCard = ({ src, alt, fixedHeight, onLongPress }) => {
  const timerRef = useRef(null);

  const handleTouchStart = useCallback(() => {
    if (!onLongPress) return;
    timerRef.current = setTimeout(() => {
      onLongPress(src, alt);
    }, 500);
  }, [src, alt, onLongPress]);

  const handleTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <div
      className="gallery-card elite-card-shadow rounded-20 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      <div className="box-img global-img gallery-touch-animate">
        <a
          href={src}
          className="popup-image"
          onClick={(e) => fixedHeight && e.preventDefault()}
        >
          <div className="icon-btn bg-theme">
            <i className="fal fa-expand-wide"></i>
          </div>
          <img
            src={src}
            alt={alt}
            style={
              fixedHeight
                ? { height: "220px", width: "100%", objectFit: "cover" }
                : {}
            }
          />
        </a>
      </div>
    </div>
  );
};

/* Fullscreen Lightbox overlay */
const Lightbox = ({ src, alt, onClose }) => {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.92)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        animation: "fadeInLightbox 0.3s ease",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "18px",
          right: "18px",
          background: "transparent",
          border: "none",
          color: "#fff",
          fontSize: "32px",
          cursor: "pointer",
          zIndex: 100000,
        }}
        aria-label="Close"
      >
        &times;
      </button>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: "100%",
          maxHeight: "85vh",
          objectFit: "contain",
          borderRadius: "12px",
        }}
      />
    </div>
  );
};

const GallerySection = () => {
  const swiperRef = useRef(null);
  const [lightbox, setLightbox] = useState({ src: null, alt: "" });

  const openLightbox = useCallback((src, alt) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ src: null, alt: "" });
  }, []);

  return (
    <div className="gallery-area space" style={{ background: "#ffffff" }}>
      {/* Lightbox for mobile long-press */}
      <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />

      {/* Inline styles for mobile touch animation & lightbox fade */}
      <style>{`
        @keyframes fadeInLightbox {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 767px) {
          .gallery-touch-animate {
            -webkit-tap-highlight-color: transparent;
          }
          .gallery-touch-animate:active::after {
            height: 100% !important;
            opacity: 0 !important;
            transition: all 0.4s linear !important;
          }
          .gallery-touch-animate:active img {
            transform: scale(1.3) !important;
          }
          .gallery-touch-animate:active .icon-btn {
            transform: scale(1) !important;
          }
        }
      `}</style>

      <div className="container th-container">
        {/* DIVINIQ REPHRASED HEADER */}
        <div className="title-area text-center mb-50">
          <span className="sub-title style1 text-theme">Divine Glimpses</span>
          <h2 className="sec-title text-gradient">Sacred Darshan Gallery</h2>
          <p className="sec-text mt-3 mx-auto" style={{ maxWidth: "600px" }}>
            Witness the sanctity of our ancient temples and the precision of
            Vedic rituals captured in their most divine moments.
          </p>
        </div>

        {/* Desktop Grid - hidden on mobile */}
        <div className="row gy-10 gx-10 justify-content-center align-items-center d-none d-md-flex">
          {/* Column 1 */}
          <div className="col-md-6 col-lg-2">
            <GalleryCard src="/assets/img/bg/6.png" alt="Sacred Ritual" />
          </div>

          {/* Column 2 - Stacked */}
          <div className="col-md-6 col-lg-2">
            <div className="mb-10">
              <GalleryCard
                src="/assets/img/bg/Untitled design (7).png"
                alt="Temple Darshan"
              />
            </div>
            <GalleryCard src="/assets/img/bg/2.png" alt="Vedic Altar" />
          </div>

          {/* Column 3 - Center Feature */}
          <div className="col-md-6 col-lg-2">
            <GalleryCard
              src="/assets/img/bg/Untitled design (9).png"
              alt="Homa Ritual"
            />
          </div>

          {/* Column 4 - Stacked */}
          <div className="col-md-6 col-lg-2">
            <div className="mb-10">
              <GalleryCard src="/assets/img/bg/3.png" alt="Divine Idol" />
            </div>
            <GalleryCard src="/assets/img/bg/4.png" alt="Temple Architecture" />
          </div>

          {/* Column 5 */}
          <div className="col-md-6 col-lg-2">
            <GalleryCard src="/assets/img/bg/5.png" alt="Evening Arati" />
          </div>
        </div>

        {/* Mobile Carousel - visible only on mobile */}
        <div className="d-block d-md-none">
          <Swiper
            modules={[Autoplay, Navigation]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            spaceBetween={15}
            loop={true}
            slidesPerView={1.3}
            centeredSlides={true}
            className="gallery-mobile-swiper"
          >
            {galleryImages.map((img, index) => (
              <SwiperSlide key={index}>
                <GalleryCard
                  src={img.src}
                  alt={img.alt}
                  fixedHeight
                  onLongPress={openLightbox}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              className="th-btn style3 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px", padding: 0 }}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="th-btn style3 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "44px", height: "44px", padding: 0 }}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* SHAPES - REPLACED WITH DIVINIQ STYLE */}
        <div
          className="shape-mockup d-none d-xl-block"
          data-top="-25%"
          data-left="0%"
        >
          <img src="/assets/img/shape/line.png" alt="sacred line" />
        </div>
        <div
          className="shape-mockup movingX d-none d-xl-block"
          data-top="30%"
          data-left="-3%"
        >
          <img
            className="gmovingX"
            src="/assets/img/shape/shape_4.png"
            alt="sacred shape"
          />
        </div>
      </div>
    </div>
  );
};

export default GallerySection;

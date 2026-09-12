import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    Thumbs,
    Autoplay,
    EffectFade,
} from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/thumbs';
// import NewAppDownloadModal from '../common/NewAppDownloadModel';

const HeroSection = ({astrologer}) => {
	if(!astrologer) return null;
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [selectedAstro, setSelectedAstro] = useState(null);
    const mainSwiperRef = useRef(null);

    // Hero slides data - Rephrased for Chadhava, Puja, Darshan, Astrology
    const heroSlides = [
        {
            id: 1,
            bgType: 'video',
            bgSrc: '/assets/img/hero/hero-video.mp4',
            title: 'Sacred',
            titleSpan: 'Chadhava Offerings',
            description: 'Offer your devotion at India\'s most powerful energy centers. We ensure your sacred offerings are presented with authentic Vedic protocols.',
            buttonText: 'Book Chadhava',
            buttonLink: '/service-details',
        },
        {
            id: 2,
            bgType: 'video',
            bgSrc: '/assets/img/hero/hero-video.mp4',
            title: 'Divine',
            titleSpan: 'Vedic Puja Rituals',
            description: 'Experience live Vedic rituals performed by master priests. Align your life with cosmic energies through the science of Mantra and Sankalpa.',
            buttonText: 'Book a Puja',
            buttonLink: '/service-details',
        },
        {
            id: 3,
            bgType: 'video',
            bgSrc: '/assets/img/hero/hero-video.mp4',
            title: 'Eternal',
            titleSpan: 'Virtual Darshan',
            description: 'Witness the majesty of ancient temples from the comfort of your home. Get closer to the divine through our curated virtual Darshan portals.',
            buttonText: 'Get Darshan',
            buttonLink: '/service-details',
        },
        {
            id: 4,
            bgType: 'video',
            bgSrc: '/assets/img/hero/hero-video.mp4',
            title: 'Celestial',
            titleSpan: 'Expert Consultation',
            description: 'Consult with India\'s most accurate Vedic masters. Unlock your destiny and find solutions to life\'s complexities through planetary wisdom.',
            buttonText: 'Chat Now',
            buttonLink: '/astrologer-grid',
        },
    ];

    // Thumbnail slides data
    const thumbSlides = [
        { id: 1, image: '/assets/img/hero/hero_bg_2_1.jpg', title: 'Chadhava', price: 'Sacred' },
        { id: 2, image: '/assets/img/hero/hero_bg_2_2.jpg', title: 'Puja Ritual', price: 'Vedic' },
        { id: 3, image: '/assets/img/hero/hero_bg_2_3.jpg', title: 'Virtual Darshan', price: 'Divine' },
        { id: 4, image: '/assets/img/hero/hero_bg_2_2.jpg', title: 'Astro Consult', price: 'Celestial' },
    ];

    return (
			<div className="hero-2 mt-20" id="hero">
				<div
					className="hero2-overlay"
					style={{ backgroundImage: `url('/assets/img/bg/line-pattern.png')` }}
				></div>

				{/* Main Hero Slider */}
				<Swiper
					modules={[Navigation, Pagination, Thumbs, Autoplay, EffectFade]}
					effect="fade"
					loop={true}
					autoplay={{ delay: 5000, disableOnInteraction: false }}
					thumbs={{
						swiper:
							thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
					}}
					pagination={{ clickable: true, el: '.hero-pagination' }}
					onSwiper={swiper => {
						mainSwiperRef.current = swiper;
					}}
					className="hero-slider-2"
					id="heroSlide2"
				>
					{heroSlides.map(slide => (
						<SwiperSlide key={slide.id}>
							<div className="hero-inner">
								<div className="th-hero-video">
									<video autoPlay loop muted playsInline>
										<source src={slide.bgSrc} type="video/mp4" />
									</video>
								</div>
								<div className="container">
									<div className="hero-style2">
										<h1 className="hero-title">
											{slide.title}{' '}
											<span className="hero-text">{slide.titleSpan}</span>
										</h1>
										<p className="hero-desc">{slide.description}</p>
										<div className="btn-group">
											<Link
												to={slide.buttonLink}
												className="th-btn white-btn th-icon"
											>
												{slide.buttonText}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Custom Navigation */}
				<div className="th-swiper-custom">
					<div className="swiper-pagination hero-pagination"></div>
					<div className="hero-icon">
						<button
							className="hero-arrow slider-prev"
							onClick={() => mainSwiperRef.current?.slidePrev()}
						>
							<i className="far fa-arrow-left"></i>
						</button>
						<button
							className="hero-arrow slider-next"
							onClick={() => mainSwiperRef.current?.slideNext()}
						>
							<i className="far fa-arrow-right"></i>
						</button>
					</div>
				</div>

				{/* Thumbs Slider */}
				<Swiper
					modules={[Thumbs]}
					onSwiper={setThumbsSwiper}
					slidesPerView={4}
					spaceBetween={20}
					watchSlidesProgress={true}
					className="heroThumbs style2"
					id="heroSlide3"
					breakpoints={{
						0: { slidesPerView: 1 },
						576: { slidesPerView: 2 },
						768: { slidesPerView: 2 },
						992: { slidesPerView: 2 },
					}}
				>
					{astrologer.map(thumb => (
						<SwiperSlide key={thumb.id}>
							<div className="hero-inner">
								<div className="hero-card">
									<img
										src={thumb.profile_img}
										alt={thumb.name}
										width={168}
										height={168}
										className="hero-img"
									/>

									<div className="hero-card_content">
										<h3 className="box-title">{thumb.name}</h3>
										<h4 className="hero-card_price">
											<span className="currency">{thumb.name}</span>
										</h4>
										
										<button 
                                            type="button"
                                            onClick={() => setSelectedAstro(thumb)}
                                            className="th-btn style2">
                                           Explore
                                        </button>
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>

				{/* Scroll Down */}
				<div className="scroll-down">
					<a href="#about-sec" className="scroll-wrap">
						<span>
							<img src="assets/img/icon/down-arrow.svg" alt="" />
						</span>
						Scroll Down
					</a>
				</div>
				 {/* <NewAppDownloadModal
                isOpen={!!selectedAstro} 
                onClose={() => setSelectedAstro(null)}
                title={selectedAstro ? `Consult ${selectedAstro.name}` : "Consult Master"}
                subtitle={selectedAstro ? `Speak with ${selectedAstro.name} for clarity on ${selectedAstro.category?.[0]?.name || 'Life'}.` : "Join thousands who found clarity."}
            /> */}
			</div>
		);
};

export default HeroSection;
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// BrandSection - matching original HTML (lines 2301-2407)
const BrandSection = () => {
	const brands = [
		'/assets/img/brand/brand_1_1.svg',
		'/assets/img/brand/brand_1_2.svg',
		'/assets/img/brand/brand_1_3.svg',
		'/assets/img/brand/brand_1_4.svg',
		'/assets/img/brand/brand_1_5.svg',
		'/assets/img/brand/brand_1_6.svg',
		'/assets/img/brand/brand_1_7.svg',
		'/assets/img/brand/brand_1_8.svg',
		// Duplicate for slider continuity
		'/assets/img/brand/brand_1_1.svg',
		'/assets/img/brand/brand_1_2.svg',
		'/assets/img/brand/brand_1_3.svg',
		'/assets/img/brand/brand_1_4.svg',
	];

	return (
		<div className="brand-area overflow-hidden space-bottom">
			<div className="container th-container">
				<Swiper
					modules={[Autoplay]}
					autoplay={{ delay: 2000, disableOnInteraction: false }}
					spaceBetween={30}
					loop={true}
					breakpoints={{
						0: { slidesPerView: 1 },
						576: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						992: { slidesPerView: 3 },
						1200: { slidesPerView: 6 },
						1400: { slidesPerView: 8 },
					}}
					className="th-slider brandSlider1"
					id="brandSlider1"
				>
					{brands.map((brand, index) => (
						<SwiperSlide key={index}>
							<div className="brand-box">
								<a href="#">
									<img className="original" src={brand} alt="Brand Logo" />
									<img className="gray" src={brand} alt="Brand Logo" />
								</a>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default BrandSection;

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

// CategorySection - matching original HTML (lines 1044-1208)
const CategorySection = () => {
	const categories = [
		{ img: '/assets/img/category/category_1_1.jpg', title: 'Cruises' },
		{ img: '/assets/img/category/category_1_2.jpg', title: 'Hiking' },
		{ img: '/assets/img/category/category_1_3.jpg', title: 'Airbirds' },
		{ img: '/assets/img/category/category_1_4.jpg', title: 'Wildlife' },
		{ img: '/assets/img/category/category_1_5.jpg', title: 'Walking' },
		// Duplicate for slider continuity
		{ img: '/assets/img/category/category_1_1.jpg', title: 'Cruises' },
		{ img: '/assets/img/category/category_1_2.jpg', title: 'Hiking' },
		{ img: '/assets/img/category/category_1_3.jpg', title: 'Airbirds' },
		{ img: '/assets/img/category/category_1_4.jpg', title: 'Wildlife' },
		{ img: '/assets/img/category/category_1_5.jpg', title: 'Walking' },
		{ img: '/assets/img/category/category_1_1.jpg', title: 'Cruises' },
		{ img: '/assets/img/category/category_1_2.jpg', title: 'Hiking' },
		{ img: '/assets/img/category/category_1_3.jpg', title: 'Airbirds' },
		{ img: '/assets/img/category/category_1_4.jpg', title: 'Wildlife' },
		{ img: '/assets/img/category/category_1_5.jpg', title: 'Walking' },
	];

	return (
		<section
			className="category-area bg-top-center"
			data-bg-src="/assets/img/bg/category_bg_1.png"
		>
			<div className="container th-container">
				<div className="title-area text-center">
					<span className="sub-title">Wonderful Place For You</span>
					<h2 className="sec-title">Tour Categories</h2>
				</div>
				<Swiper
					modules={[Pagination, Autoplay]}
					spaceBetween={50}
					autoplay={{ delay: 3000, disableOnInteraction: false }}
					pagination={{ clickable: true, el: '.category-pagination' }}
					breakpoints={{
						0: { slidesPerView: 1 },
						576: { slidesPerView: 1 },
						768: { slidesPerView: 2 },
						992: { slidesPerView: 3 },
						1200: { slidesPerView: 3 },
						1400: { slidesPerView: 5 },
					}}
					className="th-slider has-shadow categorySlider"
				>
					{categories.map((category, index) => (
						<SwiperSlide key={index}>
							<div className="category-card single">
								<div className="box-img global-img">
									<img src={category.img} alt={category.title} />
								</div>
								<h3 className="box-title">
									<Link to="/destination">{category.title}</Link>
								</h3>
								<Link className="line-btn" to="/destination">
									See more
								</Link>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
				<div className="slider-pagination category-pagination"></div>
			</div>
		</section>
	);
};

export default CategorySection;

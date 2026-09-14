import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import apiService from '../../services/apiServices';

const PujaListSection = ({ puja }) => {
	const slugify = text =>
		text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '');

	return (
		<section
			className="tour-area position-relative bg-top-center overflow-hidden space"
			id="service-sec"
			style={{
				background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
				padding: '100px 0',
			}}
		>
			<div className="container">
				<div className="row">
					<div className="col-lg-8 offset-lg-2">
						{/* DIVINIQ REPHRASED TOP BAR */}
						<div className="title-area text-center mb-50">
							<span className="sub-title style1 text-theme">
								Sacred Rituals
							</span>
							<h2 className="sec-title text-gradient">
								Upcoming Pujas & Anushthan
							</h2>
							<p
								className="sec-text mt-3 mx-auto"
								style={{ maxWidth: '700px' }}
							>
								Experience the power of authentic Vedic ceremonies performed by
								master priests. Align your spiritual energy through sacred{' '}
								<strong>Sankalpa</strong> and ancient traditional rituals.
							</p>
						</div>
					</div>
				</div>

				<div className="slider-area tour-slider">
					<Swiper
						modules={[Autoplay]}
						autoplay={{ delay: 4000, disableOnInteraction: false }}
						spaceBetween={30}
						breakpoints={{
							0: { slidesPerView: 1 },
							576: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							992: { slidesPerView: 2 },
							1200: { slidesPerView: 3 },
							1300: { slidesPerView: 4 },
						}}
						className="th-slider has-shadow slider-drag-wrap"
					>
						{puja?.map((item, index) => (
							<SwiperSlide key={index}>
								<div
									className="tour-box elite-card-shadow transition-all"
									style={{ borderRadius: '24px', background: '#fff' }}
								>
									<div
										className="tour-box_img global-img"
										style={{
											height: '180px',
											overflow: 'hidden',
											borderRadius: '24px 24px 0 0',
										}}
									>
										<img
											src={item.pujaImage || 'assets/img/tour/tour_5_1.jpg'}
											alt={item.title || 'Divine Ritual'}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
											onError={e => {
												e.target.src = 'assets/img/tour/tour_5_1.jpg';
											}}
										/>
										{/* Status Tag */}
										<div className="position-absolute top-0 end-0 m-3">
											<span className="badge bg-theme text-dark px-3 py-2 rounded-pill small fw-bold shadow-sm">
												Live Ritual
											</span>
										</div>
									</div>

									<div className="tour-content p-4">
										<h3 className="box-title h5 mb-2 line-clamp-1">
											<Link
												to={`/puja/${slugify(item.title)}/${item._id}`}
												className="text-dark"
											>
												{item.title || 'Puja'}
											</Link>
										</h3>

										<p
											className="small text-muted mb-4 line-clamp-2"
											style={{ minHeight: '40px' }}
										>
											{item.purposeOfPooja ||
												'Spiritual upliftment and blessings.'}
										</p>

										<div className="tour-action border-top border-light pt-3 d-flex justify-content-between align-items-center">
											{item.pujaDatetime && (
												<div className="d-flex align-items-center gap-2 text-muted small">
													<i className="fa-light fa-calendar-day text-theme"></i>
													<span>
														{apiService.formatDate(item.pujaDatetime)}
													</span>
												</div>
											)}

											<Link
												to={`/puja/${slugify(item.title)}/${item._id}`}
												className="th-btn style3 py-2 px-3 rounded-inner small border-0 shadow-none"
											>
												Book Ritual
											</Link>
										</div>
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

export default PujaListSection;

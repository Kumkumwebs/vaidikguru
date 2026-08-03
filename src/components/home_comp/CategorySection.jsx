import '../../pages/home.css';

const SERVICES = [
	{ icon: '/assets/img/home/deep.png', title: 'Puja', desc: 'Book Sacred Pujas at Holy Temples' },
	{ icon: '/assets/img/home/gifthome.png', title: 'Chadhava', desc: 'Offer Holy Items with Devotion' },
	{ icon: '/assets/img/home/men.png', title: 'Consult Astrologer', desc: "Get Answers to Life's Important Questions" },
	{ icon: '/assets/img/home/video.png', title: 'Online Sankalp', desc: 'Take Sankalp for You & Your Family' },
	{ icon: '/assets/img/home/templehome.png', title: 'Temple Darshan', desc: 'Live Darshan from Sacred Temples' },
	{ icon: '/assets/img/home/roundicon.png', title: 'Astrology Tools', desc: 'Horoscope, Kundli & More Tools' },
	{ icon: '/assets/img/home/calender.png', title: 'Festival Booking', desc: 'Book for All Major Festivals' },
];

const CategorySection = () => {
	return (
		<section className="dq-section">
			<div className="dq-container">
				<div className="dq-eyebrow"><span className="line" />Our Vaidik Services<span className="line" /></div>
				<h2 className="dq-section-title">Our Vaidik Services</h2>

				<div className="dq-services-grid">
					{SERVICES.map((s) => (
						<div className="dq-service-card" key={s.title}>
							<div className="ic">
								<img src={s.icon} alt={s.title} />
							</div>
							<h4>{s.title}</h4>
							<p>{s.desc}</p>
						</div>
					))}
				</div>

				{/* <div className="dq-center-btn">
					<a href="/terms_of_use" className="dq-btn">View All Services</a>
				</div> */}
			</div>
		</section>
	);
};

export default CategorySection;
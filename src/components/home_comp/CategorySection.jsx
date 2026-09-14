import '../../pages/home.css';
import { Link } from 'react-router-dom';

const SERVICES = [
	{ icon: '/assets/img/home/deep.png', title: 'Puja', desc: 'Book Sacred Pujas at Holy Temples', route: '/puja' },
	{ icon: '/assets/img/home/gifthome.png', title: 'Chadhava', desc: 'Offer Holy Items with Devotion', route: '/chadhava' },
	{ icon: '/assets/img/home/men.png', title: 'Consult Astrologer', desc: "Get Answers to Life's Important Questions", route: '/astrologer' },
	// NOTE: no dedicated route exists yet for these three — pointed at
	// /puja as a placeholder. Swap in the real route once it exists.
	{ icon: '/assets/img/home/video.png', title: 'Online Sankalp', desc: 'Take Sankalp for You & Your Family', route: '/puja' },
	{ icon: '/assets/img/home/templehome.png', title: 'Temple Darshan', desc: 'Live Darshan from Sacred Temples', route: '/puja' },
	{ icon: '/assets/img/home/roundicon.png', title: 'Astrology Tools', desc: 'Horoscope, Kundli & More Tools', route: '/astrology_calculator_hub' },
	{ icon: '/assets/img/home/calender.png', title: 'Festival Booking', desc: 'Book for All Major Festivals', route: '/puja' },
];

const CategorySection = () => {
	return (
		<section className="dq-section">
			<div className="dq-container">
				<div className="dq-eyebrow"><span className="line" />Our Vaidik Services<span className="line" /></div>
				<h2 className="dq-section-title">Our Vaidik Services</h2>

				<div className="dq-services-grid">
					{SERVICES.map((s) => (
						<Link className="dq-service-card" key={s.title} to={s.route} style={{ textDecoration: 'none', color: 'inherit' }}>
							<div className="ic">
								<img src={s.icon} alt={s.title} />
							</div>
							<h4>{s.title}</h4>
							<p>{s.desc}</p>
						</Link>
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
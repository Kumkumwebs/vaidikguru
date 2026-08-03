import '../../pages/home.css';

const TRUST_ITEMS = [
	{ icon: '/assets/img/home/floverdesign.png', value: '50K+', label: 'Happy Devotees' },
	{ icon: '/assets/img/home/veriedpundit.png', value: '1000+', label: 'Verified Pandits' },
	{ icon: '/assets/img/home/time.png', value: '24/7', label: 'Customer Support' },
	{ icon: '/assets/img/home/penindia.png', value: 'Pan India', label: 'Delivery' },
	{ icon: '/assets/img/home/lockhome.png', value: '100%', label: 'Secure Payments' },
];
const HeroSection = ({ astrologer }) => {
	return (
		<>
			<section
				className="dq-hero"
				style={{ backgroundImage: `url(/assets/img/home/banner_home_page.webp)` }}
			>
				<div className="dq-hero-inner">
					<h1>
						Authentic Rituals.
						<span className="accent">Divine Blessings.</span>
						Peaceful Life.
					</h1>
					<p>
						Book sacred pujas, offer chadhava and get guidance from
						verified astrologers – all from the comfort of your home.
					</p>
					<div className="dq-hero-actions">
						<a href="/puja" className="dq-btn dq-btn-outline hide-mobile">
							Book Puja
						</a>

						<a href="/astrologer" className="dq-btn dq-btn-outline hide-mobile">
							Consult Astrologer
						</a>
					</div>
				</div>
			</section>

			<div className="dq-trust-strip">
				{TRUST_ITEMS.map((item) => (
					<div className="dq-trust-item" key={item.label}>
						<span className="icon"><img src={item.icon} alt={item.label} /></span>						<div>
							<strong>{item.value}</strong>
							<span>{item.label}</span>
						</div>
					</div>
				))}
			</div>
		</>
	);
};

export default HeroSection;

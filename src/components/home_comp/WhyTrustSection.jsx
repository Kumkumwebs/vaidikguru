import '../../pages/home.css';

const FEATURES = [
	{
		title: 'Verified & Experienced Pandits',
		desc: 'Only qualified and experienced pandits for authentic rituals.',
	},
	{
		title: 'Secure & Easy Payments',
		desc: 'Multiple payment options with 100% secure transactions.',
	},
	{
		title: 'Live Video Puja',
		desc: 'Watch your puja live from the temple in real-time.',
	},
	{
		title: 'Pan India Delivery',
		desc: 'Chadhava and prasad delivered across India.',
	},
	{
		title: 'Personalized Rituals',
		desc: 'Tailored pujas and sankalps as per your needs.',
	},
	{
		title: '24x7 Customer Support',
		desc: 'We are here to help you anytime, anywhere.',
	},
];

const WhyTrustSection = () => {
	return (
		<section className="dq-section dq-section-cream">
			<div className="dq-container">
				<div className="dq-why-trust">
					<div
						className="dq-video-thumb"
						style={{ backgroundImage: `url(/assets/img/home/video_image.webp)` }}
					>
						<button className="dq-play-btn" aria-label="Play video">▶</button>
					</div>

					<div className="dq-why-content">
						<h2>Why Millions VadikGuru</h2>
						<div className="dq-why-list">
							{FEATURES.map((f) => (
								<div className="dq-why-item" key={f.title}>
									<span className="chk">✓</span>
									<div>
										<strong>{f.title}</strong>
										<p>{f.desc}</p>
									</div>
								</div>
							))}
						</div>
						<a href="/about_us" className="dq-btn">Know More About Us</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhyTrustSection;

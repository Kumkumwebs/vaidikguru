import { useState, useEffect } from 'react';
import '../../pages/home.css';

const TRUST_ITEMS = [
	{ icon: '/assets/img/home/floverdesign.png', value: '50K+', label: 'Happy Devotees' },
	{ icon: '/assets/img/home/veriedpundit.png', value: '1000+', label: 'Verified Pandits' },
	{ icon: '/assets/img/home/time.png', value: '24/7', label: 'Customer Support' },
	{ icon: '/assets/img/home/penindia.png', value: 'Pan India', label: 'Delivery' },
	{ icon: '/assets/img/home/lockhome.png', value: '100%', label: 'Secure Payments' },
];

const fixImgHost = (url) =>
	typeof url === 'string' ? url.replace('admin.astrogurujii.com', 'admin.vaidikguru.com') : url;

const HeroSection = ({ astrologer, banners }) => {
	const [activeBannerIdx, setActiveBannerIdx] = useState(0);
	const validBanners = Array.isArray(banners) ? banners.filter(b => b && (b.image || b.img)) : [];

	useEffect(() => {
		if (validBanners.length <= 1) return;
		const timer = setInterval(() => {
			setActiveBannerIdx(prev => (prev + 1) % validBanners.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [validBanners.length]);

	const currentBannerImg = validBanners.length > 0 ? fixImgHost(validBanners[activeBannerIdx]?.image || validBanners[activeBannerIdx]?.img) : '/assets/img/home/banner_home_page.webp';

	return (
		<>
			<section
				className="dq-hero"
				style={{ backgroundImage: `url(${currentBannerImg})`, transition: 'background-image 0.5s ease-in-out' }}
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

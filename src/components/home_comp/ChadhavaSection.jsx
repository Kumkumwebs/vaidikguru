import { useState, useEffect } from 'react';
import ChadhavaService from '../../services/chadhavaServices';
import '../../pages/home.css';

// Inline SVG Om placeholder — no network request, so it can't fail/loop.
const PLACEHOLDER =
	"data:image/svg+xml;charset=UTF-8," +
	encodeURIComponent(`
		<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
			<rect width="400" height="300" fill="#f5ede0"/>
			<text x="50%" y="52%" font-size="130" text-anchor="middle" dominant-baseline="middle" fill="#c9962f" font-family="serif">ॐ</text>
		</svg>
	`);

const handleImgError = (e) => {
	const img = e.currentTarget;
	if (img.dataset.fallback === 'done') return;
	img.dataset.fallback = 'done';
	img.src = PLACEHOLDER;
};

// API still returns some image URLs hosted on the old domain — rewrite to the current one.
const fixImgHost = (url) =>
	typeof url === 'string' ? url.replace('admin.astrogurujii.com', 'admin.vaidikguru.com') : url;

const ChadhavaSection = ({ chadhava }) => {
	const [apiChadhava, setApiChadhava] = useState([]);

	useEffect(() => {
		if (chadhava && chadhava.length > 0) return;
		const fetchChadhava = async () => {
			try {
				const res = await ChadhavaService.getChadhavaList();
				let list = [];
				if (res?.status) {
					list = res.results || res.data || res.chadhava || [];
				}
				if (Array.isArray(list) && list.length > 0) {
					setApiChadhava(list);
				}
			} catch (err) {
				console.error("ChadhavaSection fetch error:", err);
			}
		};
		fetchChadhava();
	}, [chadhava]);

	const rawItems = (chadhava && chadhava.length > 0)
		? chadhava
		: (apiChadhava.length > 0 ? apiChadhava : null);

	if (!rawItems || rawItems.length === 0) {
		return null;
	}

	// Helper: does this record actually have a real image, or would it
	// fall back to the placeholder? Checked across every possible field.
	const hasRealImage = (c) =>
		Boolean(
			c.chadhavaImage ||
			c.bannerImages?.[0] ||
			c.galleryImages?.[0] ||
			c.gallery?.[0] ||
			c.images?.[0]
		);

	// Items with a real image show first; items without one (which would
	// otherwise render the placeholder) sink to the bottom. Within each
	// group, most recently added Chadhava comes first.
	const sortedItems = [...rawItems].sort((a, b) => {
		const aHasImg = hasRealImage(a);
		const bHasImg = hasRealImage(b);
		if (aHasImg !== bHasImg) return aHasImg ? -1 : 1;

		const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
		const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
		if (dateB !== dateA) return dateB - dateA;
		return (b._id || '').localeCompare(a._id || '');
	});

	const items = sortedItems.map((c) => ({
		id: c._id || c.id,
		name: c.title || c.name || 'Sacred Chadhava',
		temple: c.templeName || c.temple || '',
		image:
			fixImgHost(
				c.chadhavaImage ||
				c.bannerImages?.[0] ||
				c.galleryImages?.[0] ||
				c.gallery?.[0] ||
				c.images?.[0]
			) || PLACEHOLDER,
		price: c.price,
	}));

	return (
		<section className="dq-section dq-section-cream">
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>Sacred Chadhava Delivered with Devotion</h2>
					<a href="/chadhava">Explore Chadhava</a>
				</div>

				<div className="row">
					{items.map((item) => (
						<div key={item.id} className="col-lg-4 col-md-6 col-12">
							<div className="dq-puja-link overflow-hidden border rounded shadow-sm mb-4">
								<a
									href={`/chadhava/${item.id}`}
									key={item.id || item.name}
								>
									<img
										src={item.image}
										alt={item.name}
										loading="lazy"
										onError={handleImgError}
									/>
									<div className="dq-puja-body">
										<h4>{item.name}</h4>
										{item.temple && <div className="dq-puja-sub">🛕 {item.temple}</div>}
										<div className="dq-puja-footer">
											<span className="dq-puja-price">
												{item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : 'Free Seva'}
											</span>
											<span className="dq-btn dq-btn-sm">Book Now</span>
										</div>
									</div>
								</a>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ChadhavaSection;
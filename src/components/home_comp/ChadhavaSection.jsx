import '../../pages/home.css';

const FALLBACK_ITEMS = [
	{ id: 1, name: 'Mahakal Chadhava', temple: '', image: '', price: 751 },
	{ id: 2, name: 'Kashi Vishwanath Chadhava', temple: '', image: '', price: 651 },
	{ id: 3, name: 'Ayodhya Ram Mandir Chadhava', temple: '', image: '', price: 551 },
	{ id: 4, name: 'Khatu Shyam Chadhava', temple: '', image: '', price: 499 },
	{ id: 5, name: 'Vaishno Devi Chadhava', temple: '', image: '', price: 651 },
	{ id: 6, name: 'Tirupati Balaji Chadhava', temple: '', image: '', price: 601 },
];

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
	const rawItems = chadhava?.length ? chadhava : null;

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
	const sortedItems = rawItems
		? [...rawItems].sort((a, b) => {
			const aHasImg = hasRealImage(a);
			const bHasImg = hasRealImage(b);
			if (aHasImg !== bHasImg) return aHasImg ? -1 : 1;

			const dateA = new Date(a.createdAt || a.updatedAt || 0).getTime();
			const dateB = new Date(b.createdAt || b.updatedAt || 0).getTime();
			if (dateB !== dateA) return dateB - dateA;
			return (b._id || '').localeCompare(a._id || '');
		})
		: null;

	const items = sortedItems
		? sortedItems.map((c) => ({
			id: c._id,
			name: c.title,
			temple: c.templeName,
			// Same fallback chain as the Chadhava detail page: some
			// records only have chadhavaImage populated, others only
			// have bannerImages (or galleryImages/gallery/images).
			// Check every possible field before falling back to the
			// placeholder, so the listing image matches what the
			// detail page shows for the same record.
			image:
				fixImgHost(
					c.chadhavaImage ||
					c.bannerImages?.[0] ||
					c.galleryImages?.[0] ||
					c.gallery?.[0] ||
					c.images?.[0]
				) || PLACEHOLDER,
			price: c.price,
		}))
		: FALLBACK_ITEMS.map((c) => ({ ...c, image: c.image || PLACEHOLDER }));

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
import '../../pages/home.css';

const FALLBACK_PUJAS = [
	{ id: 1, name: 'Maha Rudrabhishek', image: '', mandir: 'At Temple', purpose: 'For peace and prosperity', date: '' },
	{ id: 2, name: 'Satyanarayan Puja', image: '', mandir: 'At Temple', purpose: 'For wellbeing', date: '' },
	{ id: 3, name: 'Navagraha Shanti', image: '', mandir: 'At Temple', purpose: 'Planetary balance', date: '' },
];

// Inline SVG placeholder with an Om symbol — never triggers a network request, so it can't fail/loop.
const PLACEHOLDER =
	"data:image/svg+xml;charset=UTF-8," +
	encodeURIComponent(`
		<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" viewBox="0 0 400 260">
			<rect width="400" height="260" fill="#f5ede0"/>
			<text x="50%" y="52%" font-size="120" text-anchor="middle" dominant-baseline="middle" fill="#c9962f" font-family="serif">ॐ</text>
		</svg>
	`);

const formatDate = (iso) => {
	if (!iso) return '';
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const handleImgError = (e) => {
	const img = e.currentTarget;
	if (img.dataset.fallback === 'done') return; // already swapped once — stop the loop
	img.dataset.fallback = 'done';
	img.src = PLACEHOLDER;
};

const PujaListSection = ({ puja }) => {
	const rawItems = puja?.result?.length ? puja.result : null;

	const items = rawItems
		? rawItems.map((p) => ({
				id: p._id,
				name: p.title,
				image: p.pujaImage || PLACEHOLDER,
				mandir: p.mandirName,
				purpose: p.purposeOfPooja,
				date: formatDate(p.pujaDatetime),
		  }))
		: FALLBACK_PUJAS.map((p) => ({ ...p, image: p.image || PLACEHOLDER }));

	return (
		<section className="dq-section">
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>Most Booked Pujas</h2>
					<a href="/puja">View All Pujas</a>
				</div>

				<div className="dq-cards-row dq-cards-scroll">
					{items.map((item) => (
						<a 			href={`/puja/${item.name}/${item.id}`}
 className="dq-puja-card" key={item.id || item.name}>
							<img
								src={item.image}
								alt={item.name}
								loading="lazy"
								onError={handleImgError}
								style={{ width: "100%", height: 130, minHeight: 130, maxHeight: 130, objectFit: "cover", objectPosition: "center", display: "block" }}
							/>
							<div className="dq-puja-body">
								<h4>{item.name}</h4>
								{item.date && <div className="dq-puja-meta">📅 {item.date}</div>}
								<div className="dq-puja-sub">{item.mandir}</div>
								{/* {item.purpose && <p className="dq-puja-purpose">{item.purpose}</p>} */}
								<div className="dq-puja-footer">
									<a href={`/puja/${item.name}/${item.id}`} className="dq-btn dq-btn-sm">Book Now</a>
								</div>
							</div>
						</a>
					))}
				</div>

				</div>
		</section>
	);
};

export default PujaListSection;
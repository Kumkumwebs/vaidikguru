import { useState, useEffect } from 'react';
import PujaService from '../../services/pujaServices';
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

const fixImgHost = (url) => {
	if (!url) return PLACEHOLDER;
	let clean = typeof url === 'string' ? url.replace('admin.astrogurujii.com', 'admin.vaidikguru.com') : url;
	if (typeof clean === 'string' && clean.startsWith('/')) {
		clean = `https://admin.vaidikguru.com${clean}`;
	}
	return clean;
};

const handleImgError = (e) => {
	const img = e.currentTarget;
	if (img.dataset.fallback === 'done') return; // already swapped once — stop the loop
	img.dataset.fallback = 'done';
	img.src = PLACEHOLDER;
};

const PujaListSection = ({ puja }) => {
	const [apiPujas, setApiPujas] = useState([]);

	useEffect(() => {
		const fetchRealPujas = async () => {
			try {
				const res = await PujaService.getPujaList();
				let list = [];
				if (res?.status) {
					if (Array.isArray(res.promotionalBanner) && res.promotionalBanner.length > 0) {
						list = res.promotionalBanner;
					} else if (Array.isArray(res.results) && res.results.length > 0) {
						list = res.results;
					} else if (Array.isArray(res.result) && res.result.length > 0) {
						list = res.result;
					} else if (Array.isArray(res.product) && res.product.length > 0) {
						list = res.product;
					} else if (Array.isArray(res.data) && res.data.length > 0) {
						list = res.data;
					}
				}
				if (list.length > 0) {
					setApiPujas(list);
				}
			} catch (err) {
				console.error("PujaListSection fetch error:", err);
			}
		};
		fetchRealPujas();
	}, []);

	const rawItems = (puja?.result && puja.result.length > 0)
		? puja.result
		: (apiPujas.length > 0 ? apiPujas : null);

	const items = rawItems
		? rawItems.slice(0, 6).map((p) => ({
			id: p._id || p.id,
			name: p.title || p.name || 'Sacred Pooja',
			image: fixImgHost(p.pujaImage || p.image || p.img),
			mandir: p.mandirName || p.mandir || 'At Temple',
			purpose: p.purposeOfPooja || p.purpose,
			date: formatDate(p.pujaDatetime || p.date),
		}))
		: FALLBACK_PUJAS.map((p) => ({ ...p, image: p.image || PLACEHOLDER }));

	return (
		<section className="dq-section">
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>Most Booked Pujas</h2>
					<a href="/puja">View All Pujas</a>
				</div>

				<div className="row">
					{items.map((item) => (
						<div key={item.id || item.name} className="col-lg-4 col-md-6 col-12">
							<div className="dq-puja-link overflow-hidden border rounded shadow-sm mb-4">
								<a href={`/puja/${encodeURIComponent(item.name)}/${item.id}`}
								 key={item.id || item.name}>
								<img
									src={item.image}
									alt={item.name}
									loading="lazy"
									onError={handleImgError}
								/>
								<div className="dq-puja-body">
									<h4>{item.name}</h4>
									{item.date && <div className="dq-puja-meta">📅 {item.date}</div>}
									<div className="dq-puja-sub">{item.mandir}</div>
									<div className="dq-puja-footer">
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

export default PujaListSection;
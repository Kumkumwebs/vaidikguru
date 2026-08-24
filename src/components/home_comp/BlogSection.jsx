import '../../pages/home.css';

const FALLBACK_BLOGS = [
	{ id: 1, title: 'Significance of Maha Shivratri and How to Celebrate', image: '/assets/img/home/blog_1.jpg', tag: 'Puja Guide', date: 'May 12, 2025' },
	{ id: 2, title: 'Benefits of Navagraha Shanti Puja in Your Life', image: '/assets/img/home/blog_2.jpg', tag: 'Astrology', date: 'May 10, 2025' },
	{ id: 3, title: 'How Astrology Can Guide You Towards a Better Future', image: '/assets/img/home/blog_3.jpg', tag: 'Lifestyle', date: 'May 8, 2025' },
];

const STATS = [
	{ icon: '/assets/img/home/men.png', value: '50K+', label: 'Happy Devotees' },
	{ icon: '/assets/img/home/deep.png', value: '1000+', label: 'Verified Pandits' },
	{ icon: '/assets/img/home/deep.png', value: '500+', label: 'Sacred Temples' },
	{ icon: '/assets/img/home/gifthome.png', value: '1L+', label: 'Pujas Performed' },
];

// API still returns some image URLs hosted on legacy domains — rewrite to the current active backend.
const fixImgHost = (url) => {
	if (!url || typeof url !== 'string') return '';
	let clean = url
		.replace('admin.astrogurujii.com', 'admin.vaidikguru.com')
		.replace('admin.astropush.com', 'admin.vaidikguru.com');
	if (clean.startsWith('/')) {
		clean = `https://admin.vaidikguru.com${clean}`;
	}
	return clean;
};

const handleImgError = (e) => {
	const img = e.currentTarget;
	if (img.dataset.fallback === 'done') return;
	img.dataset.fallback = 'done';
	img.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80';
};

const BlogSection = ({ blog }) => {
	const items = blog && blog.length ? blog : FALLBACK_BLOGS;

	return (
		<section className="dq-section dq-section-cream">
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>From Our Blog</h2>
					<a href="/blog">View All Blogs</a>
				</div>

				<div className="dq-blog-wrap">
					<div className="dq-blog-grid">
						{items.slice(0, 6).map((item) => (
							<div
								className="dq-blog-card"
								key={item.id || item._id || item.title}
								onClick={() => (window.location.href = `/blog/${item._id || item.id}`)}
								style={{ cursor: 'pointer' }}
							> 
								<img
									src={fixImgHost(item.img || item.image || item.file)}
									alt={item.title}
									onError={handleImgError}
								/>
								<div className="dq-blog-body">
									<span className="dq-blog-tag">{item.tag}</span>
									<h4>{item.title}</h4>
									<span className="dq-blog-date">{item.date}</span>
								</div>
							</div>
						))}
					</div>

					<div className="dq-stats-panel">
						{STATS.map((s) => (
							<div className="stat" key={s.label}>
								<div className="ic"><img src={s.icon} alt={s.label} /></div>
								<strong>{s.value}</strong>
								<span>{s.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default BlogSection;
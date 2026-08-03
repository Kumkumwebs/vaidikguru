import '../../pages/home.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
// import AstrologerCard from './AstrologerCard';

const FALLBACK_ASTROLOGERS = [
	{ id: 1, name: 'Acharya Alok', profile_img: '/assets/img/home/astrologer_1.jpg', experience: 15, category: [{ name: 'Vedic Astrology' }], avg_rate: 4.9, total_review: 1200, per_min_chat: 15, is_online: 1 },
	{ id: 2, name: 'Dr. Neeraj Sharma', profile_img: '/assets/img/home/astrologer_2.jpg', experience: 20, category: [{ name: 'Vedic' }, { name: 'KP' }, { name: 'Nadi' }], avg_rate: 4.9, total_review: 980, per_min_chat: 20, is_online: 1 },
	{ id: 3, name: 'Acharya Ruchi', profile_img: '/assets/img/home/astrologer_3.jpg', experience: 10, category: [{ name: 'Vedic Astrology' }], avg_rate: 4.8, total_review: 850, per_min_chat: 12, is_busy: 1 },
	{ id: 4, name: 'Pandit Om Prakash', profile_img: '/assets/img/home/astrologer_4.jpg', experience: 25, category: [{ name: 'Vedic' }, { name: 'Lal Kitab' }], avg_rate: 4.9, total_review: 1100, per_min_chat: 18, is_online: 1 },
];

const TeamSection = ({ astrologer }) => {
	const items = astrologer && astrologer.length ? astrologer : FALLBACK_ASTROLOGERS;

	const handleAction = (astro, type) => {
		if (type === 'chat') {
			window.location.href = `/astrologer/${astro.id || astro._id}?action=chat`;
		} else if (type === 'call') {
			window.location.href = `/astrologer/${astro.id || astro._id}?action=call`;
		} else {
			window.location.href = `/astrologer/${astro.id || astro._id}`;
		}
	};

	return (
		<section className="dq-section">
			<div className="dq-container">
				<div className="dq-section-head-row">
					<h2>Top Astrologers</h2>
					<a href="/astrologer">View All Astrologers</a>
				</div>

				<div className="dq-astro-grid">
					{items.map((item) => (
						<AstrologerCard astro={item} onChat={handleAction} key={item.id || item._id} />
					))}
				</div>
			</div>
		</section>
	);
};




const COLORS = ['#7a1a3d', '#8a4b1f', '#1f6f5c', '#4b3f8a', '#a3441f', '#2f6b8a'];

const avColor = (name = '') => {
	let hash = 0;
	for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
	return COLORS[Math.abs(hash) % COLORS.length];
};

const initials = (name = '') =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase())
		.join('');

const AstrologerCard = ({ astro, onChat }) => {
	const [liked, setLiked] = useState(false);
	const [imgErr, setImgErr] = useState(false);
	const cats = astro.category?.slice(0, 3).map((c) => c.name) || ['Vedic'];
	const online = astro.is_online == 1;
	const busy = astro.is_busy == 1;
	const dotCls = online ? 'dn' : busy ? 'db' : 'do';

	return (
		<motion.div
			className="al-card"
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.28 }}
			style={{ cursor: 'pointer' }}
			onClick={() => onChat(astro, 'view')}
		>
			<span className="al-exp">{astro.experience || '5'}+ Yrs Exp</span>
			<button
				className={`al-heart${liked ? ' on' : ''}`}
				onClick={(e) => {
					e.stopPropagation();
					setLiked(!liked);
				}}
			>
				<i className={liked ? 'fas fa-heart' : 'far fa-heart'} />
			</button>

			<div className="al-av-wrap">
				<div className="al-av-clip">
					{astro.profile_img && !imgErr ? (
						<img src={astro.profile_img} alt={astro.name} onError={() => setImgErr(true)} />
					) : (
						<div
							className="al-av-init"
							style={{ background: `linear-gradient(135deg,${avColor(astro.name)},${avColor(astro.name)}bb)` }}
						>
							{initials(astro.name)}
						</div>
					)}
				</div>
				<span className={`al-dot ${dotCls}`} />
			</div>

			<div className="al-cname">{astro.name}</div>
			<div className="al-crole">Vedic Astrologer</div>
			<div className="al-tags">
				{cats.map((c, i) => (
					<span key={i} className="al-tag">{c}</span>
				))}
			</div>
			<div className="al-stats">
				<div className="al-rat">
					<i className="fas fa-star" />
					<span>{parseFloat(astro.avg_rate || 4.8).toFixed(1)}</span>
					<span className="al-rev">({astro.total_review || 80})</span>
				</div>
				<div className="al-price">₹{astro.per_min_chat || '5'}/min</div>
			</div>
			<div className="al-actions">
				<button className="al-chat" onClick={(e) => { e.stopPropagation(); onChat(astro, 'chat'); }}>
					Chat Now
				</button>
				<button className="al-call" onClick={(e) => { e.stopPropagation(); onChat(astro, 'call'); }} title="Call">
					<i className="fas fa-phone" />
				</button>
			</div>
		</motion.div>
	);
};


export default TeamSection;
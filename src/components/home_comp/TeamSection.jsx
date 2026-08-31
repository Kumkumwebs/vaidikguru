import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../services/apiServices';
import { getAstroPrice, getAstroRating, getAstroReviewCount } from '../../services/astroHelpers';

const TeamSection = ({ astrologer }) => {
	const [list, setList] = useState(() => (Array.isArray(astrologer) && astrologer.length ? astrologer : []));

	useEffect(() => {
		if (Array.isArray(astrologer) && astrologer.length > 0) {
			setList(astrologer);
			return;
		}
		let active = true;
		const loadAstrologers = async () => {
			try {
				const payload = { page: "1" };
				const res = await apiService.postBearer('/user_api/astrologer_list', payload);
				const data = Array.isArray(res?.results) ? res.results : Array.isArray(res?.record) ? res.record : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : null;
				if (active) {
					if (data && data.length > 0) {
						setList(data.slice(0, 6));
					} else {
						setList([]);
					}
				}
			} catch (_) {
				if (active) setList([]);
			}
		};
		loadAstrologers();
		return () => { active = false; };
	}, [astrologer]);

	const items = list && list.length ? list : [];
	if (!items || items.length === 0) return null;

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

// API still returns some image URLs hosted on the old domain — rewrite to the current one.
const fixImgHost = (url) =>
	typeof url === 'string' ? url.replace('admin.astrogurujii.com', 'admin.vaidikguru.com') : url;

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
	const [notified, setNotified] = useState(false);
	const cats = astro.category?.slice(0, 3).map((c) => c.name || c) || ['Vedic'];
	const busy = astro.is_busy == 1 || astro.is_busy === '1' || astro.is_busy === true;
	const isExplicitOffline = astro.is_online === 0 || astro.is_online === '0' || astro.is_offline == 1 || astro.is_offline === '1';
	const online = !busy && !isExplicitOffline;
	const dotCls = busy ? 'db' : online ? 'dn' : 'do';

	const handleNotifyClick = (e) => {
		e.stopPropagation();
		setNotified(!notified);
		console.log('[NotifyWhenAvailable] Toggled for TeamSection astro:', astro.name);
	};

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
						<img src={fixImgHost(astro.profile_img)} alt={astro.name} onError={() => setImgErr(true)} />
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
					<span>{getAstroRating(astro) ? parseFloat(getAstroRating(astro)).toFixed(1) : '4.8'}</span>
					<span className="al-rev">({getAstroReviewCount(astro) ?? 80})</span>
				</div>
				{getAstroPrice(astro) ? (
					<div className="al-price">₹{getAstroPrice(astro)}/min</div>
				) : null}
			</div>
			<div className="al-actions">
				{busy ? (
					<button className={`al-notify-btn${notified ? ' active' : ''}`} onClick={handleNotifyClick}>
						<i className={notified ? "fas fa-check-circle" : "fas fa-bell"} />
						<span>{notified ? 'Notified' : 'Notify Me'}</span>
					</button>
				) : (
					<>
						<button className="al-chat" onClick={(e) => { e.stopPropagation(); onChat(astro, 'chat'); }}>
							Chat Now
						</button>
						<button className="al-call" onClick={(e) => { e.stopPropagation(); onChat(astro, 'call'); }} title="Call">
							<i className="fas fa-phone" />
						</button>
					</>
				)}
			</div>
		</motion.div>
	);
};


export default TeamSection;
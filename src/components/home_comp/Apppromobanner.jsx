import React, { useState, useEffect, useRef } from 'react';

/**
 * AppPromoBanner
 * ------------------------------------------------------------------
 * Ornate maroon/gold promo banner (mandala background, glowing
 * praying-hands icon, two-tone headline, ornamental divider, and a
 * beveled gold "Download App" pill with a down-arrow icon) — sized
 * back to the original compact top-strip height/width.
 *
 * Assets (already in your repo under /public/assets/img/homeapp/):
 *   - bannerhome.png                    → full background artwork (mandala + gradient)
 *   - handhome.png                      → glowing praying-hands icon (left side)
 *   - arrowhand-removebg-preview.png    → down-arrow icon (inside the button)
 *
 * Behaviour:
 *  - Mobile-only (<= 767px). Desktop renders nothing (display: none).
 *  - Sits in normal flow at the top of the page, above <Header />.
 *  - Collapses (max-height + fade) when the user scrolls down.
 *  - Reappears when the user scrolls up or is near the top.
 *
 * Usage — in Home.jsx:
 *   import AppPromoBanner from '../components/home_comp/AppPromoBanner';
 *   ...
 *   <AppPromoBanner />
 *   <Header ... />
 */

const APP_LINK = 'https://play.google.com/store/apps/details?id=com.vaidikguru.app';

const ASSETS = {
	background: '/assets/img/homeapp/bannerhome.png',
	hand: '/assets/img/homeapp/handhome.png',
	arrow: '/assets/img/homeapp/arrowhand-removebg-preview.png',
};

const AppPromoBanner = () => {
	const [hidden, setHidden] = useState(false);
	const lastScrollY = useRef(0);
	const ticking = useRef(false);

	useEffect(() => {
		lastScrollY.current = window.scrollY;

		const handleScroll = () => {
			if (ticking.current) return;
			ticking.current = true;

			requestAnimationFrame(() => {
				const currentY = window.scrollY;
				const delta = currentY - lastScrollY.current;

				if (currentY < 30) {
					setHidden(false);
				} else if (delta > 4) {
					setHidden(true);
				} else if (delta < -4) {
					setHidden(false);
				}

				lastScrollY.current = currentY;
				ticking.current = false;
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const handleDownload = () => {
		window.open(APP_LINK, '_blank', 'noopener,noreferrer');
	};

	return (
		<>
			<style>{`
				.dqp-banner {
					display: none;
				}

				@media (max-width: 767px) {
					.dqp-banner {
						display: flex;
						align-items: center;
						justify-content: space-between;
						gap: 10px;
						padding: 14px 16px;
						position: relative;
						overflow: hidden;
						max-height: 90px;
						opacity: 1;
						transition: max-height 0.35s ease, opacity 0.28s ease,
							padding-top 0.35s ease, padding-bottom 0.35s ease;
						background-color: #3a0a1c;
						background-image: url('${ASSETS.background}');
						background-size: cover;
						background-position: center;
					}

					.dqp-banner.dqp-hidden {
						max-height: 0;
						opacity: 0;
						padding-top: 0;
						padding-bottom: 0;
						pointer-events: none;
					}

					.dqp-left {
						display: flex;
						align-items: center;
						gap: 8px;
						min-width: 0;
					}

					.dqp-hand {
						width: 26px;
						height: 26px;
						object-fit: contain;
						flex-shrink: 0;
						filter: drop-shadow(0 0 5px rgba(245, 166, 35, 0.45));
					}

					.dqp-textblock {
						min-width: 0;
					}

					.dqp-headline {
						margin: 0;
						font-weight: 700;
						line-height: 1.25;
						font-size: 11.5px;
					}

					.dqp-headline .dqp-white {
						color: #f6e9dd;
					}

					.dqp-headline .dqp-gold {
						color: #f6c351;
						display: block;
					}

					.dqp-divider {
						display: none;
					}

					.dqp-btn {
						position: relative;
						flex-shrink: 0;
						display: inline-flex;
						align-items: center;
						gap: 4px;
						padding: 6px 10px;
						border-radius: 999px;
						border: none;
						background: linear-gradient(180deg, #ffce5c 0%, #f5a623 45%, #e08a12 100%);
						color: #3a1400;
						font-size: 10.5px;
						font-weight: 800;
						white-space: nowrap;
						box-shadow:
							0 4px 10px rgba(58, 8, 20, 0.4),
							inset 0 1px 0 rgba(255, 255, 255, 0.5),
							inset 0 -2px 3px rgba(120, 60, 0, 0.25);
						cursor: pointer;
						transition: transform 0.15s ease;
					}

					.dqp-btn:active {
						transform: scale(0.95);
					}

					.dqp-arrow-icon {
						width: 11px;
						height: 11px;
						object-fit: contain;
						flex-shrink: 0;
					}
				}

				@media (max-width: 360px) {
					.dqp-btn span {
						display: none;
					}
					.dqp-btn {
						padding: 8px 9px;
					}
					.dqp-arrow-icon {
						width: 13px;
						height: 13px;
					}
				}
			`}</style>

			<div className={`dqp-banner ${hidden ? 'dqp-hidden' : ''}`}>
				<div className="dqp-left">
					<img
						src={ASSETS.hand}
						alt=""
						className="dqp-hand"
						onError={(e) => { e.currentTarget.style.display = 'none'; }}
					/>
					<div className="dqp-textblock">
						<p className="dqp-headline">
							<span className="dqp-white">Your puja, your sankalp — now</span>
							<span className="dqp-gold">with more sacred experience</span>
						</p>
					</div>
				</div>

				<button type="button" className="dqp-btn" onClick={handleDownload}>
					<img src={ASSETS.arrow} alt="" className="dqp-arrow-icon" />
					<span>Download App</span>
				</button>
			</div>
		</>
	);
};

export default AppPromoBanner;
import { useState, useEffect } from 'react';

const ScrollTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = (scrollTop / docHeight) * 100;

			setScrollProgress(progress);
			setIsVisible(scrollTop > 300);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const circumference = 307.919;
	const offset = circumference - (scrollProgress / 100) * circumference;

	return (
		<>
			<style>{`
				/* shift the scroll-to-top button up on mobile so it
				   doesn't overlap the fixed bottom nav bar */
				@media (max-width: 991px) {
					.scroll-top {
						bottom: 110px !important;
					}
				}
				@media (max-width: 480px) {
					.scroll-top {
						bottom: 100px !important;
						right: 14px !important;
					}
				}
				.scroll-top {
					width: 50px !important;
					height: 50px !important;
					border-radius: 50% !important;
					background: #ffffff !important;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
					position: fixed !important;
					display: flex !important;
					align-items: center !important;
					justify-content: center !important;
				}
				.scroll-top:after,
				.scroll-top::after {
					content: "" !important;
					display: none !important;
				}
				.scroll-top .progress-circle {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					z-index: 1;
					border-radius: 50%;
					background: #ffffff;
				}
				.scroll-top .progress-circle path {
					stroke: var(--theme-color, #F6B029) !important;
					stroke-width: 14px !important;
				}
				.scroll-top-inner-arrow {
					position: absolute;
					z-index: 2;
					display: flex;
					align-items: center;
					justify-content: center;
					color: var(--theme-color, #F6B029);
					pointer-events: none;
				}
			`}</style>

			<div
				className={`scroll-top ${isVisible ? 'show' : ''}`}
				onClick={scrollToTop}
				style={{ cursor: 'pointer' }}
			>
				<svg
					className="progress-circle svg-content"
					width="100%"
					height="100%"
					viewBox="-1 -1 102 102"
				>
					<path
						d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
						style={{
							transition: 'stroke-dashoffset 10ms linear 0s',
							strokeDasharray: `${circumference}, ${circumference}`,
							strokeDashoffset: offset,
						}}
					/>
				</svg>
				<div className="scroll-top-inner-arrow">
					<svg
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="12" y1="19" x2="12" y2="5" />
						<polyline points="5 12 12 5 19 12" />
					</svg>
				</div>
			</div>
		</>
	);
};

export default ScrollTop;
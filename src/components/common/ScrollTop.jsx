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
			</div>
		</>
	);
};

export default ScrollTop;
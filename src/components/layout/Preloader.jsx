import { useState, useEffect } from 'react';

// Preloader - matching original HTML (lines 85-106)
const Preloader = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	const handleCancel = () => {
		setLoading(false);
	};

	if (!loading) return null;

	return (
		<div id="preloader" className="preloader">
			<button className="th-btn preloaderCls" onClick={handleCancel}>
				Cancel Preloader
			</button>
			<div className="preloader-inner">
				<img src="/assets/img/logo3.svg" alt="" />
			</div>
			<div id="loader" className="th-preloader">
				<div className="animation-preloader">
					<div className="txt-loading">
						<span preloader-text="T" className="characters">
							T{' '}
						</span>
						<span preloader-text="O" className="characters">
							O{' '}
						</span>
						<span preloader-text="U" className="characters">
							U{' '}
						</span>
						<span preloader-text="R" className="characters">
							R{' '}
						</span>
						<span preloader-text="M" className="characters">
							M{' '}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Preloader;

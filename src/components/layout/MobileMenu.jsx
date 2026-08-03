import { Link, useLocation } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
	const location = useLocation();

	const isActive = (path) =>
		path === '/'
			? location.pathname === '/'
			: location.pathname.startsWith(path);

	return (
		<div
			className={`th-menu-wrapper onepage-nav ${
				isOpen ? 'th-body-visible' : ''
			}`}
			style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
		>
			<div className="th-menu-area text-center">
				<button className="th-menu-toggle" onClick={onClose}>
					<i className="fal fa-times"></i>
				</button>
				<div className="mobile-logo">
					<Link to="/" onClick={onClose}>
						<img src="/assets/img/logo123.svg" alt="DivinIQ" />
					</Link>
				</div>
				<div className="th-mobile-menu">
					<ul>
						<li>
							<Link
								className={isActive('/') ? 'active' : ''}
								to="/"
								onClick={onClose}
							>
								Home
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/about_us') ? 'active' : ''}
								to="/about_us"
								onClick={onClose}
							>
								About Us
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/puja') ? 'active' : ''}
								to="/puja"
								onClick={onClose}
							>
								Book YourPuja
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/chadhava') ? 'active' : ''}
								to="/chadhava"
								onClick={onClose}
							>
								Book Your Chadhava
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/astrologer') ? 'active' : ''}
								to="/astrologer"
								onClick={onClose}
							>
								Consult With Astrologer
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/panchang') ? 'active' : ''}
								to="/panchang"
								onClick={onClose}
							>
								Panchang
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/astrology_calculator_hub') ? 'active' : ''}
								to="/astrology_calculator_hub"
								onClick={onClose}
							>
								Astrology Tools
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/horoscope') ? 'active' : ''}
								to="/horoscope"
								onClick={onClose}
							>
								Horoscope
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/contact_us') ? 'active' : ''}
								to="/contact_us"
								onClick={onClose}
							>
								Contact us
							</Link>
						</li>
						<li>
							<Link
								className={isActive('/notification') ? 'active' : ''}
								to="/notification"
								onClick={onClose}
							>
								Notification
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MobileMenu;

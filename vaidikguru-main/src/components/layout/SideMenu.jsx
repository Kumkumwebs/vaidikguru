import { Link } from 'react-router-dom';

const SideMenu = ({ isOpen, onClose }) => {
	return (
		<div className={`sidemenu-wrapper sidemenu-info ${isOpen ? 'show' : ''}`}>
			<div className="sidemenu-content">
				<button className="closeButton sideMenuCls" onClick={onClose}>
					<i className="far fa-times"></i>
				</button>
				<div className="widget">
					<div className="th-widget-about">
						<div className="about-logo">
							<Link to="/">
								<img src="/assets/img/logo2.svg" alt="Tourm" />
							</Link>
						</div>
						<p className="about-text">
							Rapidiously myocardinate cross-platform intellectual capital
							model. Appropriately create interactive infrastructures
						</p>
						<div className="th-social">
							<a href="https://www.facebook.com/">
								<i className="fab fa-facebook-f"></i>
							</a>
							<a href="https://www.twitter.com/">
								<i className="fab fa-twitter"></i>
							</a>
							<a href="https://www.linkedin.com/">
								<i className="fab fa-linkedin-in"></i>
							</a>
							<a href="https://www.whatsapp.com/">
								<i className="fab fa-whatsapp"></i>
							</a>
						</div>
					</div>
				</div>
				<div className="widget">
					<h3 className="widget_title">Recent Posts</h3>
					<div className="recent-post-wrap">
						<div className="recent-post">
							<div className="media-img">
								<Link to="/blog-details">
									<img
										src="/assets/img/blog/recent-post-1-1.jpg"
										alt="Blog Image"
									/>
								</Link>
							</div>
							<div className="media-body">
								<div className="recent-post-meta">
									<a href="/blog">
										<i className="far fa-calendar"></i>24 Jun , 2025
									</a>
								</div>
								<h4 className="post-title">
									<Link className="text-inherit" to="/blog-details">
										Where Vision Meets Concrete Reality
									</Link>
								</h4>
							</div>
						</div>
						<div className="recent-post">
							<div className="media-img">
								<Link to="/blog-details">
									<img
										src="/assets/img/blog/recent-post-1-2.jpg"
										alt="Blog Image"
									/>
								</Link>
							</div>
							<div className="media-body">
								<div className="recent-post-meta">
									<a href="/blog">
										<i className="far fa-calendar"></i>22 Jun , 2025
									</a>
								</div>
								<h4 className="post-title">
									<Link className="text-inherit" to="/blog-details">
										Raising the Bar in Construction.
									</Link>
								</h4>
							</div>
						</div>
					</div>
				</div>
				<div className="widget">
					<h3 className="widget_title">Get In Touch</h3>
					<div className="th-widget-contact">
						<div className="info-box_text">
							<div className="icon">
								<img src="/assets/img/icon/phone.svg" alt="img" />
							</div>
							<div className="details">
								<p>
									<a href="tel:+01234567890" className="info-box_link">
										+01 234 567 890
									</a>
								</p>
								<p>
									<a href="tel:+09876543210" className="info-box_link">
										+09 876 543 210
									</a>
								</p>
							</div>
						</div>
						<div className="info-box_text">
							<div className="icon">
								<img src="/assets/img/icon/envelope.svg" alt="img" />
							</div>
							<div className="details">
								<p>
									<a
										href="mailto:mailinfo00@tourm.com"
										className="info-box_link"
									>
										mailinfo00@tourm.com
									</a>
								</p>
								<p>
									<a
										href="mailto:support24@tourm.com"
										className="info-box_link"
									>
										support24@tourm.com
									</a>
								</p>
							</div>
						</div>
						<div className="info-box_text">
							<div className="icon">
								<img src="/assets/img/icon/location-dot.svg" alt="img" />
							</div>
							<div className="details">
								<p>789 Inner Lane, Holy park, California, USA</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideMenu;

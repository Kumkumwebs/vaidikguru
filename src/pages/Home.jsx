import { useState, useEffect } from 'react';
import SideMenu from '../components/layout/SideMenu';
import PopupSearch from '../components/layout/PopupSearch';
import MobileMenu from '../components/layout/MobileMenu';
import Header from '../components/layout/Header';
import HeroSection from '../components/home_comp/HeroSection';
import CategorySection from '../components/home_comp/CategorySection';
import WhyTrustSection from '../components/home_comp/WhyTrustSection';
import PujaListSection from '../components/home_comp/PujaListSection';
import ChadhavaSection from '../components/home_comp/ChadhavaSection';
import TeamSection from '../components/home_comp/TeamSection';
import LiveAstrologerSection from '../components/home_comp/LiveAstrologerSection';
import BlogSection from '../components/home_comp/BlogSection';
import FAQSection from '../components/home_comp/FAQSection';
import QuickLinksSection from '../components/home_comp/QuickLinksSection';
import Footer from '../components/layout/Footer';
import ScrollTop from '../components/common/ScrollTop';
import LoginModal from '../components/common/LoginModal';
import AuthService from '../services/authServices';
import './home.css';
import MobileBottomNav from '../components/layout/MobileNavbar';
import AppPromoBanner from '../components/home_comp/AppPromoBanner';


const Home = () => {
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showSearch, setShowSearch] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [homeData, setHomeData] = useState(null);

	const fetchHomeData = async () => {
		setLoading(true);
		setError(false);

		const res = await AuthService.getHomeData();

		if (res) {
			setHomeData(res);
		} else {
			setError(true);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchHomeData();
	}, []);

	return (
		<div className="dq-page">
			{/* Sidemenu */}
			<SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />

			{/* Popup Search */}
			<PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

			{/* Mobile Menu */}
			<MobileMenu
				isOpen={showMobileMenu}
				onClose={() => setShowMobileMenu(false)}
			/>

			{/* Header */}
			<AppPromoBanner />

			<Header
				onMenuToggle={() => setShowMobileMenu(true)}
				onSideMenuToggle={() => setShowSideMenu(true)}
				onSearchToggle={() => setShowSearch(true)}
				onLoginClick={() => setShowLoginModal(true)}
			/>

			{/* Hero Section + Trust strip (Authentic Rituals. Divine Blessings. Peaceful Life.) */}
			<HeroSection astrologer={homeData?.astrologer} banners={homeData?.promotionalBanner} />

			{/* Our Vaidik Services */}
			<CategorySection />

			{/* Why Millions VadikGuru (video block) */}
			<WhyTrustSection />

			{/* Most Booked Pujas */}
			<PujaListSection puja={homeData?.data || homeData?.puja || homeData?.results} />
			{/* Sacred Chadhava Delivered with Devotion */}
			<ChadhavaSection chadhava={homeData?.chadhava} />

			{/* Top Astrologers */}
			<TeamSection astrologer={homeData?.astrologer} />

			{/* From Our Blog + stats panel */}
{/* Live Astrologers — only renders if someone is currently live */}
			<LiveAstrologerSection />

			{/* From Our Blog + stats panel */}
			<BlogSection blog={homeData?.blog} />

			{/* Frequently Asked Questions */}
			<FAQSection />

			{/* Popular Aarti & Chalisa / Pooja Places / Chadhava Places */}
			{/* <QuickLinksSection /> */}

			{/* Footer */}
			<Footer />

			{/* Scroll To Top */}
			<ScrollTop />
			<MobileBottomNav />

			{/* Login Modal */}
			<LoginModal
				isOpen={showLoginModal}
				onClose={() => setShowLoginModal(false)}
			/>
		</div>
	);
};

export default Home;

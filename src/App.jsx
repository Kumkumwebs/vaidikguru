import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import AboutUs from './pages/AboutUs';
import ChadhavaListing from './pages/ChadhavaListing';
import PujaListing from './pages/pujaListing';
import ChadhavaDetails from './pages/ChadhavaDetails';
import PujaDetails from './pages/PujaDetails';
import AstrologerGrid from './pages/AstrologerList';
import NakshatraFinder from './pages/NakshatraFinder';
import JanmaRashiFinder from './pages/JanmRashiFinder';
import MangalDoshaCalculator from './pages/MangalDoshCalculator';
import LoveCalculator from './pages/LoveCalculator';
import FriendshipCalculator from './pages/FriendShipCalculator';
import DestinyNumberCalculator from './pages/DestinyNumberCalculator';
import MobileNumerologyCalculator from './pages/MobileNumberNumerologyCalculator';
import AstrologyCalculatorHub from './pages/AstrologyCalculatorTools';
import ContactUs from './pages/ContactUs';
import Security from './pages/SecurityPage';
import Careers from './pages/Careers';
import ScrollToTop from './components/common/ScrollToTop';
// import CursorFollower from './components/common/CursorFollower';
import ChadhavaCartPage from './components/common/ChadhavaCartInfo';
import PujaReviewBookingPage from './pages/PujaReviewBookingPage';
import PujaFillForm from './pages/PujaReviewForm';
import PujaBookingListPage from './pages/PujaBookingPage';
import ChadhavaBookingListPage from './pages/MyChadhavaBookingPage';
import PrivacyPolicy from './pages/PrivacyPolicyPage';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationAndRefund from './pages/CancellationAndRefund';
import HelpCenter from './pages/HelpCenter';
import PanchangPage from './pages/PanchangPage';
import Profile from './pages/Profile';
import AstrologerList from './pages/AstrologerList';
import AstrologerDetail from './pages/AstrologerDetail';
import ChatConsultation from './pages/Chatconsultation';
import AudioCall from './pages/AudioCall';
import Check from './pages/check';
import PujaBookingDetailsPage from "./pages/PujaBookingDetailsPage";
import ChadhavaBookingDetailsPage from "./pages/ChadhavaBookingDetailsPage";
import WalletPage from "./components/common/Walletpage";
import RechargeAmountPage from "./components/common/Rechargeamountpage";
import RechargeCheckoutPage from "./components/common/RechargeCheckoutPage";
import AstrologerRegistration from "./pages/AstrologerRegistration";
import Horoscope from "./pages/Horoscope";
import SendGiftModal from "./pages/Sendgiftmodal";
import { AudioCallProvider } from './context/AudioCallContext';
import { ChatProvider } from './context/ChatContext';
import ActiveCallBar from './components/common/ActiveCallBar';   // next batch
import ActiveChatBar from './components/common/ActiveChatBar';   // next batch
import ChatCallingScreen from './pages/ChatCallingScreen';    
import FAQSection from './components/home_comp/FAQSection';
import { LanguageProvider } from './context/LanguageContext';
import Orders from './pages/Orders';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import RestoreOngoingSession from './pages/RestoreOngoingSession';
import Notification from './pages/Notification';
import { useEffect } from "react";
import { initNotifications } from "./services/notification";
import PujaLiveViewPage from './pages/PujaLiveViewPage';

function NotFound() {
	return (
		<div style={{ textAlign: 'center', padding: '120px 20px' }}>
			<h2>404 — Page Not Found</h2>
			<p>The page you're looking for doesn't exist.</p>
		</div>
	);
}

		function App() {
	useEffect(() => {
		initNotifications();
	}, []);

	return (
		<LanguageProvider>
		 <AudioCallProvider>
      <ChatProvider>
		<Router>
			<ScrollToTop />
			{/* Cursor Follower - Same as original */}
			{/* <CursorFollower /> */}
			{/* Slider Drag Cursor - Same as original */}
			<div className="slider-drag-cursor">
				<i className="fas fa-angle-left me-2"></i> DRAG{' '}
				<i className="fas fa-angle-right ms-2"></i>
			</div>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about_us" element={<AboutUs />} />
				<Route path="/chadhava" element={<ChadhavaListing />} />
				<Route path="/puja" element={<PujaListing />} />
				<Route path="/chadhava/:name/:id" element={<ChadhavaDetails />} />
				<Route path="/chadhava/:id" element={<ChadhavaDetails />} />
				<Route path="/puja/:name/:id" element={<PujaDetails />} />
				<Route path="/astrologer" element={<AstrologerList />} />
				<Route path="/astrologer/:id" element={<AstrologerDetail />} />
				<Route path="/nakshatra_finder" element={<NakshatraFinder />} />
				<Route path="/janm_rashi_finder" element={<JanmaRashiFinder />} />
				<Route path="/panchang" element={<PanchangPage />} />
				<Route path="/consultation/chat/:id" element={<ChatConsultation />} />
				<Route path="/wallet" element={<WalletPage />} />
				<Route path="/recharge-now" element={<RechargeAmountPage />} />
				<Route path="/recharge-checkout" element={<RechargeCheckoutPage />} />
				<Route path="/mangal_dosh_calculator" element={<MangalDoshaCalculator />}
				/>
				<Route path="/love_calculator" element={<LoveCalculator />} />
				<Route path="/horoscope" element={<Horoscope />} />
				<Route path="/send_gift/:id" element={<SendGiftModal />} />
				<Route path="/faqs" element={<FAQSection />} />
				<Route path="/orders" element={<Orders />} />
				<Route path="/blog" element={<BlogList />} />
				<Route path="/blog/:id" element={<BlogDetail />} />
				<Route path="/notification" element={<Notification />} />
				<Route path="/puja-live/:id" element={<PujaLiveViewPage />} />
				<Route
					path="/friendship_calculator"
					element={<FriendshipCalculator />}
				/>
				<Route
					path="/destiny_number_calculator"
					element={<DestinyNumberCalculator />}
				/>
				<Route path="/astrologer_registration"
					element={<AstrologerRegistration />} />

				<Route
					path="/mobile_numerology_calculator"
					element={<MobileNumerologyCalculator />}
				/>
				<Route
					path="/astrology_calculator_hub"
					element={<AstrologyCalculatorHub />}
				/>
				<Route path="/contact_us" element={<ContactUs />} />
				<Route path="/security" element={<Security />} />
				<Route path="/careers" element={<Careers />} />
				<Route path="/help" element={<HelpCenter />} />
				<Route path="/chadhava_review_booking" element={<ChadhavaCartPage />} />
				<Route path="/consultation/call/:id" element={<AudioCall />} />
				<Route path="/consultation/calling/:id" element={<ChatCallingScreen />} />
				<Route path="/consultation/check" element={<Check />} />
				<Route
					path="/puja_review_booking"
					element={<PujaReviewBookingPage />}
				/>
				<Route path="/puja_fill_form" element={<PujaFillForm />} />
				<Route path="/my_puja_booking" element={<PujaBookingListPage />} />
				<Route path="/my-puja-booking/:id" element={<PujaBookingDetailsPage />} />
				<Route path="/my-chadhava-booking/:id" element={<ChadhavaBookingDetailsPage />} />

				<Route
					path="/my_chadhava_booking"
					element={<ChadhavaBookingListPage />}
				/>
				<Route path="/privacy_policy" element={<PrivacyPolicy />} />
				<Route path="/terms_of_use" element={<TermsAndConditions />} />
				<Route
					path="/cancellation_refund_policy"
					element={<CancellationAndRefund />}
				/>
				<Route path="/profile" element={<Profile />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
			    <ActiveCallBar /> 
          <ActiveChatBar />
		  <RestoreOngoingSession/>
		</Router>
		 </ChatProvider>
    </AudioCallProvider>
	</LanguageProvider>

	);
}

export default App;
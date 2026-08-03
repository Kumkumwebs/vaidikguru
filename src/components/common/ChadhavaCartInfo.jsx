import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";
import ScrollToTop from "./ScrollToTop";
import Footer from "../layout/Footer";
import SideMenu from "../layout/SideMenu";
import PopupSearch from "../layout/PopupSearch";
import MobileMenu from "../layout/MobileMenu";
import Header from "../layout/Header";
import apiService from "../../services/apiServices";
import { useStorage } from '../../context/StorageContext';
import "../sections/Chadhavacartpage.css";

/* ══════════════════════════════════════
   IMAGE FALLBACK — Om placeholder
   Inline SVG data URI, never touches the network so it can never
   itself fail to load or trigger a retry loop.
══════════════════════════════════════ */
const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f5ede0"/>
      <text x="50%" y="52%" font-size="70" text-anchor="middle" dominant-baseline="middle" fill="#c9962f" font-family="serif">ॐ</text>
    </svg>
  `);

// Swaps to the Om placeholder exactly once — the dataset flag rules out
// any possibility of a retry loop even if this somehow fires more than once.
const handleImgError = (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallback === "done") return;
  img.dataset.fallback = "done";
  img.style.visibility = "visible";
  img.src = IMAGE_PLACEHOLDER;
};

const ChadhavaCartPage = () => {
	const navigate = useNavigate();
	const [paymentMode, setPaymentMode] = useState("razorpay");
	const [errorMessage, seterrorMessage] = useState("");
	const {
		devoteeDetails: contextDevoteeDetails,
		setDevoteeDetails,
		activeChadhavaId: contextActiveChadhavaId,
		setActiveChadhavaId,
	} = useStorage();

	// --- States ---
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);
	const [showSearch, setShowSearch] = useState(false);

	const [cartResponse, setCartResponse] = useState(null);
	const [mergedCart, setMergedCart] = useState([]);
	const [walletBalance, setWalletBalance] = useState(0);
	const [userDetails, setUserDetails] = useState(
		contextDevoteeDetails || { name: '', whatsapp: '' }
	);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [bookingStatus, setBookingStatus] = useState(null);

	// --- Coupon States ---
	const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
	const [couponCode, setCouponCode] = useState('');
	const [appliedDiscount, setAppliedDiscount] = useState(0);

	const fetchCartFromServer = useCallback(async () => {
		try {
			const response = await apiService.postBearer('https://admin.diviniq.in/puja/getChadhavaCart', {});
			if (response && response.status === true && response.data.length > 0) {
				const rawData = response.data[0];
				setCartResponse(rawData);
				const masterAddons = rawData.chadhava_id.addons || [];
				const masterPrasad = rawData.chadhava_id.prasad || [];

				const addons = (rawData.addons_selected || []).map(sel => {
					const d = masterAddons.find(m => m._id === sel.addon_id);
					return {
						...sel,
						type: 'addon',
						name: d?.pname,
						image: d?.pimage,
						price: d?.pamount,
					};
				});

				const prasads = (rawData.prasad_selected || []).map(sel => {
					const d = masterPrasad.find(m => m._id === sel.prasad_id);
					return {
						...sel,
						type: 'prasad',
						name: d?.name,
						image: d?.image,
						price: d?.amount,
					};
				});

				setMergedCart([...addons, ...prasads]);
				setActiveChadhavaId(rawData.chadhava_id._id);
			} else {
				setCartResponse(null);
				setMergedCart([]);
			}
		} catch (error) {
			console.error('Cart fetch error:', error);
		}
	}, []);
	const fetchWalletBalance = useCallback(async () => {
		try {
			const res = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
			if (res?.status && res?.results) {
				setWalletBalance(Number(res.results.wallet || 0));
			}
		} catch (error) {
			console.error('Wallet balance fetch error:', error);
		}
	}, []);

	const loadRazorpay = () => {
		return new Promise((resolve) => {
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	};

	useEffect(() => {
		fetchCartFromServer();
		fetchWalletBalance();
		if (contextDevoteeDetails?.name) setUserDetails(contextDevoteeDetails);
	}, [fetchCartFromServer, fetchWalletBalance]);

	const handleQtyChange = async (item, delta) => {
		const newQty = (item.qty || 0) + delta;
		if (newQty < 0) return;
		const tempCart = mergedCart
			.map(i => {
				const isTarget =
					i.type === 'addon'
						? i.addon_id === item.addon_id
						: i.prasad_id === item.prasad_id;
				return isTarget ? { ...i, qty: newQty } : i;
			})
			.filter(i => i.qty > 0);
		setMergedCart(tempCart);
		try {
			const payload = {
				chadhava_id: contextActiveChadhavaId,
				addons_selected: tempCart
					.filter(i => i.type === 'addon')
					.map(i => ({ addon_id: i.addon_id, qty: i.qty })),
				prasad_selected: tempCart
					.filter(i => i.type === 'prasad')
					.map(i => ({ prasad_id: i.prasad_id, qty: i.qty })),
			};
			const res = await apiService.postBearer(
				'https://admin.diviniq.in/puja/ChadhavaaddToCart',
				payload
			);
			if (res && res.status) fetchCartFromServer();
		} catch (e) {
			fetchCartFromServer();
		}
	};

	const handlePayNow = async () => {
		if (!userDetails.name) return setIsEditModalOpen(true);
		setBookingStatus('pending');
		try {
			const payload = {
				chadhava_id: contextActiveChadhavaId,
				addons_selected: mergedCart
					.filter(i => i.type === 'addon')
					.map(i => ({ addon_id: i.addon_id, qty: i.qty })),
				prasad_selected: mergedCart
					.filter(i => i.type === 'prasad')
					.map(i => ({ prasad_id: i.prasad_id, qty: i.qty })),
				payment_mode: paymentMode,
				userDetails: { name: userDetails.name, whatsapp: userDetails.whatsapp },
			};
			const res = await apiService.postBearer(
				'https://admin.diviniq.in/puja/createChadhavaBooking',
				payload
			);
			if (res && res.status === true) {
				if (paymentMode === 'razorpay') {
					const razorpayLoaded = await loadRazorpay();
					if (!razorpayLoaded) {
						alert("Razorpay SDK failed to load");
						return;
					}
					const options = {
						key: "rzp_test_TJfZRU2xcY3vGX", // Razorpay test key
						amount: res.amount,
						currency: "INR",
						name: "vaidikguru",
						description: "Puja Booking Payment",
						order_id: res.orderId,
						handler: function (response1) {
							const interval = setInterval(() => verifyPayment(res.orderId), 3000);
							verifyPayment(res.orderId).then((status) => {
								if (status === "Success") clearInterval(interval);
							});
						},
						prefill: {
							name: userDetails.name,
							contact: userDetails.whatsapp,
						},
						theme: {
							color: "#7B1F3A",
						},
					};

					const rzp = new window.Razorpay(options);
					rzp.open();
					return;
				}
				// For other payment modes, directly show success
				else {
					setBookingStatus('success');
					fetchWalletBalance();
				}
			} else {
				setBookingStatus('failed');
			}
		} catch (e) {
			setBookingStatus('failed');
		}
	};
	const verifyPayment = async (paymentResponse) => {
		try {
			const res = await fetch(`https://admin.diviniq.in/puja/chadhava_payment_status/${paymentResponse}`, {
				method: 'GET',
			});
			const data = await res.json();

			if (data.payment_status === "Success") {
				setBookingStatus('success');
			}

			if (data.payment_status === "Failed") {
				setBookingStatus('failed');
			}
			return data.payment_status;
		} catch (e) {
			return null;
		}
	};


	const applyCoupon = () => {
		if (couponCode.toUpperCase() === 'FIRST100') {
			setAppliedDiscount(100);
			setIsCouponModalOpen(false);
		} else {
			alert('Invalid Coupon Code');
		}
	};

	const closeStatusModal = () => {
		if (bookingStatus === 'success') navigate('/');
		setBookingStatus(null);
	};

	// --- Sub-Components ---
	const StatusModal = ({ status, onClose, desc = "Unable to process payment. Please try again." }) => {
		if (!status) return null;
		const config = {
			pending: {
				icon: 'fas fa-fire',
				title: 'Confirming Sankalp',
				desc: 'Connecting with the temple server...',
				color: '#F5A623',
				ring: true,
			},
			success: {
				icon: 'fas fa-check',
				title: 'Offering Booked Successfully!',
				desc: 'Your Sankalp has been registered successfully. May you be blessed. 🙏',
				color: '#0b845c',
				btn: 'Done',
			},
			failed: {
				icon: 'fas fa-times',
				title: 'Transaction Failed',
				desc: desc,
				color: '#B33A3A',
				btn: 'Retry',
			},
		};
		const current = config[status];

		return (
			<div className="diviniq-modal-overlay">
				<motion.div
					initial={{ y: 50, opacity: 0, scale: 0.95 }}
					animate={{ y: 0, opacity: 1, scale: 1 }}
					transition={{ duration: 0.35, ease: 'easeOut' }}
					className="diviniq-modal-card text-center"
				>
					{/* Hanging diyas — decorative, success state only */}
					{(status === 'success' || status === 'failed' || status === 'pending') && (
						<div className="diviniq-hang-diyas">
							<img src="/assets/img/chadawa_detail/diya_chadhawa.png" alt="" className="diviniq-diya diviniq-diya-1" />
							<img src="/assets/img/chadawa_detail/diya_chadhawa.png" alt="" className="diviniq-diya diviniq-diya-2" />
						</div>
					)}

					{/* Close button */}
					<button className="diviniq-close-btn" onClick={onClose} aria-label="Close">
						<i className="fas fa-times"></i>
					</button>

					{/* Badge with mandala ring */}
					<div className="diviniq-badge-wrap">
						<div className="diviniq-mandala" />
						<div
							className="diviniq-icon-wrap"
							style={{ borderColor: current.color, color: current.color }}
						>
							{current.ring && (
								<motion.div
									className="diviniq-icon-ring"
									animate={{ rotate: 360 }}
									transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
								/>
							)}
							<i className={current.icon} style={{ fontSize: '30px' }}></i>
						</div>
					</div>

					<h3 className="diviniq-title">{current.title}</h3>

					<div className="diviniq-lotus-divider">
						<span className="line" />
						<i className="fas fa-spa"></i>
						<span className="line" />
					</div>

					<p className="diviniq-desc">{current.desc}</p>

					{(status === 'success' || status === 'failed' || status === 'pending') && (
						<img
							src="/assets/img/chadawa_detail/kalashchadawa.png"
							alt="Kalash offering"
							className="diviniq-kalash-img"
							onError={(e) => { e.target.style.display = 'none'; }}
						/>
					)}

					{current.btn && (
						<button
							className="diviniq-btn"
							style={{ background: current.color }}
							onClick={onClose}
						>
							<span className="diviniq-btn-dots">
								<i className="fas fa-gem"></i>
							</span>
							{current.btn}
							<span className="diviniq-btn-dots">
								<i className="fas fa-gem"></i>
							</span>
						</button>
					)}
				</motion.div>
			</div>
		);
	};

	const EmptyCartView = () => (
		<div className="cc-empty">
			<div className="cc-empty-hang-diyas">
				<img src="/assets/img/chadawa_detail/diya_chadhawa.png" alt="" className="diviniq-diya diviniq-diya-1" />
				<img src="/assets/img/chadawa_detail/diya_chadhawa.png" alt="" className="diviniq-diya diviniq-diya-2" />
			</div>

			<div className="cc-empty-art">
				<div className="diviniq-mandala" />
				<img
					src="/assets/img/chadawa_detail/kalashchadawa-removebg-preview.png"
					alt="Empty offering bowl"
					onError={(e) => { e.target.style.display = 'none'; }}
				/>
			</div>

			<h2>Your Offering Bowl is Empty</h2>

			<div className="diviniq-lotus-divider">
				<span className="line" />
				<i className="fas fa-spa"></i>
				<span className="line" />
			</div>

			<p>Add sacred sevas and prasad to begin your spiritual journey.</p>

			<Link to="/chadhava" className="cc-empty-btn">
				<span className="diviniq-btn-dots"><i className="fas fa-gem"></i></span>
				Explore Offerings
				<i className="fas fa-arrow-right ms-1"></i>
			</Link>
		</div>
	);

	const formatINR = (n) => (Number(n) || 0).toLocaleString('en-IN');

	const subtotal = cartResponse?.grand_total || 0;
	const totalAmount = subtotal - appliedDiscount + 10;

	return (
			<div className="main-wrapper bg-white">
			<ScrollToTop />
			<SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
			<PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
			<MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
			<Header
				onMenuToggle={() => setShowMobileMenu(true)}
				onSideMenuToggle={() => setShowSideMenu(true)}
				onSearchToggle={() => setShowSearch(true)}
			/>

			{/* ── HERO ── */}
			<div className="cc-hero">
				<div className="cc-hero-overlay" />
				<h2 className="cc-hero-title">
					Sacred <span>Checkout</span>
				</h2>
				<div className="cc-hero-divider">
					<span className="line" />
					<i className="fas fa-asterisk" />
					<span className="line" />
				</div>
				<p className="cc-hero-sub">
					Review your offerings and complete your divine journey
				</p>
				<div className="cc-hero-wave" />
			</div>

			<div className="container cc-body">
				{!cartResponse ? (
					<EmptyCartView />
				) : (
					<>
						<div className="row g-4">
							<div className="col-lg-8">
								{/* Devotee Info */}
								<div className="cc-devotee-card">
									<div className="cc-devotee-icon">
										<i className="fas fa-user"></i>
									</div>
									<div className="cc-devotee-info">
										<span>Devotee Details</span>
										<h5>{userDetails.name}</h5>
									</div>
									<button
										className="cc-change-btn"
										onClick={() => setIsEditModalOpen(true)}
									>
										Change
									</button>
								</div>

								{/* Offerings List */}
								<div className="cc-section-title">
									<i className="fas fa-spa"></i> Your Offerings
								</div>

								<div className="cc-offering-card">
									<img
										src={cartResponse.chadhava_id.chadhavaImage}
										alt=""
										onError={handleImgError}
									/>
									<div className="cc-offering-info">
										<h6>{cartResponse.chadhava_id.title}</h6>
									</div>
									{/* <div className="cc-offering-price">
										₹{formatINR(cartResponse.total_chadhava_amount)}
									</div> */}
								</div>

								{mergedCart.map((item, idx) => (
									<div key={idx} className="cc-item-card">
										<img
											src={item.image}
											alt=""
											onError={handleImgError}
										/>
										<div className="cc-item-info">
											<h6>{item.name}</h6>
											<div className="cc-item-meta">
												<span className="cc-item-price">₹{formatINR(item.price)}</span>
												<span className="cc-item-type">| {item.type?.toUpperCase()}</span>
											</div>
										</div>
										<div className="cc-qty-stepper">
											<button onClick={() => handleQtyChange(item, -1)}>−</button>
											<span>{item.qty}</span>
											<button onClick={() => handleQtyChange(item, 1)}>+</button>
										</div>
									</div>
								))}

								{/* Coupon Trigger */}
								<div className="cc-coupon-row" onClick={() => setIsCouponModalOpen(true)}>
									<div className="cc-coupon-left">
										<div className="cc-coupon-icon">
											<i className="fas fa-tag"></i>
										</div>
										<div>
											<h6>
												{appliedDiscount > 0
													? `Code FIRST100 Applied`
													: 'Apply Coupon Code'}
											</h6>
											<p>Save more on your sacred offerings</p>
										</div>
									</div>
									<i className="fas fa-chevron-right"></i>
								</div>
							</div>

							<div className="col-lg-4">
								<div className="cc-summary-wrap">
									<div className="cc-summary-card">
										<div className="cc-summary-title">
											<div className="cc-summary-icon">
												<i className="fas fa-shopping-bag"></i>
											</div>
											<h5>Order Summary</h5>
										</div>

										<div className="cc-summary-row">
											<span>Subtotal</span>
											<span>₹{formatINR(subtotal)}</span>
										</div>
										<div className="cc-summary-row">
											<span>Platform Fee</span>
											<span>₹10</span>
										</div>
										{appliedDiscount > 0 && (
											<div className="cc-summary-row discount">
												<span>Coupon Discount</span>
												<span>-₹{formatINR(appliedDiscount)}</span>
											</div>
										)}

										<div className="cc-summary-total">
											<h4>Total Pay</h4>
											<h3>₹{formatINR(totalAmount)}</h3>
										</div>

										<div className="cc-payment-box">
											<div className="cc-payment-label">
												<span className="line" /> Select Payment Mode
											</div>

											<label className={`cc-payment-opt${paymentMode === 'razorpay' ? ' active' : ''}`}>
												<span className="cc-radio" />
												<input
													type="radio" name="paymentMode" hidden
													checked={paymentMode === "razorpay"}
													onChange={() => setPaymentMode("razorpay")}
												/>
												Online Payment (UPI / Card)
											</label>

											<label className={`cc-payment-opt${paymentMode === 'wallet' ? ' active' : ''}`}>
												<span className="cc-radio" />
												<input
													type="radio" name="paymentMode" hidden
													checked={paymentMode === "wallet"}
													onChange={() => setPaymentMode("wallet")}
												/>
												DivinIQ Wallet <span className="cc-wallet-amt">₹{formatINR(walletBalance)}</span>
											</label>
										</div>

										<button className="cc-pay-btn" onClick={handlePayNow}>
											Proceed To Pay <i className="fas fa-lock"></i>
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* ── TRUST STRIP ── */}
						<div className="cc-trust">
							{[
								{ icon: 'fas fa-shield-alt', label: '100% Secure & Trusted Payments' },
								{ icon: 'fas fa-spa', label: 'Pure & Authentic Rituals' },
								{ icon: 'fas fa-bolt', label: 'Instant Confirmation & Updates' },
								{ icon: 'fas fa-hands-praying', label: 'Divine Blessings Guaranteed' },
							].map((t, i) => (
								<div key={i} className="cc-trust-item">
									<div className="cc-trust-ico"><i className={t.icon}></i></div>
									<span>{t.label}</span>
								</div>
							))}
						</div>
					</>
				)}
			</div>

			{/* --- Modals --- */}
			<StatusModal status={bookingStatus} desc="" onClose={closeStatusModal} />
			<UserDetailsModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					fetchCartFromServer();
				}}
				cart={mergedCart}
				page="chadhava"
			/>

			{/* --- Coupon Modal --- */}
			<AnimatePresence>
				{isCouponModalOpen && (
					<div
						className="diviniq-modal-overlay"
						onClick={() => setIsCouponModalOpen(false)}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className="diviniq-modal-card p-4"
							onClick={e => e.stopPropagation()}
						>
							<div className="modal-accent-line mx-auto mb-3"></div>
							<h4 className="fw-bold text-center mb-4">Apply Coupon</h4>
							<div className="form-group mb-4">
								<input
									type="text"
									className="form-control text-center py-3 rounded-pill"
									placeholder="Enter Code (e.g. FIRST100)"
									value={couponCode}
									onChange={e => setCouponCode(e.target.value)}
								/>
							</div>
							<button
								className="th-btn w-100 rounded-pill"
								onClick={applyCoupon}
							>
								Apply Code
							</button>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			<Footer />
		</div>
	);
};

export default ChadhavaCartPage;
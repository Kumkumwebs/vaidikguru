import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import SideMenu from "../components/layout/SideMenu";
import PopupSearch from "../components/layout/PopupSearch";
import MobileMenu from "../components/layout/MobileMenu"; import { useStorage } from "../context/StorageContext";
import PujaUserDetailsModal from "./pujaUserDetailsModel";
import "./PujaReviewBookingPage.css";

/* ─── STATIC DATA ─── */
const INCLUDED = [
  { icon: "fa-solid fa-om", label: "Sankalp" },
  { icon: "fa-solid fa-gopuram", label: "Vedic Rituals" },
  { icon: "fa-solid fa-music", label: "Mantra Chanting" },
  { icon: "fa-solid fa-user-graduate", label: "Puja by Pandit" },
  { icon: "fa-solid fa-camera", label: "Live Photos" },
  { icon: "fa-solid fa-box", label: "Prasad" },
  { icon: "fa-solid fa-certificate", label: "Blessing Certificate" },
];

const TRUST = [
  { icon: "fa-solid fa-gopuram", name: "Temple Certified", sub: "Authentic & Verified" },
  { icon: "fa-solid fa-lock", name: "Secure Payments", sub: "100% Safe & Secure" },
  { icon: "fa-solid fa-video", name: "HD Video Recording", sub: "Capture Every Moment" },
  { icon: "fa-solid fa-user-check", name: "Verified Pandits", sub: "Experienced & Trusted" },
  { icon: "fa-solid fa-headset", name: "24x7 Support", sub: "Always Here for You" },
];

const WHY = [
  "3,00,000+ Devotees Trust Us",
  "Performed in 1,080+ Temples",
  "Trusted by 50,000+ Families",
  "Instant Booking Confirmation",
  "Pure & Authentic Rituals",
];

/* ─── HELPERS ─── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—";

/* ═══════════════════════════════════════════════════════════════ */
const PujaReviewBookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { devoteeDetails } = useStorage();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const puja = state?.pujaData;
  const selectedPackage = state?.selectedPackage;

  /* ── Debug: log puja object on mount ── */
  useEffect(() => {
    console.log("[ReviewPage] puja._id:", puja?._id);
    console.log("[ReviewPage] full puja object:", puja);
  }, []);

  /* ── Addons fetched fresh from pujabyinstaid API ── */
  const [addons, setAddons] = useState([]);
  const [homeDeliveryAddons, setHomeDeliveryAddons] = useState([]);
  const [addonsLoading, setAddonsLoading] = useState(true);

  const [cartData, setCartData] = useState(null);
  const [templeAddonsQty, setTempleAddonsQty] = useState({});
  const [homeAddonsQty, setHomeAddonsQty] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const addonsScrollRef = useRef(null);

  /* ── Fetch addons directly from pujabyinstaid using puja._id ── */
  useEffect(() => {
    const fetchPujaAddons = async () => {
      /* puja._id must be a non-empty string */
      const pujaId = puja?._id;
      if (!pujaId) {
        console.warn("[ReviewPage] puja._id is missing — cannot fetch addons");
        setAddonsLoading(false);
        return;
      }
      setAddonsLoading(true);
      try {
        console.log("[ReviewPage] fetching addons for puja id:", pujaId);
        const res = await apiService.postBearer(
          "https://admin.diviniq.in/puja/pujabyinstaid",
          { instaId: pujaId }
        );
        console.log("[ReviewPage] pujabyinstaid response:", res);
        if (res?.status && res?.data) {
          const fetchedAddons = res.data.addons || [];
          const fetchedHomeAddons = res.data.homeDeliveryAddons || [];
          console.log("[ReviewPage] addons fetched:", fetchedAddons.length);
          console.log("[ReviewPage] homeDeliveryAddons fetched:", fetchedHomeAddons.length);
          setAddons(fetchedAddons);
          setHomeDeliveryAddons(fetchedHomeAddons);
        } else {
          console.warn("[ReviewPage] pujabyinstaid returned no data:", res);
        }
      } catch (err) {
        console.error("[ReviewPage] Failed to fetch puja addons:", err);
      } finally {
        setAddonsLoading(false);
      }
    };
    fetchPujaAddons();
  }, [puja?._id]);

  /* ── Fetch cart ── */
  const fetchCartFromServer = useCallback(async () => {
    try {
      const res = await apiService.postBearer("https://admin.diviniq.in/puja/getPujaCart", {});
      if (res?.status && res.data) {
        const cart = res.data;
        setCartData(cart);
        const tQty = {};
        (cart.addons_selected || []).forEach((a) => (tQty[a.addon_id] = a.qty));
        setTempleAddonsQty(tQty);
        const hQty = {};
        (cart.home_addons_selected || []).forEach((h) => (hQty[h.addon_id] = h.qty));
        setHomeAddonsQty(hQty);
      }
    } catch (err) {
      console.error("Cart fetch error", err);
    }
  }, []);

  useEffect(() => { fetchCartFromServer(); }, [fetchCartFromServer]);

  /* ── Update cart ── */
  const updateServerCart = async (newTempleQty, newHomeQty) => {
    setIsSyncing(true);
    try {
      const payload = {
        puja_id: puja?._id,
        package_id: selectedPackage?._id,
        addons_selected: Object.entries(newTempleQty).map(([id, qty]) => ({ addon_id: id, qty })),
        home_addons_selected: Object.entries(newHomeQty).map(([id, qty]) => ({ addon_id: id, qty })),
        is_home_delivery_required: Object.keys(newHomeQty).length > 0,
        userDetails: { name: devoteeDetails?.name || "" },
      };
      const res = await apiService.postBearer("https://admin.diviniq.in/puja/pujaaddToCart", payload);
      if (res?.status && res.data) setCartData(res.data);
      else fetchCartFromServer();
    } catch (err) {
      console.error("Update failed", err);
      fetchCartFromServer();
    } finally {
      setIsSyncing(false);
    }
  };

  /* ── Qty handler ── */
  const handleQtyChange = (id, delta, type) => {
    const isTemple = type === "temple";
    const currentMap = isTemple ? templeAddonsQty : homeAddonsQty;
    const newQty = Math.max(0, (currentMap[id] || 0) + delta);
    const nextMap = { ...currentMap };
    if (newQty === 0) delete nextMap[id];
    else nextMap[id] = newQty;
    if (isTemple) { setTempleAddonsQty(nextMap); updateServerCart(nextMap, homeAddonsQty); }
    else { setHomeAddonsQty(nextMap); updateServerCart(templeAddonsQty, nextMap); }
  };

  const handleContinueToForm = () => {
    navigate("/puja_fill_form", { state: { pujaData: puja, selectedPackage } });
  };

  const grandTotal = isSyncing ? "..." : cartData?.grand_total ?? selectedPackage?.packagePrice ?? 0;

  if (!puja) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <h3>No puja data found.</h3>
        <p>Please go back and select a puja package.</p>
        <button onClick={() => navigate("/puja")} style={{ padding: "12px 32px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 15 }}>
          Browse Pujas
        </button>
      </div>
    );
  }

  /* ── Addon card renderer ── */
  const renderAddonCard = (item, type) => {
    const qty = (type === "temple" ? templeAddonsQty : homeAddonsQty)[item._id] || 0;
    return (
      <div
        key={item._id}
        style={{
          minWidth: 140,
          maxWidth: 160,
          border: qty > 0 ? "2px solid #22c55e" : "1.5px solid #e5e7eb",
          borderRadius: 14,
          overflow: "hidden",
          flexShrink: 0,
          background: "#fff",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: qty > 0 ? "0 2px 12px rgba(34,197,94,0.15)" : "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* IMAGE */}
        <div style={{ width: "100%", height: 100, overflow: "hidden", background: "#fdf8f2" }}>
          <img
            src={item.pimage || "https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=260&h=160&fit=crop"}
            alt={item.pname}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=260&h=160&fit=crop";
            }}
          />
        </div>

        {/* BODY */}
        <div style={{ padding: "10px 10px 12px" }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#1a1a2e",
            marginBottom: 4,
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {item.pname}
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#7c2d8e", marginBottom: 10 }}>
            ₹{item.pamount}
          </div>

          {/* ADD BUTTON or STEPPER */}
          {qty === 0 ? (
            <button
              onClick={() => handleQtyChange(item._id, 1, type)}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#6b2580"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#7c2d8e"; }}
              style={{
                width: "100%",
                padding: "7px 0",
                background: "#7c2d8e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
                transition: "background 0.2s",
              }}
            >
              <i className="fa-solid fa-plus" style={{ fontSize: 10 }} /> Add
            </button>
          ) : (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#f3e8ff",
              borderRadius: 8,
              padding: "2px 4px",
              border: "1.5px solid #7c2d8e",
            }}>
              <button
                onClick={() => handleQtyChange(item._id, -1, type)}
                style={{
                  width: 28, height: 28,
                  border: "none",
                  background: "#7c2d8e",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >−</button>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#7c2d8e", minWidth: 20, textAlign: "center" }}>
                {qty}
              </span>
              <button
                onClick={() => handleQtyChange(item._id, 1, type)}
                style={{
                  width: 28, height: 28,
                  border: "none",
                  background: "#7c2d8e",
                  color: "#fff",
                  borderRadius: 6,
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >+</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="prb-root">
      <ScrollToTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      <PujaUserDetailsModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          // Refresh cart so any devotee-detail-dependent totals stay in sync
          fetchCartFromServer();
        }}
        cart={selectedPackage}
        page="puja"
        puja={puja}
        selectedPackage={selectedPackage}
      />

      {/* ── HERO ── */}
      <div className="prb-hero">
        <div className="prb-hero-inner">
          <div>
            <div className="prb-bc">
              <a href="/">Home</a> › <a href="/puja">Puja</a> › <a href="#">{puja.title}</a> › <span>Review Booking</span>
            </div>
            <h1 className="prb-hero-title">Review <em>Booking</em></h1>
            <p className="prb-hero-sub">Please review your booking details before proceeding</p>
          </div>
          <span className="prb-hero-deco">🔔</span>
          <button className="prb-proceed-btn" onClick={handleContinueToForm}>
            Proceed &nbsp;<i className="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      {/* <div className="container prb-page-wrap"> */}
      <div className="container py-5">
        <div className="row">
          {/* ══ LEFT ══ */}
          {/* <div className="prb-left"> */}
          <div className="col-xxl-8 col-lg-7 mb-4">

            {/* PUJA SUMMARY */}
            <div className="prb-card mb-4">
              <div className="prb-sec-header">
                <i className="fa-solid fa-gopuram" /><span> Puja Summary</span>
              </div>
              {/* <div className="row prb-puja-grid"> */}
              <div className="row pt-3">
                <div className="col-xxl-6 mb-4">
                  <img
                    className="prb-puja-img w-100"
                    src={puja?.pujaImage || "/assets/img/pooja/kalash.png"}
                    alt={puja?.title || "Puja"}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/assets/img/pooja/kalash.png"; }}
                  />
                </div>
                <div className="col-xxl-6 prb-puja-info">
                  <div className="prb-puja-name">{puja.title}</div>
                  <div className="prb-puja-location"><i className="fa-solid fa-location-dot" /> {puja.mandirName}</div>
                  <div className="prb-purpose-label">// Purpose of Puja</div>
                  <div className="prb-purpose-box">"{puja.purposeOfPooja}"</div>
                  <div className="prb-meta-grid">
                    <div className="prb-meta-item">
                      <div className="prb-meta-label"><i className="fa-solid fa-calendar-days" /> Puja Date</div>
                      <div className="prb-meta-val">{fmt(puja.pujaDatetime)}</div>
                    </div>
                    <div className="prb-meta-item">
                      <div className="prb-meta-label"><i className="fa-regular fa-clock" /> Puja Time</div>
                      <div className="prb-meta-val">{fmtTime(puja.pujaDatetime)}</div>
                    </div>
                    <div className="prb-meta-item">
                      <div className="prb-meta-label"><i className="fa-solid fa-om" /> Puja Type</div>
                      <div className="prb-meta-val">{puja.pujaType || "Vedic Ritual"}</div>
                    </div>
                    <div className="prb-meta-item">
                      <div className="prb-meta-label"><i className="fa-regular fa-hourglass-half" /> Duration</div>
                      <div className="prb-meta-val">{puja.duration || "45–60 Min"}</div>
                    </div>
                  </div>
                  <div className="prb-pkg-row">
                    <div>
                      <div className="prb-pkg-label">Selected Package</div>
                      <div className="prb-pkg-name">{selectedPackage?.packageName}</div>
                    </div>
                    <div className="prb-pkg-price">₹{selectedPackage?.packagePrice}</div>
                  </div>
                  <div className="prb-avail-badge">
                    <i className="fa-solid fa-shield-halved" /> Limited Availability – Final Day to Participate!
                  </div>
                </div>
              </div>
            </div>

            {/* DEVOTEE INFO */}
            <div className="prb-card mb-4">
              <div className="prb-sec-header">
                <i className="fa-solid fa-user-circle" /><span>Devotee (Sankalp) Information</span>
              </div>
              <div className="prb-devotee-row">
                <div className="prb-devotee-cell">
                  <div className="prb-dev-icon"><i className="fa-solid fa-user" /></div>
                  <div>
                    <div className="prb-dev-label">Devotee Name</div>
                    <div className="prb-dev-val">{devoteeDetails?.name || "Guest"}</div>
                  </div>
                </div>
                <div className="prb-devotee-cell">
                  <div className="prb-dev-icon prb-dev-icon--green"><i className="fa-brands fa-whatsapp" /></div>
                  <div>
                    <div className="prb-dev-label">WhatsApp No.</div>
                    <div className="prb-dev-val">+91 {devoteeDetails?.whatsapp || "N/A"}</div>
                  </div>
                </div>
                <button className="prb-edit-btn" onClick={() => setShowEditModal(true)}>
                  <i className="fa-solid fa-pen" /> Edit Details
                </button>
              </div>
              <div className="prb-divider" />
              <div className="prb-sankalp-row">
                <i className="fa-solid fa-hands-praying" />
                <div>
                  <div className="prb-dev-label">Sankalp (Prarthana)</div>
                  <div className="prb-dev-val">{devoteeDetails?.sankalp || "Health, Peace & Prosperity for Family"}</div>
                </div>
              </div>
            </div>

            {/* ══ SACRED ADD-ONS ══ */}
            {addonsLoading ? (
              <div className="prb-card" style={{ textAlign: "center", padding: "24px", color: "#c8952a" }}>
                <i className="fa-solid fa-rotate fa-spin" /> Loading Sacred Add-ons…
              </div>
            ) : addons.length > 0 ? (
              <div className="prb-card">
                <div className="prb-sec-header">
                  <i className="fa-solid fa-gift" /><span> Sacred Add-ons</span>
                </div>
                <div className="prb-addons-wrap">
                  <div className="prb-addons-row" ref={addonsScrollRef}>
                    {addons.map((a) => renderAddonCard(a, "temple"))}
                  </div>
                  {addons.length > 3 && (
                    <button className="prb-scroll-arr" onClick={() => addonsScrollRef.current?.scrollBy({ left: 150, behavior: "smooth" })}>
                      <i className="fa-solid fa-chevron-right" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* ══ HOME DELIVERY ══ */}
            {!addonsLoading && homeDeliveryAddons.length > 0 && (
              <div className="prb-card mt-3">
                <div className="prb-sec-header">
                  <i className="fa-solid fa-truck mb-3" /><span> Home Delivery Services</span>
                </div>
                <div className="prb-delivery-row">
                  {homeDeliveryAddons.map((item) => {
                    const qty = homeAddonsQty[item._id] || 0;
                    return (
                      <div className="prb-delivery-card" key={item._id}>
                        <div className="prb-del-icon prb-icon-orange"><i className="fa-solid fa-box-open" /></div>
                        <div className="prb-del-info">
                          <div className="prb-del-name">{item.pname}</div>
                          <div className="prb-del-sub">{item.pdesc || item.pdescription || "Home delivery"}</div>
                          <div className="prb-del-price">₹{item.pamount}</div>
                        </div>
                        {qty === 0 ? (
                          <button className="prb-del-btn" onClick={() => handleQtyChange(item._id, 1, "home")}>+ Add</button>
                        ) : (
                          <div className="prb-qty-stepper prb-qty-stepper--sm">
                            <button onClick={() => handleQtyChange(item._id, -1, "home")}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => handleQtyChange(item._id, 1, "home")}>+</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ══ RIGHT ══ */}
          {/* <div className="prb-right"> */}
          <div className="col-xxl-4 col-lg-5 mb-4">
            <div className="prb-right-sticky">

              {/* ORDER SUMMARY */}
              <div className="prb-order-card">
                <div className="prb-order-header"><i className="fa-solid fa-receipt" /><span>Order Summary</span></div>
                <div className="prb-order-body">
                  <div className="prb-order-sublabel">Selected Package</div>
                  <div className="prb-order-line">
                    <span className="prb-order-pkg">{selectedPackage?.packageName || "Individual"}</span>
                    <span className="prb-order-val">₹{selectedPackage?.packagePrice ?? 0}</span>
                  </div>
                  <div className="prb-order-divider" />
                  <div className="prb-order-line">
                    <span className="prb-order-label"> Sacred Add-ons</span>
                    <span className="prb-order-val">
                      {Object.keys(templeAddonsQty).length === 0
                        ? <span className="prb-not-added">Not Added Yet</span>
                        : `₹${addons.filter((a) => templeAddonsQty[a._id]).reduce((s, a) => s + a.pamount * templeAddonsQty[a._id], 0)}`}
                    </span>
                  </div>
                  <div className="prb-order-line" style={{ marginTop: 8 }}>
                    <span className="prb-order-label">Home Delivery</span>
                    <span className="prb-order-val">
                      {Object.keys(homeAddonsQty).length === 0
                        ? <span className="prb-not-added">Not Added Yet</span>
                        : `₹${homeDeliveryAddons.filter((a) => homeAddonsQty[a._id]).reduce((s, a) => s + a.pamount * homeAddonsQty[a._id], 0)}`}
                    </span>
                  </div>
                  <div className="prb-order-divider" />
                  <div className="prb-order-line">
                    <span className="prb-order-label">Coupon Discount</span>
                    <span className="prb-order-val prb-discount">{cartData?.discount ? `-₹${cartData.discount}` : "-₹0"}</span>
                  </div>
                  {!couponApplied && <div className="prb-apply-coupon">Apply Coupon</div>}
                  <div className="prb-order-line">
                    <span className="prb-order-label">Taxes & Charges <i className="fa-solid fa-circle-info" style={{ fontSize: 10, opacity: 0.5 }} /></span>
                    <span className="prb-order-val">₹{cartData?.tax_amount ?? 0}</span>
                  </div>
                  <div className="prb-order-divider" />
                  <div className="prb-total-row">
                    <span className="prb-total-label">Total Payable</span>
                    <span className="prb-total-val">{isSyncing ? <span className="prb-syncing">…</span> : `₹${grandTotal}`}</span>
                  </div>
                  <button className="prb-pay-btn" onClick={handleContinueToForm}>
                    <i className="fa-solid fa-lock" /> Review &amp; Pay <i className="fa-solid fa-arrow-right" />
                  </button>
                  <div className="prb-secure-note">
                    <i className="fa-solid fa-shield-halved" style={{ color: "#22c55e" }} /> 100% Secure Payment
                  </div>
                </div>
              </div>

              {/* COUPON */}
              <div className="prb-coupon-card mx-0">
                <div className="prb-coupon-title"><i className="fa-solid fa-tag" /> Have a Coupon?</div>
                <div className="prb-coupon-row">
                  <input className="prb-coupon-input" type="text" placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                  <button className="prb-coupon-btn" onClick={() => { if (couponCode.trim()) setCouponApplied(true); }}>Apply</button>
                </div>
                {couponApplied && <div className="prb-coupon-success"><i className="fa-solid fa-circle-check" /> Coupon applied!</div>}
                <div className="prb-coupon-sub">Save extra on your puja booking</div>
              </div>

              {/* WHY DIVINIQ */}
              <div className="prb-why-card mx-0">
                <div className="prb-why-title"><i className="fa-solid fa-user-circle" /> Why Choose DivinIQ?</div>
                <ul className="prb-why-list">
                  {WHY.map((w) => <li key={w}><i className="fa-solid fa-circle-check prb-why-check" /> {w}</li>)}
                </ul>
                <img className="prb-why-temple" src="/assets/img/pooja/temple.png" alt="Temple" />
              </div>
            </div>
          </div>Online Payment (UPI / Card)

        </div>
      </div>

      {/* WHAT'S INCLUDED */}
      <div className="prb-card py-4" style={{ margin: "20px" }}>
        <div className="prb-sec-header"><i className="fa-solid fa-list-check" /><span>   What's Included in This Puja</span></div>
        <div className="prb-included-grid">
          {INCLUDED.map(({ icon, label }) => (
            <div className="prb-inc-item" key={label}>
              <div className="prb-inc-icon">
                <i className={icon} />
                <span className="prb-inc-check"><i className="fa-solid fa-check" /></span>
              </div>
              <div className="prb-inc-label">{label}</div>
            </div>
          ))}
        </div>
        <div className="prb-trust-grid">
          {TRUST.map(({ icon, name, sub }) => (
            <div className="prb-trust-item" key={name}>
              <div className="prb-trust-icon"><i className={icon} /></div>
              <div className="prb-trust-name">{name}</div>
              <div className="prb-trust-sub">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NEED HELP */}
      <div className="prb-help-section mx-4">
        <div className="prb-help-left">
          <div className="prb-help-main-icon"><i className="fa-solid fa-headset"></i></div>
          <div><h5>Need Help?</h5><p>We are here to help you at every step</p></div>
        </div>
        <div className="prb-help-right">
          <div className="prb-help-item">
            <div className="prb-help-icon prb-help-purple"><i className="fa-solid fa-phone"></i></div>
            <div><span>Call Support</span><strong>+91 7311104573</strong></div>
          </div>
          <div className="prb-help-divider"></div>
          <div className="prb-help-item">
            <div className="prb-help-icon prb-help-green"><i className="fa-brands fa-whatsapp"></i></div>
            <div><span>WhatsApp</span><strong>Chat with us</strong></div>
          </div>
          <div className="prb-help-divider"></div>
          <div className="prb-help-item">
            <div className="prb-help-icon prb-help-yellow"><i className="fa-solid fa-envelope"></i></div>
            <div><span>Email Us</span><strong>support@diviniq.com</strong></div>
          </div>
        </div>
      </div>

      {/* PAYMENT FOOTER */}
      <div className="prb-pay-footer">
        <div className="prb-pay-footer-inner">
          <div>
            <div className="prb-pf-title"><i className="fa-solid fa-lock" style={{ color: "#22c55e" }} /> 100% Secure Payments</div>
            <div className="prb-pf-sub">Your transactions are safe with us</div>
          </div>
          <div className="prb-pay-icons">
            <span className="prb-pi prb-pi-upi">UPI</span>
            <span className="prb-pi prb-pi-visa">VISA</span>
            <span className="prb-pi prb-pi-mc"><span style={{ color: "#eb001b" }}>●</span><span style={{ color: "#f79e1b" }}>●</span> mastercard</span>
            <span className="prb-pi prb-pi-rupay">RuPay</span>
            <span className="prb-pi prb-pi-paytm">Paytm</span>
            {/* <span className="prb-pi-shield"><i className="fa-solid fa-shield-halved" style={{ color: "#22c55e" }} /></span> */}
          </div>
        </div>
      </div>

         {/* SYNCING TOAST */}
      {isSyncing && (
        <div className="prb-sync-toast">
          <i className="fa-solid fa-rotate fa-spin" /> Syncing Selection…
        </div>
      )}

      {/* Mobile-only fixed bottom CTA — desktop keeps the "Review & Pay"
          button inside the order summary card as-is */}
      <div className="prb-mobile-cta-wrap">
        <div>
          <div className="prb-mobile-cta-total-label">Total Payable</div>
          <div className="prb-mobile-cta-total-val">
            {isSyncing ? "…" : `₹${grandTotal}`}
          </div>
        </div>
        <button className="prb-mobile-cta-btn" onClick={handleContinueToForm}>
          <i className="fa-solid fa-lock" /> Review &amp; Pay <i className="fa-solid fa-arrow-right" />
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default PujaReviewBookingPage;
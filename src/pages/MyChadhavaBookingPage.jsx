import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import SideMenu from "../components/layout/SideMenu";
import PopupSearch from "../components/layout/PopupSearch";
import MobileMenu from "../components/layout/MobileMenu";
import { motion } from "framer-motion";
import "./ChadhavaBookingListPage.css";

const ChadhavaBookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  // ----------------------------------------------------
  // FETCH CHADHAVA BOOKINGS
  // ----------------------------------------------------
  useEffect(() => {
    const fetchChadhava = async () => {
      try {
        const res = await apiService.postBearer('https://admin.diviniq.in/puja/mychdhavabookings', {});
        if (res && res.status) {
          const list = Array.isArray(res.bookPooja) ? res.bookPooja : [];
          // API does not guarantee ordering — sort newest first so today's
          // bookings always surface at the top instead of wherever the
          // backend happened to place them.
          const sorted = [...list].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setBookings(sorted);
        }
      } catch (error) {
        console.error("Chadhava Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChadhava();
  }, []);

  const handleViewDetails = (item) => {
    // Pass the booking object via route state so the details page doesn't
    // need to re-fetch; the details page also has an API fallback by id.
    navigate(`/my-chadhava-booking/${item._id}`, { state: { booking: item } });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'success';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      default: return 'default';
    }
  };

  const filteredBookings = useMemo(() => {
    let list = [...bookings];

    if (statusFilter !== "all") {
      list = list.filter(
        (item) => item.payment_status?.toLowerCase() === statusFilter
      );
    }

    if (timeFilter !== "all") {
      const now = new Date();
      const days = timeFilter === "30d" ? 30 : timeFilter === "90d" ? 90 : 365;
      const cutoff = new Date(now);
      cutoff.setDate(now.getDate() - days);
      list = list.filter((item) => new Date(item.createdAt) >= cutoff);
    }

    return list;
  }, [bookings, statusFilter, timeFilter]);

  const statusCounts = useMemo(() => {
    const counts = { success: 0, pending: 0 };
    bookings.forEach((item) => {
      const s = item.payment_status?.toLowerCase();
      if (s === 'success') counts.success += 1;
      if (s === 'pending') counts.pending += 1;
    });
    return counts;
  }, [bookings]);

  return (
       <div className="main-wrapper bg-light">
      <ScrollToTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      {/* ---------- Hero Banner ---------- */}
      <div className="cb-hero">
        <div className="cb-hero-inner">
          <div className="cb-hero-border" />
          <div>
            <div className="cb-hero-eyebrow">Sacred Contributions</div>
            <h2 className="cb-hero-title">
              Chadhava <span>History</span>
            </h2>
            <p className="cb-hero-sub">
              Every offering is a step closer to divine grace and blessings.
            </p>
            <div className="cb-hero-divider">
              <div className="line" />
              <div className="dot" />
              <div className="line" />
            </div>
          </div>
        </div>
      </div>

      <div className="container cb-list-section">
        {/* ---------- Section header + filters ---------- */}
        {!loading && bookings.length > 0 && (
          <div className="cb-section-bar">
            <div className="cb-section-title-wrap">
              <h3 className="cb-section-title">My Chadhava History</h3>
              <div className="cb-section-underline" />
            </div>

            <div className="cb-filter-bar">
              <button
                className={`cb-filter-pill ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`cb-filter-pill outline success ${statusFilter === "success" ? "active" : ""}`}
                onClick={() => setStatusFilter("success")}
              >
                <span className="dot" /> Success
                <span className="count">{statusCounts.success}</span>
              </button>
              <button
                className={`cb-filter-pill outline pending ${statusFilter === "pending" ? "active" : ""}`}
                onClick={() => setStatusFilter("pending")}
              >
                <span className="dot" /> Pending
                <span className="count">{statusCounts.pending}</span>
              </button>

              <select
                className="cb-time-select"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="365d">Last Year</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="cb-loading">
            <div className="spinner-border text-theme" role="status"></div>
          </div>
        ) : bookings.length === 0 ? (
          /* --- NO BOOKING FOUND STATE --- */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cb-empty"
          >
            <div className="cb-empty-icon">
              <i className="fas fa-hand-holding-heart"></i>
            </div>
            <h3 className="cb-empty-title">No Chadhava Offerings Found</h3>
            <p className="cb-empty-text">
              You haven't made any sacred offerings yet.<br />Explore our Chadhava sevas to begin your spiritual journey.
            </p>
            <button className="cb-empty-btn" onClick={() => navigate('/chadhava')}>
              Offer Chadhava Now <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </motion.div>
        ) : filteredBookings.length === 0 ? (
          <div className="cb-empty cb-empty-filtered">
            <div className="cb-empty-icon">
              <i className="fas fa-filter"></i>
            </div>
            <h3 className="cb-empty-title">No Matching Bookings</h3>
            <p className="cb-empty-text">Try adjusting your filters to see more results.</p>
            <button
              className="cb-empty-btn"
              onClick={() => { setStatusFilter("all"); setTimeFilter("all"); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* --- GRID VIEW --- */
          <div className="row g-4 py-20">
            {filteredBookings.map((item) => {
              const statusClass = getStatusClass(item.payment_status);
              return (
                <div key={item._id} className="col-xl-4 col-md-6">
                  <div className="cb-card">
                    <div className="cb-card-watermark" />

                    <div className="cb-card-body">
                      <div className="cb-card-header">
                        <div className={`cb-card-icon ${statusClass}`}>
                          {item.chadhava_id?.chadhavaImage ? (
                            <img
                              src={item.chadhava_id.chadhavaImage}
                              alt={item.chadhava_id?.title}
                              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          ) : null}
                          <i className="fas fa-om" style={{ display: item.chadhava_id?.chadhavaImage ? 'none' : 'flex' }}></i>
                        </div>
                        <div className="cb-card-header-text">
                          <span className="cb-card-id">ID: {item.chadhava_booking_id}</span>
                          <h6 className="cb-card-title">
                            {item.chadhava_id?.title || "Chadhava"} Offering
                          </h6>
                        </div>
                        <div className={`cb-status ${statusClass}`}>
                          {item.payment_status}
                        </div>
                      </div>

                      <div className="cb-card-details">
                        <div className="cb-card-detail-row">
                          <span className="cb-card-detail-label">
                            <i className="fas fa-calendar-alt"></i> Offer Date
                          </span>
                          <span className="cb-card-detail-value">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="cb-card-detail-row">
                          <span className="cb-card-detail-label">
                            <i className="fas fa-user"></i> Devotee
                          </span>
                          <span className="cb-card-detail-value">{item.userDetails?.name || '—'}</span>
                        </div>
                        <div className="cb-card-detail-row">
                          <span className="cb-card-detail-label">
                            <i className="fas fa-wallet"></i> Payment
                          </span>
                          <span className="cb-card-detail-value">{item.payment_mode}</span>
                        </div>
                        <div className="cb-card-detail-row">
                          <span className="cb-card-detail-label">
                            <i className="fas fa-gift"></i> Addons
                          </span>
                          <span className="cb-card-detail-value">
                            {(item.addons_selected?.length || 0) + (item.prasad_selected?.length || 0)} Selected
                          </span>
                        </div>
                      </div>

                      <div className="cb-card-footer">
                        <div>
                          <span className="cb-card-amount-label">Total Amount</span>
                          <h5 className="cb-card-amount-value">₹{item.chadhava_amount}</h5>
                        </div>
                        <button
                          className="cb-view-btn"
                          onClick={() => handleViewDetails(item)}
                        >
                          <i className="fas fa-eye"></i> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ChadhavaBookingListPage;
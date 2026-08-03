import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { motion } from "framer-motion";
import "./PujaBookingListPage.css";

const PujaBookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await apiService.postBearer('https://admin.diviniq.in/puja/mypujabookings', {});
        if (res && res.status) {
          const list = Array.isArray(res.bookPooja) ? res.bookPooja : [];
          const sorted = [...list].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setBookings(sorted);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleViewDetails = (item) => {
    // Pass the booking object via route state so the details page doesn't
    // need to re-fetch; the details page also has an API fallback by id.
    navigate(`/my-puja-booking/${item._id}`, { state: { booking: item } });
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
      <Header />

      {/* ---------- Hero Banner ---------- */}
      <div className="puja-hero">
        <div className="puja-hero-inner">
          <div className="puja-hero-border" />
          <div>
            <div className="puja-hero-eyebrow">My Devotion</div>
            <h2 className="puja-hero-title">
              Puja <span>History</span>
            </h2>
            <p className="puja-hero-sub">
              Your devotion, our blessings. Each puja is a step closer to divine grace.
            </p>
            <div className="puja-hero-divider">
              <div className="line" />
              <div className="dot" />
              <div className="line" />
            </div>
          </div>
        </div>
      </div>

      <div className="container puja-list-section">
        {/* ---------- Section header + filters ---------- */}
        {!loading && bookings.length > 0 && (
          <div className="puja-section-bar">
            <div className="puja-section-title-wrap">
              <h3 className="puja-section-title">My Puja History</h3>
              <div className="puja-section-underline" />
            </div>

            <div className="puja-filter-bar">
              <button
                className={`puja-filter-pill ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All
              </button>
              <button
                className={`puja-filter-pill outline success ${statusFilter === "success" ? "active" : ""}`}
                onClick={() => setStatusFilter("success")}
              >
                <span className="dot" /> Success
                <span className="count">{statusCounts.success}</span>
              </button>
              <button
                className={`puja-filter-pill outline pending ${statusFilter === "pending" ? "active" : ""}`}
                onClick={() => setStatusFilter("pending")}
              >
                <span className="dot" /> Pending
                <span className="count">{statusCounts.pending}</span>
              </button>

              <select
                className="puja-time-select"
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
          <div className="puja-loading">
            <div className="spinner-border text-theme" role="status"></div>
          </div>
        ) : bookings.length === 0 ? (
          /* --- NO BOOKING FOUND STATE --- */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="puja-empty"
          >
            <div className="puja-empty-icon">
              <i className="fas fa-om"></i>
            </div>
            <h3 className="puja-empty-title">No Bookings Found</h3>
            <p className="puja-empty-text">
              You haven't initiated any sacred rituals yet.<br />Explore our pujas to start your spiritual journey.
            </p>
            <button className="puja-empty-btn" onClick={() => navigate('/pujas')}>
              Browse All Pujas <i className="fas fa-arrow-right ms-2"></i>
            </button>
          </motion.div>
        ) : filteredBookings.length === 0 ? (
          <div className="puja-empty puja-empty-filtered">
            <div className="puja-empty-icon">
              <i className="fas fa-filter"></i>
            </div>
            <h3 className="puja-empty-title">No Matching Bookings</h3>
            <p className="puja-empty-text">Try adjusting your filters to see more results.</p>
            <button
              className="puja-empty-btn"
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
                  <div className="puja-card">
                    <div className="puja-card-watermark" />

                    <div className="puja-card-body">
                      <div className="puja-card-header">
                        <div className={`puja-card-icon ${statusClass}`}>
                          <i className="fas fa-gift"></i>
                        </div>
                        <div className="puja-card-header-text">
                          <span className="puja-card-id">ID: {item.puja_booking_id}</span>
                          <h6 className="puja-card-title">
                            {item.puja_id?.title || item.puja_type || "Puja"} Offering
                          </h6>
                        </div>
                        <div className={`puja-status ${statusClass}`}>
                          {item.payment_status}
                        </div>
                      </div>

                      <div className="puja-card-details">
                        <div className="puja-card-detail-row">
                          <span className="puja-card-detail-label">
                            <i className="fas fa-calendar-alt"></i> Puja Date
                          </span>
                          <span className="puja-card-detail-value">
                            {new Date(item.puja_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="puja-card-detail-row">
                          <span className="puja-card-detail-label">
                            <i className="fas fa-wallet"></i> Payment
                          </span>
                          <span className="puja-card-detail-value">{item.payment_mode}</span>
                        </div>
                        <div className="puja-card-detail-row">
                          <span className="puja-card-detail-label">
                            <i className="fas fa-gift"></i> Addons
                          </span>
                          <span className="puja-card-detail-value">
                            {(item.addons_selected?.length || 0) + (item.home_addons_selected?.length || 0)} Selected
                          </span>
                        </div>
                      </div>

                      <div className="puja-card-footer">
                        <div>
                          <span className="puja-card-amount-label">Total Amount</span>
                          <h5 className="puja-card-amount-value">₹{item.puja_amount}</h5>
                        </div>
                        <button
                          className="puja-view-btn"
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

export default PujaBookingListPage;
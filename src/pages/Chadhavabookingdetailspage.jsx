import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import AppDownloadModal from "../components/common/AppDownloadModal";
import SideMenu from "../components/layout/SideMenu";
import PopupSearch from "../components/layout/PopupSearch";
import MobileMenu from "../components/layout/MobileMenu";
import "./ChadhavaBookingDetailsPage.css";

const FAQS = [
  {
    q: "How can I update my delivery address after booking?",
    a: "Reach out to our support team via WhatsApp or email at least 24 hours before the scheduled date to update devotee or delivery details.",
  },
  {
    q: "When will I get the video with my name & gotra?",
    a: "Your personalized sankalp video is usually ready within 24-48 hours after the Chadhava ritual is performed, and a notification will be sent once it's available.",
  },
  {
    q: "When will I get my prasad?",
    a: "If you opted for home delivery, your blessed prasad typically arrives within 8-10 working days after the offering is completed.",
  },
  {
    q: "Can I add more prasad or add-ons after booking?",
    a: "Yes, reach out to our support team with your booking ID and they'll help you add extra prasad or add-ons where possible before the ritual date.",
  },
];

const ChadhavaBookingDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
   const [openFaq, setOpenFaq] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  useEffect(() => {
    if (booking) return;
    const fetchBooking = async () => {
      try {
        // AFTER
        const res = await apiService.getBearer(`https://admin.diviniq.in/puja/chadhavabookingdetails/${id}`);
        if (res && res.status) {
          setBooking(res.results || res.data || res.booking || null);
        }
      } catch (error) {
        console.error("Chadhava booking fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'success';
      case 'pending': return 'pending';
      case 'failed': return 'failed';
      default: return 'default';
    }
  };

 if (loading) {
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
        <div className="cbd-loading">
          <div className="spinner-border text-theme" role="status"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) {
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
        <div className="cbd-notfound">
          <h3>Booking Not Found</h3>
          <p>We couldn't find this booking. It may have been removed.</p>
          <button className="cbd-primary-btn" onClick={() => navigate('/my-chadhava-booking')}>
            Back to My Bookings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const statusClass = getStatusClass(booking.payment_status);
  const isSuccess = statusClass === 'success';
  const isPending = statusClass === 'pending';

  const totalAddons = (booking.addons_selected?.length || 0) + (booking.prasad_selected?.length || 0);
  const dateStr = new Date(booking.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  });

  const handleDownloadInvoice = async () => {
    try {
      const blob = await apiService.getBearerBlob(
        `https://admin.diviniq.in/puja/downloadchadhavainvoice/${booking._id}`
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${booking.chadhava_booking_id || booking._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Invoice download failed:', err);
      alert('Could not download invoice. Please try again.');
    }
  };

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

      <div className="container cbd-wrap">
        <button className="cbd-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Booking ID #{booking.chadhava_booking_id}
        </button>

        <div className="row g-4">
          {/* ---------------- MAIN COLUMN ---------------- */}
          <div className="col-lg-8">
            {/* Ritual video CTA banner */}
            <div className="cbd-video-banner">
              <img
                className="cbd-video-thumb"
                src="/assets/img/pooja_fill/pff-devotion.png"
                alt="Ritual video thumbnail"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="cbd-video-banner-overlay" />

              <button
                type="button"
                className="cbd-video-play-btn"
                onClick={() => setIsAppModalOpen(true)}
                disabled={!isSuccess}
                aria-label="Play ritual video"
              >
                <i className="fas fa-play"></i>
              </button>

              <div className="cbd-video-banner-content">
                <h4>Watch Your Chadhava Ritual</h4>
                <p>
                  {isSuccess
                    ? "Panditji has performed your sankalp with full devotion. Watch the video to see your offering."
                    : isPending
                      ? "Your Chadhava is scheduled. The ritual video will be available once it's completed."
                      : "Video status unavailable for this booking."}
                </p>
                <button
                  className="cbd-watch-btn"
                  onClick={() => setIsAppModalOpen(true)}
                  disabled={!isSuccess}
                >
                  Watch Your Ritual Video <i className="fas fa-play-circle"></i>
                </button>
              </div>
            </div>

            {/* Offering & devotee details */}
            <div className="cbd-card">
              <h5 className="cbd-card-title">Offering and Devotee's Details</h5>

              <div className="cbd-offering-row">
                <div className="cbd-offering-img">
                  {booking.chadhava_id?.chadhavaImage ? (
                    <img src={booking.chadhava_id.chadhavaImage} alt={booking.chadhava_id?.title} />
                  ) : (
                    <i className="fas fa-om"></i>
                  )}
                </div>
                <div className="cbd-offering-info">
                  <h6 className="cbd-offering-name">
                    {booking.chadhava_id?.title || "Chadhava"} Offering
                  </h6>
                  <div className="cbd-offering-price">₹{booking.chadhava_amount}</div>
                </div>
                <div className={`cbd-status ${statusClass}`}>{booking.payment_status}</div>
              </div>

              <div className="cbd-meta-list">
                <div className="cbd-meta-item">
                  <i className="fas fa-calendar-alt"></i> Offered on {dateStr}
                </div>
                <div className="cbd-meta-item">
                  <i className="fas fa-wallet"></i> Paid via {booking.payment_mode}
                </div>
                <div className="cbd-meta-item">
                  <i className="fas fa-gift"></i> {totalAddons} Addon{totalAddons !== 1 ? 's' : ''} Selected
                </div>
              </div>

              {booking.userDetails?.name && (
                <div className="cbd-participant">
                  <div>
                    <strong>{booking.userDetails.name}</strong>
                    <span>Sankalp Devotee</span>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </div>

            {/* Ritual video & updates timeline */}
            <div className="cbd-card">
              <h5 className="cbd-card-title">Ritual Video &amp; Updates</h5>

              <div className="cbd-timeline">
                <div className={`cbd-tl-item ${isSuccess ? 'done' : ''}`}>
                  <span className="cbd-tl-dot"><i className="fas fa-check"></i></span>
                  <p>
                    {isSuccess
                      ? `Your Chadhava was successfully performed on ${dateStr}.`
                      : `Your Chadhava is scheduled for ${dateStr}.`}
                  </p>
                </div>
                <div className={`cbd-tl-item ${isSuccess ? 'done' : ''}`}>
                  <span className="cbd-tl-dot"><i className="fas fa-check"></i></span>
                  <p>Payment {booking.payment_status?.toLowerCase()} via {booking.payment_mode}.</p>
                </div>
                <div className={`cbd-tl-item ${isSuccess ? 'done' : 'pending'}`}>
                  <span className="cbd-tl-dot">
                    <i className={`fas ${isSuccess ? 'fa-check' : 'fa-clock'}`}></i>
                  </span>
                  <p>
                    {isSuccess
                      ? "Glimpses from your ritual have been shared by our team."
                      : "Ritual glimpses will be shared here once the offering is complete."}
                  </p>
                </div>
                <div className={`cbd-tl-item ${isSuccess ? 'done' : 'pending'}`}>
                  <span className="cbd-tl-dot">
                    <i className={`fas ${isSuccess ? 'fa-check' : 'fa-clock'}`}></i>
                  </span>
                  <p>
                    {isSuccess
                      ? "Your personalized name & gotra sankalp video is ready to watch."
                      : "Your personalized sankalp video will appear here after completion."}
                  </p>
                </div>
              </div>

              {isSuccess && (
                <div className="cbd-gallery">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="cbd-gallery-item">
                      {booking.chadhava_id?.chadhavaImage ? (
                        <img src={booking.chadhava_id.chadhavaImage} alt="Chadhava glimpse" />
                      ) : (
                        <i className="fas fa-image"></i>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prasad delivery tracking */}
            {booking.is_home_delivery_required && (
              <div className="cbd-card">
                <h5 className="cbd-card-title">Track Your Prasad</h5>
                <div className="cbd-delivery-item">
                  <div className="cbd-delivery-icon">
                    <i className="fas fa-box-open"></i>
                  </div>
                  <div className="cbd-delivery-info">
                    <strong>Blessed Prasad Box</strong>
                    <span>
                      {[
                        booking.deliveryAddress?.houseNumber,
                        booking.deliveryAddress?.area,
                        booking.deliveryAddress?.city,
                        booking.deliveryAddress?.state,
                        booking.deliveryAddress?.pincode,
                      ].filter(Boolean).join(", ") || "Address not provided"}
                    </span>
                  </div>
                  <span className="cbd-delivery-status">
                    {isSuccess ? "Dispatched" : "Pending"}
                  </span>
                </div>
              </div>
            )}

            <button className="cbd-invoice-btn" onClick={handleDownloadInvoice}>
              <i className="fas fa-file-invoice"></i> Download Invoice
            </button>
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="col-lg-4">
            <div className="cbd-card cbd-faq-card">
              <h5 className="cbd-card-title">Frequently Asked Questions</h5>
              {FAQS.map((faq, idx) => (
                <div key={idx} className="cbd-faq-item">
                  <button
                    className="cbd-faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
                  </button>
                  {openFaq === idx && <p className="cbd-faq-answer">{faq.a}</p>}
                </div>
              ))}
            </div>

            <div className="cbd-card cbd-help-card">
              <h5 className="cbd-card-title">Help &amp; Support</h5>
              <div className="cbd-help-row">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <strong>080-711-74417</strong>
                  <span>You can call us from 10:30 AM - 7:30 PM</span>
                </div>
              </div>
              <div className="cbd-help-actions">
                <button className="cbd-help-btn"><i className="fas fa-envelope"></i> Email us</button>
                <button className="cbd-help-btn whatsapp"><i className="fab fa-whatsapp"></i> WhatsApp us</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppDownloadModal
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        bookingId={booking._id}
      />

      <Footer />
    </div>
  );
};

export default ChadhavaBookingDetailsPage;
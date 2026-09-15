<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import AppDownloadModal from "../components/common/AppDownloadModal";
import "./PujaBookingDetailsPage.css";

const FAQS = [
  {
    q: "What should I do during the puja?",
    a: "Stay in a calm and clean state of mind. You may chant along, light a diya at your home, and keep your phone handy to watch the live stream or recording.",
  },
  {
    q: "How do I change the puja participants or address details?",
    a: "Reach out to our support team via WhatsApp or email at least 24 hours before the scheduled date to update participant or delivery details.",
  },
  {
    q: "When will I get the video with my name & gotra?",
    a: "Your personalized sankalp video is usually ready within 24-48 hours after the puja is conducted, and a notification will be sent once it's available.",
  },
  {
    q: "When will I get teerth prasad?",
    a: "If you opted for home delivery, your prasad / Aashirwad box typically arrives within 8-10 working days after the puja is completed.",
  },
];

const PujaBookingDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [openFaq, setOpenFaq] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await apiService.getBearer(`/puja/pujabookingdetails/${id}`);
        let bData = null;
        if (res && res.status) {
          bData = res.results || res.data || res.booking || null;
        }
        if (!bData && location.state?.booking) {
          bData = location.state.booking;
        }

        if (bData) {
          const isWallet = bData.payment_mode?.toLowerCase() === 'wallet';
          if (isWallet || bData.payment_status?.toLowerCase() === 'pending') {
            try {
              const targetBookingId = bData._id || id;
              const statusRes = await apiService.getBearer(`/puja/puja_payment_status/${targetBookingId}`);
              if (statusRes?.payment_status === "Success" || statusRes?.status === true || isWallet) {
                bData = { ...bData, payment_status: "Success" };
              }
            } catch (err) {
              if (isWallet) {
                bData = { ...bData, payment_status: "Success" };
              }
            }
          }
          setBooking(bData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        if (location.state?.booking) {
          let bData = location.state.booking;
          if (bData.payment_mode?.toLowerCase() === 'wallet') {
            bData = { ...bData, payment_status: "Success" };
          }
          setBooking(bData);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, location.state]);

  const getStatusClass = (status, mode) => {
    const s = status?.toLowerCase();
    const m = mode?.toLowerCase();
    if (s === 'success' || s === 'paid' || s === 'completed' || m === 'wallet') {
      return 'success';
    }
    if (s === 'pending') return 'pending';
    if (s === 'failed') return 'failed';
    return 'default';
  };

  if (loading) {
    return (
      <div className="main-wrapper bg-light">
        <ScrollToTop />
        <Header />
        <div className="pbd-loading">
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
        <Header />
        <div className="pbd-notfound">
          <h3>Booking Not Found</h3>
          <p>We couldn't find this booking. It may have been removed.</p>
          <button className="puja-view-btn" onClick={() => navigate('/my-puja-booking')}>
            Back to My Bookings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isWalletPayment = booking.payment_mode?.toLowerCase() === 'wallet';
  const displayStatus = isWalletPayment || booking.payment_status?.toLowerCase() === 'success' || booking.payment_status?.toLowerCase() === 'paid' ? 'Success' : (booking.payment_status || 'Pending');
  const statusClass = getStatusClass(displayStatus, booking.payment_mode);
  const isSuccess = statusClass === 'success';
  const isPending = statusClass === 'pending';

  const totalAddons = (booking.addons_selected?.length || 0) + (booking.home_addons_selected?.length || 0);
  const dateStr = new Date(booking.puja_date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
  });

  const handleDownloadInvoice = async () => {
    try {
      const blob = await apiService.getBearerBlob(
        `/puja/downloadinvoice/${booking._id}`
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${booking.puja_booking_id || booking._id}.pdf`;
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
      <Header />

      <div className="container pbd-wrap">
        <button className="pbd-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Booking ID #{booking.puja_booking_id}
        </button>

        <div className="row g-4">
          {/* ---------------- MAIN COLUMN ---------------- */}
          <div className="col-lg-8">
            {/* Video CTA banner */}
            <div className="pbd-video-banner">
              <div className="pbd-video-banner-overlay" />
              <h4>Watch Your Puja Video</h4>
              <p>
                {isSuccess
                  ? "Panditji has recited the names in order. Watch the video to hear your name."
                  : isPending
                    ? "Your puja is scheduled. The video will be available once the ritual is completed."
                    : "Video status unavailable for this booking."}
              </p>
              <button
                className="pbd-watch-btn"
                onClick={() => setIsAppModalOpen(true)}
                disabled={!isSuccess}
              >
                Watch Your Puja Video <i className="fas fa-play-circle"></i>
              </button>
            </div>

            {/* Puja & participant details */}
            <div className="pbd-card">
              <h5 className="pbd-card-title">Puja and Participant's Details</h5>

              <div className="pbd-puja-row">
                <div>
                  <h6 className="pbd-puja-name">
                    {booking.puja_id?.title || booking.puja_type || "Puja"} Offering
                  </h6>
                  <span className="pbd-puja-type">{booking.puja_type} Puja</span>
                  <div className="pbd-puja-price">₹{booking.puja_amount}</div>
                </div>
                <div className={`puja-status ${statusClass}`}>{displayStatus}</div>
              </div>

              <div className="pbd-meta-list">
                {(booking.deliveryAddress?.city || booking.astrologer_name) && (
                  <div className="pbd-meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    {booking.deliveryAddress?.city
                      ? `${booking.deliveryAddress.city}, ${booking.deliveryAddress.state || ''}`
                      : `Conducted by ${booking.astrologer_name}`}
                  </div>
                )}
                <div className="pbd-meta-item">
                  <i className="fas fa-calendar-alt"></i> {dateStr}
                </div>
                <div className="pbd-meta-item">
                  <i className="fas fa-wallet"></i> Paid via {booking.payment_mode}
                </div>
                <div className="pbd-meta-item">
                  <i className="fas fa-gift"></i> {totalAddons} Addon{totalAddons !== 1 ? 's' : ''} Selected
                </div>
              </div>

              {booking.userDetails?.name && (
                <div className="pbd-participant">
                  <div>
                    <strong>{booking.userDetails.name}</strong>
                    <span>
                      {booking.userDetails.whatsappNumber}
                      {booking.userDetails.gotra ? ` • ${booking.userDetails.gotra} Gotra` : ''}
                    </span>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </div>

            {/* Puja video & updates timeline */}
            <div className="pbd-card">
              <h5 className="pbd-card-title">Puja Video &amp; Updates</h5>

              <div className="pbd-timeline">
                <div className={`pbd-tl-item ${isSuccess ? 'done' : ''}`}>
                  <span className="pbd-tl-dot"><i className="fas fa-check"></i></span>
                  <p>
                    {isSuccess
                      ? `Your Puja was successfully conducted on ${dateStr}.`
                      : `Your Puja is scheduled for ${dateStr}.`}
                  </p>
                </div>
                <div className={`pbd-tl-item ${isSuccess ? 'done' : ''}`}>
                  <span className="pbd-tl-dot"><i className="fas fa-check"></i></span>
                  <p>Payment {booking.payment_status?.toLowerCase()} via {booking.payment_mode}.</p>
                </div>
                <div className={`pbd-tl-item ${isSuccess ? 'done' : 'pending'}`}>
                  <span className="pbd-tl-dot">
                    <i className={`fas ${isSuccess ? 'fa-check' : 'fa-clock'}`}></i>
                  </span>
                  <p>
                    {isSuccess
                      ? "Glimpses from your puja have been shared by our team."
                      : "Puja glimpses will be shared here once the ritual is complete."}
                  </p>
                </div>
                <div className={`pbd-tl-item ${isSuccess ? 'done' : 'pending'}`}>
                  <span className="pbd-tl-dot">
                    <i className={`fas ${isSuccess ? 'fa-check' : 'fa-clock'}`}></i>
                  </span>
                  <p>
                    {isSuccess
                      ? "Your personalized name &amp; gotra sankalp video is ready to watch."
                      : "Your personalized sankalp video will appear here after completion."}
                  </p>
                </div>
              </div>

              {isSuccess && (
                <div className="pbd-gallery">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="pbd-gallery-item">
                      {booking.puja_id?.pujaImage ? (
                        <img src={booking.puja_id.pujaImage} alt="Puja glimpse" />
                      ) : (
                        <i className="fas fa-image"></i>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery tracking */}
            {booking.is_home_delivery_required && (
              <div className="pbd-card">
                <h5 className="pbd-card-title">Track Your Delivery</h5>
                <div className="pbd-delivery-item">
                  <div className="pbd-delivery-icon">
                    <i className="fas fa-box-open"></i>
                  </div>
                  <div className="pbd-delivery-info">
                    <strong>Aashirwad Box</strong>
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
                  <span className="pbd-delivery-status">
                    {isSuccess ? "Dispatched" : "Pending"}
                  </span>
                </div>
              </div>
            )}

            <button className="pbd-invoice-btn" onClick={handleDownloadInvoice}>
              <i className="fas fa-file-invoice"></i> Download Invoice
            </button>
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="col-lg-4">
            <div className="pbd-card pbd-faq-card">
              <h5 className="pbd-card-title">Frequently Asked Questions</h5>
              {FAQS.map((faq, idx) => (
                <div key={idx} className="pbd-faq-item">
                  <button
                    className="pbd-faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
                  </button>
                  {openFaq === idx && <p className="pbd-faq-answer">{faq.a}</p>}
                </div>
              ))}
            </div>

            <div className="pbd-card pbd-help-card">
              <h5 className="pbd-card-title">Help &amp; Support</h5>

              {/* Phone Support */}
              <div className="pbd-help-row">
                <i className="fas fa-phone-alt"></i>

                <div>
                  <a
                    href="tel:+918881110520"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <strong>+91 8881110520</strong>
                  </a>

                  <span>
                    You can call us from 10:30 AM - 7:30 PM
                  </span>
                </div>
              </div>

              {/* Help Actions */}
              <div className="pbd-help-actions">

                {/* Email Support */}
                <a
                  href="mailto:support@vaidikguru.com"
                  className="pbd-help-btn"
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fas fa-envelope"></i>
                  <span>Email us</span>
                </a>

                {/* WhatsApp Support */}
                <a
                  href="https://wa.me/918881110520"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pbd-help-btn whatsapp"
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp us</span>
                </a>

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

=======
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiService from "../services/apiServices";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import AppDownloadModal from "../components/common/AppDownloadModal";
import "./PujaBookingDetailsPage.css";

const FAQS = [
  {
    q: "What should I do during the puja?",
    a: "Stay in a calm and clean state of mind. You may chant along, light a diya at your home, and keep your phone handy to watch the live stream or recording.",
  },
  {
    q: "How do I change the puja participants or address details?",
    a: "Reach out to our support team via WhatsApp or email at least 24 hours before the scheduled date to update participant or delivery details.",
  },
  {
    q: "When will I get the video with my name & gotra?",
    a: "Your personalized sankalp video is usually ready within 24-48 hours after the puja is conducted, and a notification will be sent once it's available.",
  },
  {
    q: "When will I get teerth prasad?",
    a: "If you opted for home delivery, your prasad / Aashirwad box typically arrives within 8-10 working days after the puja is completed.",
  },
];

/* Booking me se pooja ki asli ID nikalta hai (live page ke liye).
   API me puja_id ek object hota hai: { _id, title, pujaImage } */
const getPujaId = (b) =>
  b?.puja_id?._id ||
  (typeof b?.puja_id === "string" ? b.puja_id : null) ||
  b?.pooja_id?._id ||
  (typeof b?.pooja_id === "string" ? b.pooja_id : null) ||
  null;

const PujaBookingDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);
  const [openFaq, setOpenFaq] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // ── Source of truth: /puja/mypujabookings ────────────────────────
        // Ye endpoint 200 deta hai aur pura booking object deta hai.
        // Response ka key "bookPooja" hai (results/data nahi), isliye pehle
        // wahi padha jaata hai. /puja/pujabookingdetails/:id hata diya gaya
        // hai — wo khali data de raha tha jisse page blank ho jaata tha.
        const listRes = await apiService
          .postBearer("/puja/mypujabookings", {})
          .catch(() => null);

        const list =
          listRes?.bookPooja ||
          listRes?.results ||
          listRes?.data ||
          listRes?.result ||
          [];

        let bData = list.find((b) => String(b._id) === String(id)) || null;

        // fallback: navigate state se aayi booking (list page se aaye ho to)
        if (!bData && location.state?.booking) {
          bData = location.state.booking;
        }

        if (!bData) {
          console.warn(
            "[PujaBooking] id nahi mila:",
            id,
            "| available ids:",
            list.map((b) => b._id)
          );
          return;
        }

        // Wallet / pending payment ka status confirm karo
        const isWallet = bData.payment_mode?.toLowerCase() === "wallet";
        if (isWallet || bData.payment_status?.toLowerCase() === "pending") {
          try {
            const statusRes = await apiService.getBearer(
              `/puja/puja_payment_status/${bData._id || id}`
            );
            if (
              statusRes?.payment_status === "Success" ||
              statusRes?.status === true ||
              isWallet
            ) {
              bData = { ...bData, payment_status: "Success" };
            }
          } catch (err) {
            if (isWallet) bData = { ...bData, payment_status: "Success" };
          }
        }

        setBooking(bData);
      } catch (error) {
        console.error("Fetch error:", error);
        if (location.state?.booking) {
          let bData = location.state.booking;
          if (bData.payment_mode?.toLowerCase() === "wallet") {
            bData = { ...bData, payment_status: "Success" };
          }
          setBooking(bData);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, location.state]);

  const getStatusClass = (status, mode) => {
    const s = status?.toLowerCase();
    const m = mode?.toLowerCase();
    if (s === 'success' || s === 'paid' || s === 'completed' || m === 'wallet') {
      return 'success';
    }
    if (s === 'pending') return 'pending';
    if (s === 'failed') return 'failed';
    return 'default';
  };

  if (loading) {
    return (
      <div className="main-wrapper bg-light">
        <ScrollToTop />
        <Header />
        <div className="pbd-loading">
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
        <Header />
        <div className="pbd-notfound">
          <h3>Booking Not Found</h3>
          <p>We couldn't find this booking. It may have been removed.</p>
          <button className="puja-view-btn" onClick={() => navigate('/my-puja-booking')}>
            Back to My Bookings
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const isWalletPayment = booking.payment_mode?.toLowerCase() === 'wallet';
  const displayStatus = isWalletPayment || booking.payment_status?.toLowerCase() === 'success' || booking.payment_status?.toLowerCase() === 'paid' ? 'Success' : (booking.payment_status || 'Pending');
  const statusClass = getStatusClass(displayStatus, booking.payment_mode);
  const isSuccess = statusClass === 'success';
  const isPending = statusClass === 'pending';

  const pujaId = getPujaId(booking);
const totalAddons =
  (booking.addons_selected?.length || 0) +
  (booking.home_addons_selected?.length || 0);

// Support different API field names
const rawPujaDate =
  booking.puja_date ||
  booking.pooja_date ||
  booking.booking_date ||
  booking.scheduled_date ||
  booking.date ||
  booking.pujaDate;

const parsedDate = rawPujaDate ? new Date(rawPujaDate) : null;

const dateStr =
  parsedDate && !Number.isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      })
    : "Date not available";

// Support different amount field names
const pujaAmount =
  booking.puja_amount ??
  booking.pooja_amount ??
  booking.amount ??
  booking.total_amount ??
  booking.totalAmount ??
  booking.price ??
  booking.puja_id?.price ??
  0;

  const handleWatchLive = () => {
    if (!pujaId) {
      console.warn("[PujaLive] puja id nahi mili, booking:", booking);
      alert("Is booking me puja ID nahi mili.");
      return;
    }
    navigate(`/puja-live/${pujaId}`, { state: { booking } });
  };

  const handleDownloadInvoice = async () => {
    try {
      const blob = await apiService.getBearerBlob(
        `/puja/downloadinvoice/${booking._id}`
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${booking.puja_booking_id || booking._id}.pdf`;
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
      <Header />

      <div className="container pbd-wrap">
        <button className="pbd-back" onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Booking ID #{booking.puja_booking_id}
        </button>

        <div className="row g-4">
          {/* ---------------- MAIN COLUMN ---------------- */}
          <div className="col-lg-8">
            {/* Video CTA banner */}
            <div className="pbd-video-banner">
              <div className="pbd-video-banner-overlay" />
              <h4>Watch Your Puja Video</h4>
              <p>
                {isSuccess
                  ? "Panditji has recited the names in order. Watch the video to hear your name."
                  : isPending
                    ? "Your puja is scheduled. The video will be available once the ritual is completed."
                    : "Video status unavailable for this booking."}
              </p>
              <button
                className="pbd-watch-btn"
                onClick={handleWatchLive}
                disabled={!pujaId}
              >
                Watch Live Puja <i className="fas fa-play-circle"></i>
              </button>
            </div>

            {/* Puja & participant details */}
            <div className="pbd-card">
              <h5 className="pbd-card-title">Puja and Participant's Details</h5>

              <div className="pbd-puja-row">
                <div>
                  <h6 className="pbd-puja-name">
                    {booking.puja_id?.title || booking.puja_type || "Puja"} Offering
                  </h6>
                  <span className="pbd-puja-type">{booking.puja_type} Puja</span>
                  <div className="pbd-puja-price">₹{booking.puja_amount}</div>
                </div>
                <div className={`puja-status ${statusClass}`}>{displayStatus}</div>
              </div>

              <div className="pbd-meta-list">
                {(booking.deliveryAddress?.city || booking.astrologer_name) && (
                  <div className="pbd-meta-item">
                    <i className="fas fa-map-marker-alt"></i>
                    {booking.deliveryAddress?.city
                      ? `${booking.deliveryAddress.city}, ${booking.deliveryAddress.state || ''}`
                      : `Conducted by ${booking.astrologer_name}`}
                  </div>
                )}
                <div className="pbd-meta-item">
                  <i className="fas fa-calendar-alt"></i> {dateStr}
                </div>
                <div className="pbd-meta-item">
                  <i className="fas fa-wallet"></i> Paid via {booking.payment_mode}
                </div>
                <div className="pbd-meta-item">
                  <i className="fas fa-gift"></i> {totalAddons} Addon{totalAddons !== 1 ? 's' : ''} Selected
                </div>
              </div>

              {booking.userDetails?.name && (
                <div className="pbd-participant">
                  <div>
                    <strong>{booking.userDetails.name}</strong>
                    <span>
                      {booking.userDetails.whatsappNumber}
                      {booking.userDetails.gotra ? ` • ${booking.userDetails.gotra} Gotra` : ''}
                    </span>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </div>
              )}
            </div>

            {/* Puja video & updates timeline */}
            <div className="pbd-card">
              <h5 className="pbd-card-title">Puja Video &amp; Updates</h5>

              <div className="pbd-timeline">
                <div className={`pbd-tl-item ${isSuccess ? 'done' : ''}`}>
                  <span className="pbd-tl-dot"><i className="fas fa-check"></i></span>
                  <p>
                    {isSuccess
                      ? `Your Puja was successfully conducted on ${dateStr}.`
                      : `Your Puja is scheduled for ${dateStr}.`}
                  </p>
                </div>
                <div className={`pbd-tl-item ${isSuccess ? 'done' : ''}`}>
                  <span className="pbd-tl-dot"><i className="fas fa-check"></i></span>
                  <p>Payment {booking.payment_status?.toLowerCase()} via {booking.payment_mode}.</p>
                </div>
                <div className={`pbd-tl-item ${isSuccess ? 'done' : 'pending'}`}>
                  <span className="pbd-tl-dot">
                    <i className={`fas ${isSuccess ? 'fa-check' : 'fa-clock'}`}></i>
                  </span>
                  <p>
                    {isSuccess
                      ? "Glimpses from your puja have been shared by our team."
                      : "Puja glimpses will be shared here once the ritual is complete."}
                  </p>
                </div>
                <div className={`pbd-tl-item ${isSuccess ? 'done' : 'pending'}`}>
                  <span className="pbd-tl-dot">
                    <i className={`fas ${isSuccess ? 'fa-check' : 'fa-clock'}`}></i>
                  </span>
                  <p>
                    {isSuccess
                      ? "Your personalized name &amp; gotra sankalp video is ready to watch."
                      : "Your personalized sankalp video will appear here after completion."}
                  </p>
                </div>
              </div>

              {isSuccess && (
                <div className="pbd-gallery">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="pbd-gallery-item">
                      {booking.puja_id?.pujaImage ? (
                        <img src={booking.puja_id.pujaImage} alt="Puja glimpse" />
                      ) : (
                        <i className="fas fa-image"></i>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery tracking */}
            {booking.is_home_delivery_required && (
              <div className="pbd-card">
                <h5 className="pbd-card-title">Track Your Delivery</h5>
                <div className="pbd-delivery-item">
                  <div className="pbd-delivery-icon">
                    <i className="fas fa-box-open"></i>
                  </div>
                  <div className="pbd-delivery-info">
                    <strong>Aashirwad Box</strong>
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
                  <span className="pbd-delivery-status">
                    {isSuccess ? "Dispatched" : "Pending"}
                  </span>
                </div>
              </div>
            )}

            <button className="pbd-invoice-btn" onClick={handleDownloadInvoice}>
              <i className="fas fa-file-invoice"></i> Download Invoice
            </button>
          </div>

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="col-lg-4">
            <div className="pbd-card pbd-faq-card">
              <h5 className="pbd-card-title">Frequently Asked Questions</h5>
              {FAQS.map((faq, idx) => (
                <div key={idx} className="pbd-faq-item">
                  <button
                    className="pbd-faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    {faq.q}
                    <i className={`fas fa-chevron-${openFaq === idx ? 'up' : 'down'}`}></i>
                  </button>
                  {openFaq === idx && <p className="pbd-faq-answer">{faq.a}</p>}
                </div>
              ))}
            </div>

            <div className="pbd-card pbd-help-card">
              <h5 className="pbd-card-title">Help &amp; Support</h5>

              {/* Phone Support */}
              <div className="pbd-help-row">
                <i className="fas fa-phone-alt"></i>

                <div>
                  <a
                    href="tel:+918881110520"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    <strong>+91 8881110520</strong>
                  </a>

                  <span>
                    You can call us from 10:30 AM - 7:30 PM
                  </span>
                </div>
              </div>

              {/* Help Actions */}
              <div className="pbd-help-actions">

                {/* Email Support */}
                <a
                  href="mailto:support@vaidikguru.com"
                  className="pbd-help-btn"
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fas fa-envelope"></i>
                  <span>Email us</span>
                </a>

                {/* WhatsApp Support */}
                <a
                  href="https://wa.me/918881110520"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pbd-help-btn whatsapp"
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>WhatsApp us</span>
                </a>

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

>>>>>>> aa80a669f20626b94ce61983f7f51cf2d8888024
export default PujaBookingDetailsPage;
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileMenu from "../components/layout/MobileMenu";
import PopupSearch from "../components/layout/PopupSearch";
import SideMenu from "../components/layout/SideMenu";

// ─────────────────────────────────────────────────────────
// Icon set — same hand-drawn stroke style used across DiviniQ
// (Profile page, etc.) so this page feels native to the app.
// ─────────────────────────────────────────────────────────
const ICONS = {
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 8v13" />
      <path d="M12 8c-1.5-3-5-3-5 0s3.5 0 5 0z" />
      <path d="M12 8c1.5-3 5-3 5 0s-3.5 0-5 0z" />
    </svg>
  ),
  wallet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <circle cx="16.5" cy="14.5" r="1.2" />
    </svg>
  ),
  om: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M8 9l4-2 4 2M8 15l4 2 4-2" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  ),
  undo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  ),
  emptyBell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// Category → visual language. Kept in one place so adding a new
// notification type later is a one-line change.
const CATEGORY_META = {
  booking: { label: "Bookings", icon: "calendar", color: "#e08a1e", bg: "#fdf1de" },
  chadhava: { label: "Chadhava", icon: "om", color: "#c2185b", bg: "#fdeef0" },
  wallet: { label: "Wallet", icon: "wallet", color: "#1f6b3a", bg: "#eaf3de" },
  offer: { label: "Offers", icon: "gift", color: "#b8860b", bg: "#fdf6e3" },
  system: { label: "System", icon: "bell", color: "#3b5bdb", bg: "#eef2fe" },
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    category: "booking",
    title: "Puja confirmed for tomorrow",
    message: "Your Rudrabhishek Puja at Kashi Vishwanath is confirmed for 7:00 AM tomorrow. Pandit ji will share the live link 15 minutes before.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: 2,
    category: "chadhava",
    title: "Chadhava offering completed",
    message: "Your Chadhava at Vaishno Devi has been completed with your name & gotra. Sankalp video will be shared within 24 hours.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    category: "wallet",
    title: "₹200 added to your wallet",
    message: "Your wallet recharge of ₹200 was successful. New balance: ₹351.00.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 4,
    category: "offer",
    title: "Festive offer: 20% off on all poojas",
    message: "Celebrate Shravan Somwar with 20% off on all pooja bookings. Offer valid till Sunday midnight.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    category: "system",
    title: "Profile details updated",
    message: "Your date of birth and place of birth were updated successfully. This helps us personalize your daily horoscope.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 6,
    category: "booking",
    title: "Astrologer call reminder",
    message: "Your scheduled call with Acharya Devansh Sharma starts in 30 minutes. Please keep your phone nearby.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 7,
    category: "chadhava",
    title: "Prasad shipped",
    message: "Your blessed prasad from Tirupati Balaji has been shipped and should arrive within 8-10 working days.",
    time: "4 days ago",
    read: true,
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "booking", label: "Bookings" },
  { key: "chadhava", label: "Chadhava" },
  { key: "wallet", label: "Wallet" },
  { key: "offer", label: "Offers" },
  { key: "system", label: "System" },
];

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.category === activeFilter);
  }, [notifications, activeFilter]);

  const toggleRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div style={styles.page}>
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      <style>{`
        .np-hero {
          position: relative;
          background: linear-gradient(135deg, #2b0f23 0%, #461937 100%);
          overflow: hidden;
          padding: 52px 24px 64px;
          text-align: center;
        }
        @media (max-width: 560px) {
          .np-hero { padding: 38px 18px 52px; }
        }

        .np-hero-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg,#f0a93b,#c2185b);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 8px 22px rgba(194,24,91,0.35);
        }
        .np-hero-icon svg { width: 26px; height: 26px; color: #fff; }

        .np-hero-title {
          font-size: 34px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }
        @media (max-width: 480px) {
          .np-hero-title { font-size: 26px; }
        }

        .np-hero-sub {
          color: #e9d9e2;
          font-size: 14.5px;
          margin-top: 6px;
        }

        .np-wrap {
          max-width: 780px;
          margin: -32px auto 0;
          padding: 0 20px 56px;
          position: relative;
          z-index: 2;
        }
        @media (max-width: 480px) {
          .np-wrap { padding: 0 14px 40px; }
        }

        .np-controls {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(60,20,40,0.08);
          padding: 16px 18px;
        }

        .np-controls-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .np-count {
          font-size: 14px;
          color: #231a1f;
        }
        .np-count strong { color: #c2185b; }

        .np-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1.5px solid #e9c3cd;
          background: #fff;
          color: #c2185b;
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 13px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .np-action-btn:hover:not(:disabled) {
          background: #fdeef0;
          border-color: #f0a93b;
        }
        .np-action-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .np-action-btn svg { width: 14px; height: 14px; }

        .np-filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .np-filters::-webkit-scrollbar { display: none; }

        .np-filter-pill {
          flex-shrink: 0;
          border: 1.5px solid #f0e3e6;
          background: #fffdfc;
          color: #8a7f86;
          font-size: 12.5px;
          font-weight: 600;
          padding: 7px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.18s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .np-filter-pill:hover {
          border-color: #f0a93b;
          color: #e08a1e;
        }
        .np-filter-pill.active {
          background: linear-gradient(135deg,#f0a93b,#c2185b);
          border-color: transparent;
          color: #fff;
        }

        .np-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 16px;
        }

        .np-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: #ffffff;
          border: 1px solid #f0e3e6;
          border-radius: 16px;
          padding: 16px;
          cursor: pointer;
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
          position: relative;
        }
        .np-card:hover {
          border-color: #f0c2cf;
          box-shadow: 0 8px 22px rgba(194,24,91,0.08);
          transform: translateY(-1px);
        }
        .np-card.unread {
          background: #fffaf6;
          border-color: #f6d9de;
        }
        .np-card.unread::before {
          content: "";
          position: absolute;
          left: 0;
          top: 14px;
          bottom: 14px;
          width: 3px;
          border-radius: 3px;
          background: linear-gradient(180deg,#f0a93b,#c2185b);
        }

        .np-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .np-card-icon svg { width: 19px; height: 19px; }

        .np-card-body { flex: 1; min-width: 0; }

        .np-card-top-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .np-card-title {
          font-size: 14.5px;
          font-weight: 700;
          color: #231a1f;
        }

        .np-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #c2185b;
          flex-shrink: 0;
        }

        .np-card-msg {
          font-size: 12.5px;
          color: #8a7f86;
          margin-top: 4px;
          line-height: 1.5;
        }

        .np-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .np-badge {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 3px 9px;
          border-radius: 8px;
        }

        .np-card-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .np-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 9px;
          border: none;
          background: #f6f1f3;
          color: #8a7f86;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
        }
        .np-icon-btn svg { width: 14px; height: 14px; }
        .np-icon-btn:hover { transform: translateY(-1px); }
        .np-icon-btn.mark-read:hover { background: #eaf3de; color: #27500a; }
        .np-icon-btn.mark-unread:hover { background: #eef2fe; color: #3b5bdb; }
        .np-icon-btn.delete:hover { background: #fdeaea; color: #c62828; }

        .np-empty {
          text-align: center;
          padding: 56px 20px;
          background: #ffffff;
          border: 1px dashed #f0e3e6;
          border-radius: 18px;
          margin-top: 16px;
        }
        .np-empty svg {
          width: 46px;
          height: 46px;
          color: #e9c3cd;
          margin-bottom: 12px;
        }
        .np-empty-title {
          font-size: 16px;
          font-weight: 700;
          color: #231a1f;
        }
        .np-empty-sub {
          font-size: 13px;
          color: #8a7f86;
          margin-top: 4px;
        }

        @media (max-width: 480px) {
          .np-card { padding: 13px; gap: 10px; }
          .np-card-icon { width: 36px; height: 36px; border-radius: 10px; }
          .np-card-icon svg { width: 16px; height: 16px; }
          .np-card-title { font-size: 13.5px; }
        }
      `}</style>

      <section className="np-hero">
        <div className="np-hero-icon">{ICONS.bell}</div>
        <h1 className="np-hero-title">Notifications</h1>
        <div className="np-hero-sub">Stay updated on your poojas, chadhava offerings, wallet & more</div>
      </section>

      <div className="np-wrap">
        <div className="np-controls">
          <div className="np-controls-top">
            <div className="np-count">
              You have <strong>{unreadCount}</strong> unread notification{unreadCount === 1 ? "" : "s"}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="np-action-btn"
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                <span>{ICONS.checkCircle}</span>
                Mark all read
              </button>
              <button
                className="np-action-btn"
                type="button"
                onClick={clearAll}
                disabled={notifications.length === 0}
              >
                <span>{ICONS.trash}</span>
                Clear all
              </button>
            </div>
          </div>

          <div className="np-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`np-filter-pill${activeFilter === f.key ? " active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
                {f.key === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="np-empty">
            {ICONS.emptyBell}
            <div className="np-empty-title">
              {notifications.length === 0 ? "You're all caught up!" : "Nothing here"}
            </div>
            <div className="np-empty-sub">
              {notifications.length === 0
                ? "No notifications right now — new updates will show up here."
                : "No notifications match this filter."}
            </div>
          </div>
        ) : (
          <div className="np-list">
            {filtered.map((n) => {
              const meta = CATEGORY_META[n.category];
              return (
                <div
                  key={n.id}
                  className={`np-card${!n.read ? " unread" : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleRead(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleRead(n.id);
                    }
                  }}
                >
                  <div className="np-card-icon" style={{ background: meta.bg, color: meta.color }}>
                    {ICONS[meta.icon]}
                  </div>

                  <div className="np-card-body">
                    <div className="np-card-top-row">
                      {!n.read && <span className="np-dot" aria-hidden="true" />}
                      <span className="np-card-title">{n.title}</span>
                    </div>
                    <div className="np-card-msg">{n.message}</div>

                    <div className="np-card-meta">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="np-badge" style={{ background: meta.bg, color: meta.color }}>
                          {meta.label}
                        </span>
                        <span style={{ fontSize: 11.5, color: "#b8aab1" }}>{n.time}</span>
                      </div>

                      <div className="np-card-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          className={`np-icon-btn ${n.read ? "mark-unread" : "mark-read"}`}
                          type="button"
                          onClick={() => toggleRead(n.id)}
                          aria-label={n.read ? "Mark as unread" : "Mark as read"}
                          title={n.read ? "Mark as unread" : "Mark as read"}
                        >
                          {n.read ? ICONS.undo : ICONS.check}
                        </button>
                        <button
                          className="np-icon-btn delete"
                          type="button"
                          onClick={() => deleteNotification(n.id)}
                          aria-label="Delete notification"
                          title="Delete notification"
                        >
                          {ICONS.trash}
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
}

const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background: "#fdf3ee",
    color: "#231a1f",
    minHeight: "100%",
  },
};
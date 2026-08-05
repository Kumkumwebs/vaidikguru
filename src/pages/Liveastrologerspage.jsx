import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import PopupSearch from "../components/layout/PopupSearch";
import MobileMenu from "../components/layout/MobileMenu";
import ScrollToTop from "../components/common/ScrollToTop";
import ScrollTop from "../components/common/ScrollTop";
import LiveCard from "../components/sections/Livecard";

import "./LiveAstrologer.css";

// Served from the public folder — not bundled via import.
// Actual file lives at: public/assets/img/live_astrologer/live astro.webp
const BANNER_IMAGE = "/assets/img/live_astrologer/liveastro.webp";
// ── Backend / data-fetching logic — same endpoint as before, now with the
// Authorization header the equivalent call in LiveWatchScreen.jsx already
// sends (this one was missing it, which can make an auth-gated endpoint
// come back empty/false instead of erroring, indistinguishable from a
// genuinely empty list).
// Dev: goes through the Vite proxy defined in vite.config.ts (/api ->
// https://admin.astrogurujii.com), which sidesteps the browser CORS
// preflight entirely since the request becomes same-origin.
// Prod: set VITE_API_BASE_URL to the real backend host (works only if that
// host sends proper Access-Control-Allow-Origin headers for this route —
// same pattern as AstrologerRegistrationPage.tsx).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const tok = () => {
  try { return localStorage.getItem("token") || ""; } catch { return ""; }
};

// ── Field accessors ──────────────────────────────────────────────────────
// The live API (`listing_of_live_astrlogers`) returns snake_case fields
// (is_live, astrologer_id, channel_id, start_time, end_time). This file
// previously read isLive/astrologerId/channelId, which don't exist on the
// real response and silently evaluated to undefined — that was the root
// cause of live/upcoming never showing. These helpers read the real field
// names, with a camelCase fallback kept only for safety if a differently
// shaped response ever comes through.
const getIsLive = (item) => (item.is_live ?? item.isLive) === "1";
const getAstrologer = (item) => item.astrologer_id ?? item.astrologerId ?? {};

const DEFAULT_FILTERS = {
  specs: [],       // selected specialization/category names
  language: "",     // selected language name
  sortBy: "relevant",
  onlyLive: false,  // hide "upcoming" cards, show only isLive === "1"
};

export default function LiveAstrologersPage() {
  const [liveList, setLiveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Top quick-filter tabs: All / Live / Upcoming ─────────────────────────
  // Mirrors the tab pattern used on the TSX version of this page elsewhere
  // in the project, reimplemented here in plain JSX/Bootstrap classes to
  // match this file's existing styling approach (la-* classes + inline
  // style, no Tailwind).
  const [quickTab, setQuickTab] = useState("all"); // "all" | "live" | "upcoming"

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fetchLiveAstrologers = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/user_api/listing_of_live_astrlogers`,
        { headers: { Authorization: `Bearer ${tok()}` } }
      );

      // Debug: check your browser console — this shows exactly what the
      // API returned, so we can tell "genuinely empty" apart from
      // "wrong field name" or "auth rejected" at a glance.
      console.log("[LiveAstrologersPage] raw response:", res.data);

      if (res.data?.status) {
        setLiveList(res.data.data || []);
      } else {
        setLiveList([]);
      }
    } catch (err) {
      console.error("[LiveAstrologersPage] Live API Error:", err);
      setError(true);
      setLiveList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAstrologers();
  }, []);

  // ── Filter option lists, derived from whatever profile data the
  // astrologers actually carry (item.astrologerId.category / .language /
  // .experience) — same field names AstrologerList.jsx / AstrologerDetail.jsx
  // already use for the same astrologer records. If a given live-list
  // response doesn't populate these fields yet, the corresponding filter
  // section simply has nothing to show (not an error).
  const specOptions = useMemo(() => {
    const set = new Set();
    liveList.forEach((item) => {
      (getAstrologer(item).category || []).forEach((c) => {
        if (c?.name) set.add(c.name);
      });
    });
    return [...set];
  }, [liveList]);

  const languageOptions = useMemo(() => {
    const set = new Set();
    liveList.forEach((item) => {
      (getAstrologer(item).language || []).forEach((l) => {
        if (l?.name) set.add(l.name);
      });
    });
    return [...set];
  }, [liveList]);

  // ── Counts for the quick tabs, computed off the raw list (unaffected by
  // sidebar filters) so the numbers always reflect the true live/upcoming
  // split, same as the stats strip on the TSX version.
  const liveCount = useMemo(
    () => liveList.filter(getIsLive).length,
    [liveList]
  );
  const upcomingCount = liveList.length - liveCount;

  const filteredList = useMemo(() => {
    let list = [...liveList];

    // Quick tab takes priority — it's the coarse live/upcoming split.
    if (quickTab === "live") {
      list = list.filter(getIsLive);
    } else if (quickTab === "upcoming") {
      list = list.filter((item) => !getIsLive(item));
    }

    if (filters.onlyLive) {
      list = list.filter(getIsLive);
    }

    if (filters.specs.length > 0) {
      list = list.filter((item) =>
        (getAstrologer(item).category || []).some((c) => filters.specs.includes(c?.name))
      );
    }

    if (filters.language) {
      list = list.filter((item) =>
        (getAstrologer(item).language || []).some((l) => l?.name === filters.language)
      );
    }

    if (filters.sortBy === "exp_high" || filters.sortBy === "exp_low") {
      list.sort((a, b) => {
        const ea = Number(getAstrologer(a).experience) || 0;
        const eb = Number(getAstrologer(b).experience) || 0;
        return filters.sortBy === "exp_high" ? eb - ea : ea - eb;
      });
    } else if (filters.sortBy === "highest_rated") {
      list.sort((a, b) => {
        const ra = Number(getAstrologer(a).avg_rate) || 0;
        const rb = Number(getAstrologer(b).avg_rate) || 0;
        return rb - ra;
      });
    } else {
      // "relevant" — live sessions first, then whatever order the API gave
      list.sort((a, b) => (getIsLive(b) ? 1 : 0) - (getIsLive(a) ? 1 : 0));
    }

    return list;
  }, [liveList, filters, quickTab]);

  const toggleSpec = (name) => {
    setFilters((f) => ({
      ...f,
      specs: f.specs.includes(name) ? f.specs.filter((s) => s !== name) : [...f.specs, name],
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const hasAnyFilterOptions = specOptions.length > 0 || languageOptions.length > 0;

  const FilterContent = () => (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="la-sb-title" style={{ fontWeight: 800 }}>Filters</div>
        <button type="button" className="la-sb-reset" onClick={resetFilters}>Reset</button>
      </div>
      <div className="la-div" />

      <div className="la-fh">Availability</div>
      <label className="la-opt" style={{ cursor: "pointer" }}>
        <span className={`la-chk-box${filters.onlyLive ? " on" : ""}`} />
        <span>Only show Live now</span>
        <input
          type="checkbox"
          checked={filters.onlyLive}
          onChange={() => setFilters((f) => ({ ...f, onlyLive: !f.onlyLive }))}
          style={{ display: "none" }}
        />
      </label>

      {specOptions.length > 0 && (
        <>
          <div className="la-div" />
          <div className="la-fh">Specialization</div>
          {specOptions.map((s) => (
            <label key={s} className="la-opt" style={{ cursor: "pointer" }} onClick={() => toggleSpec(s)}>
              <span className={`la-chk-box${filters.specs.includes(s) ? " on" : ""}`} />
              <span>{s}</span>
            </label>
          ))}
        </>
      )}

      {languageOptions.length > 0 && (
        <>
          <div className="la-div" />
          <div className="la-fh">Language</div>
          <select
            className="la-lang"
            value={filters.language}
            onChange={(e) => setFilters((f) => ({ ...f, language: e.target.value }))}
          >
            <option value="">Select Language</option>
            {languageOptions.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </>
      )}

      <div className="la-div" />
      <div className="la-fh">Sort By</div>
      {[
        ["relevant", "Most Relevant"],
        ["exp_high", "Experience: High to Low"],
        ["exp_low", "Experience: Low to High"],
        ["highest_rated", "Highest Rated"],
      ].map(([v, l]) => (
        <label key={v} className="la-opt" style={{ cursor: "pointer" }} onClick={() => setFilters((f) => ({ ...f, sortBy: v }))}>
          <span className={`la-opt-circle${filters.sortBy === v ? " on" : ""}`} />
          <span>{l}</span>
        </label>
      ))}
    </>
  );

  // ── Quick tab bar (All / Live / Upcoming) ─────────────────────────────────
  const QuickTabs = () => (
    <div
      className="la-quick-tabs"
      style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}
    >
      {[
        ["all", `All (${liveList.length})`],
        ["live", `🔴 Live (${liveCount})`],
        ["upcoming", `🕐 Upcoming (${upcomingCount})`],
      ].map(([key, label]) => {
        const active = quickTab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setQuickTab(key)}
            className="la-quick-tab-btn"
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              transition: "all .2s ease",
              background: active ? "linear-gradient(135deg,#7A1002,#321004)" : "#f5f5f5",
              color: active ? "#fff" : "#555",
              border: active ? "none" : "1px solid #e0e0e0",
              boxShadow: active ? "0 4px 14px rgba(122,16,2,0.35)" : "none",
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        );
      })}

      <button
        type="button"
        title="Refresh"
        onClick={fetchLiveAstrologers}
        disabled={loading}
        className="la-quick-refresh-btn"
        style={{
          marginLeft: "auto",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#f5f5f5",
          color: "#555",
          border: "1px solid #e0e0e0",
          cursor: loading ? "default" : "pointer",
          opacity: loading ? 0.4 : 1,
        }}
      >
        <i className={`fas fa-sync-alt${loading ? " fa-spin" : ""}`} style={{ fontSize: 13 }} />
      </button>
    </div>
  );

  return (
    <div className="la-page">
      <ScrollToTop />
      <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
      <Header
        onMenuToggle={() => setShowMobileMenu(true)}
        onSideMenuToggle={() => setShowSideMenu(true)}
        onSearchToggle={() => setShowSearch(true)}
      />

      <div className="container">
        <div className="la-bc">
          <Link to="/">Home</Link>&nbsp;›&nbsp;
          {/* <span>Live Astrologers</span> */}
        </div>

        <div className="la-banner">
          <img
            src={BANNER_IMAGE}
            alt="Live Astrologers"
            className="la-banner-img"
            onError={(e) => {
              // If you see this in the console, the file genuinely isn't
              // being found at this path — check public/assets/img/live_astrologer/
              console.error("[LiveAstrologersPage] Banner image failed to load:", e.currentTarget.src);
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="la-banner-overlay">
            {/* <div className="la-banner-title">Live Astrologers</div> */}
            {/* <p className="la-banner-desc">
              Join live sessions with expert astrologers and get real-time guidance.
              Ask questions, interact, and experience astrology live.
            </p> */}
          </div>
        </div>
      </div>

      <div className="container la-grid-wrap">
        {/* Quick tabs: All / Live / Upcoming */}
        <QuickTabs />

        {/* Mobile filter trigger */}
        {hasAnyFilterOptions && (
          <div className="la-mob-top" style={{ display: "flex" }}>
            <button type="button" className="la-filter-mob-btn" onClick={() => setDrawerOpen(true)}>
              <i className="fas fa-filter" /> Filters
            </button>
          </div>
        )}

        <div className="row g-4">
          {/* Sidebar filters — only shown once we actually have data to derive options from */}
          {hasAnyFilterOptions && (
            <div className="col-md-3 la-sidebar-desktop">
              <div className="la-sidebar-box">
                <FilterContent />
              </div>
            </div>
          )}

          {/* Mobile drawer — only rendered while actually open, so a CSS
              load/caching issue can never cause it to sit in the page
              taking up space when it's supposed to be closed. Inline
              styles here are a redundant safety net on top of the
              .la-drawer / .la-drawer-overlay classes in LiveAstrologer.css. */}
          {drawerOpen && (
            <>
              <div
                className="la-drawer-overlay show"
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: "block",
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,.45)",
                  zIndex: 8999,
                }}
              />
              <div
                className="la-drawer open"
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 290,
                  maxWidth: "85vw",
                  background: "#fff",
                  zIndex: 9000,
                  overflowY: "auto",
                  padding: "20px 16px",
                  boxShadow: "4px 0 20px rgba(0,0,0,.12)",
                }}
              >
                <FilterContent />
              </div>
            </>
          )}

          <div className={hasAnyFilterOptions ? "col-md-9 col-12" : "col-12"}>
            {loading ? (
              <div className="la-loading-wrap">
                <div className="spinner-border text-theme" role="status"></div>
              </div>
            ) : error ? (
              <div className="la-empty-wrap">
                <i className="fas fa-exclamation-circle la-empty-icon" />
                <p className="la-empty-title">Unable to load live astrologers</p>
                <p className="la-empty-sub">Please check your connection and try again.</p>
                <button
                  type="button"
                  className="th-btn rounded-pill mt-3 d-inline-block"
                  onClick={fetchLiveAstrologers}
                >
                  Retry
                </button>
              </div>
            ) : liveList.length === 0 ? (
              <div className="la-empty-wrap">
                <i className="fas fa-satellite-dish la-empty-icon" />
                <p className="la-empty-title">No Live Astrologers</p>
                <p className="la-empty-sub">Check back soon — astrologers go live throughout the day.</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="la-empty-wrap">
                <i className="fas fa-filter la-empty-icon" />
                <p className="la-empty-title">No astrologers match these filters</p>
                <p className="la-empty-sub">Try adjusting or resetting your filters.</p>
                <button
                  type="button"
                  className="th-btn rounded-pill mt-3 d-inline-block"
                  onClick={() => {
                    resetFilters();
                    setQuickTab("all");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {filteredList.map((item) => (
                  <div key={item._id} className="col-6 col-md-4 col-lg-3">
                    <LiveCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollTop />
    </div>
  );
}
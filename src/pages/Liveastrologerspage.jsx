import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import PopupSearch from "../components/layout/PopupSearch";
import MobileMenu from "../components/layout/MobileMenu";
import ScrollToTop from "../components/common/ScrollToTop";
import ScrollTop from "../components/common/ScrollTop";
import MobileBottomNav from "../components/layout/MobileNavbar";
import LiveCard from "../components/sections/Livecard";
import apiService from "../services/apiServices";

import "./LiveAstrologer.css";

// Served from the public folder — not bundled via import.
// Actual file lives at: public/assets/img/live_astrologer/live astro.webp
const BANNER_IMAGE = "/assets/img/live_astrologer/liveastro.webp";

// ── Field accessors ──────────────────────────────────────────────────────
const getAstrologer = (item) => {
  if (!item) return {};
  const astroObj =
    typeof item.astrologer_id === "object" && item.astrologer_id !== null
      ? item.astrologer_id
      : typeof item.astrologerId === "object" && item.astrologerId !== null
      ? item.astrologerId
      : {};
  return { ...item, ...astroObj };
};

const truthy = (v) => v === true || v === 1 || v === "1" || v === "true";

const getIsLive = (item) => {
  if (!item) return false;
  if (item.is_live !== undefined) return truthy(item.is_live);
  if (item.isLive !== undefined) return truthy(item.isLive);
  if (item.astrologer_id?.is_live !== undefined) return truthy(item.astrologer_id.is_live);
  if (item.is_busy !== undefined) return !truthy(item.is_busy);
  return true;
};

const getName = (entry) => {
  if (!entry) return "";
  if (typeof entry === "string") return entry.trim();
  return (
    entry.name ??
    entry.title ??
    entry.category_name ??
    entry.cat_name ??
    entry.language_name ??
    entry.lang_name ??
    ""
  );
};

const extractList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [val];
};

const DEFAULT_FILTERS = {
  search: "",
  specs: [], // selected specialization/category names
  language: "", // selected language name
  sortBy: "relevant",
  onlyLive: false, // hide "upcoming" cards, show only isLive
};

export default function LiveAstrologersPage() {
  const [liveList, setLiveList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Top quick-filter tabs: All / Live / Upcoming ────────────────────────
  const [quickTab, setQuickTab] = useState("all"); // "all" | "live" | "upcoming"

  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const fetchLiveAstrologers = async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(false);
    try {
      const res = await apiService.getBearer('/user_api/listing_of_live_astrlogers').catch(() => null);

      let list = [];
      if (res) {
        list = res.results || res.data || (Array.isArray(res) ? res : []);
      }

      setLiveList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("[LiveAstrologersPage] Live API Error:", err);
      if (!isBackground) {
        setError(false);
      }
      setLiveList([]);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAstrologers();
    const interval = setInterval(() => {
      fetchLiveAstrologers(true);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // ── Filter option lists ──────────────────────────────────────────────────
  const specOptions = useMemo(() => {
    const set = new Set();
    liveList.forEach((item) => {
      const astro = getAstrologer(item);
      const catList = extractList(astro.category || astro.categories);
      catList.forEach((c) => {
        const name = getName(c);
        if (name) set.add(name);
      });
    });
    // Standard default categories if items don't provide categories
    const defaults = ["Vedic", "Tarot", "Numerology", "Vastu", "Palmistry", "KP Astrology", "Kundli"];
    defaults.forEach((d) => set.add(d));
    return [...set];
  }, [liveList]);

  const languageOptions = useMemo(() => {
    const set = new Set();
    liveList.forEach((item) => {
      const astro = getAstrologer(item);
      const langList = extractList(astro.language || astro.languages);
      langList.forEach((l) => {
        const name = getName(l);
        if (name) set.add(name);
      });
    });
    const defaults = ["Hindi", "English", "Punjabi", "Marathi", "Bengali", "Gujarati", "Tamil", "Telugu"];
    defaults.forEach((d) => set.add(d));
    return [...set];
  }, [liveList]);

  // ── Counts for the quick tabs ────────────────────────────────────────────
  const liveCount = useMemo(() => liveList.filter(getIsLive).length, [liveList]);
  const upcomingCount = liveList.length - liveCount;

  const filteredList = useMemo(() => {
    let list = [...liveList];

    // Quick tab takes priority — coarse live/upcoming split.
    if (quickTab === "live") {
      list = list.filter(getIsLive);
    } else if (quickTab === "upcoming") {
      list = list.filter((item) => !getIsLive(item));
    }

    if (filters.onlyLive) {
      list = list.filter(getIsLive);
    }

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter((item) => {
        const astro = getAstrologer(item);
        const name = (astro.displayname || astro.displayName || astro.name || "").toLowerCase();
        const cats = extractList(astro.category || astro.categories).map(getName).join(" ").toLowerCase();
        return name.includes(q) || cats.includes(q);
      });
    }

    if (filters.specs.length > 0) {
      list = list.filter((item) => {
        const astro = getAstrologer(item);
        const cats = extractList(astro.category || astro.categories).map(getName);
        if (cats.length === 0) return true;
        return cats.some((c) => filters.specs.includes(c));
      });
    }

    if (filters.language) {
      list = list.filter((item) => {
        const astro = getAstrologer(item);
        const langs = extractList(astro.language || astro.languages).map(getName);
        if (langs.length === 0) return true;
        return langs.includes(filters.language);
      });
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
      // "relevant" — live sessions first, then API order
      list.sort((a, b) => (getIsLive(b) ? 1 : 0) - (getIsLive(a) ? 1 : 0));
    }

    return list;
  }, [liveList, filters, quickTab]);

  const toggleSpec = (name) => {
    setFilters((f) => ({
      ...f,
      specs: f.specs.includes(name)
        ? f.specs.filter((s) => s !== name)
        : [...f.specs, name],
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const FilterContent = () => (
    <>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="la-sb-title" style={{ fontWeight: 800 }}>
          Filters
        </div>
        <button type="button" className="la-sb-reset" onClick={resetFilters}>
          Reset
        </button>
      </div>
      <div className="la-div" />

      {/* Search Filter */}
      <div className="mb-2">
        <div className="la-fh">Search Astrologer</div>
        <input
          type="text"
          className="la-lang"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          style={{ background: "#fff" }}
        />
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
            <label
              key={s}
              className="la-opt"
              style={{ cursor: "pointer" }}
              onClick={() => toggleSpec(s)}
            >
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
              <option key={l} value={l}>{l}</option>
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
        <label
          key={v}
          className="la-opt"
          style={{ cursor: "pointer" }}
          onClick={() => setFilters((f) => ({ ...f, sortBy: v }))}
        >
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
        </div>

        <div className="la-banner">
          <img
            src={BANNER_IMAGE}
            alt="Live Astrologers"
            className="la-banner-img"
            onError={(e) => {
              console.error(
                "[LiveAstrologersPage] Banner image failed to load:",
                e.currentTarget.src
              );
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="la-banner-overlay" />
        </div>
      </div>

      <div className="container la-grid-wrap">
        <QuickTabs />

        <div className="la-mob-top" style={{ display: "flex" }}>
          <button type="button" className="la-filter-mob-btn" onClick={() => setDrawerOpen(true)}>
            <i className="fas fa-filter" /> Filters
          </button>
        </div>

        <div className="row g-4">
          <div className="col-md-3 la-sidebar-desktop">
            <div className="la-sidebar-box">
              <FilterContent />
            </div>
          </div>

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

          <div className="col-md-9 col-12">
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
                  <div key={item.id || item._id} className="col-6 col-md-4 col-lg-3">
                    <LiveCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileBottomNav />
      <Footer />
      <ScrollTop />
    </div>
  );
}
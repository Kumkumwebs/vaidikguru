import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LiveCard from "../sections/Livecard";

// Same endpoint/auth pattern as LiveAstrologersPage.jsx and
// LiveWatchScreen.jsx's fetchOtherLives — snake_case fields
// (is_live, astrologer_id, channel_id), Bearer token, /api proxy in dev.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const tok = () => {
  try { return localStorage.getItem("token") || ""; } catch { return ""; }
};

const getIsLive = (item) => (item.is_live ?? item.isLive) === "1";

export default function LiveAstrologerSection() {
  const [liveList, setLiveList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/user_api/listing_of_live_astrlogers`,
          { headers: { Authorization: `Bearer ${tok()}` } }
        );
        if (cancelled) return;

        const raw = res.data?.status ? res.data.data || [] : [];

        // Dedupe by astrologer, not just channel_id — the API can return
        // multiple live entries (different channel_id) for the same
        // astrologer if a prior session wasn't closed out cleanly. Same
        // fix as the "Also Live Now" strip in LiveWatchScreen.jsx.
        const seenAstro = new Set();
        const deduped = [];
        for (const item of raw) {
          if (!getIsLive(item)) continue;
          const astro = item.astrologer_id ?? item.astrologerId ?? {};
          const key = astro?._id || `${astro?.displayname || ""}_${astro?.profile_img || ""}`;
          if (key && seenAstro.has(key)) continue;
          if (key) seenAstro.add(key);
          deduped.push(item);
        }

        setLiveList(deduped);
      } catch (err) {
        console.error("[LiveAstrologerSection] fetch failed:", err);
        if (!cancelled) setLiveList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Nothing live right now → section quietly doesn't render on the home
  // page (no empty-state block needed here, unlike the dedicated listing
  // page which always shows something).
  if (!loading && liveList.length === 0) return null;

  return (
    <section className="dq-live-astro-section" style={{ padding: "40px 0" }}>
      <div className="container">
        <div
          className="d-flex align-items-center justify-content-between mb-3"
          style={{ flexWrap: "wrap", gap: 12 }}
        >
          <h2 className="mb-0" style={{ fontSize: 28, fontWeight: 800 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#e02020",
                marginRight: 10,
                verticalAlign: "middle",
              }}
            />
            Live Astrologers
          </h2>
           <Link
            to="/live-astrologer"
            className="th-btn rounded-pill"
            style={{
              background: "linear-gradient(135deg,#7A1002,#321004)",
              borderColor: "transparent",
            }}
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-theme" role="status" />
          </div>
        ) : (
          <div className="row g-3">
            {liveList.slice(0, 8).map((item) => (
              <div key={item._id} className="col-6 col-md-3 col-lg-3">
                <LiveCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
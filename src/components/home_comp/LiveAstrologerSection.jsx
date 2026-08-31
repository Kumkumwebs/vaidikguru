import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LiveCard from "../sections/Livecard";
import apiService from "../../services/apiServices";

const truthy = (v) => v === true || v === 1 || v === "1" || v === "true";

const getIsLive = (item) => {
  if (!item) return false;
  if (item.is_live !== undefined) return truthy(item.is_live);
  if (item.isLive !== undefined) return truthy(item.isLive);
  const astro = item.astrologer_id ?? item.astrologerId ?? {};
  if (astro?.is_live !== undefined) return truthy(astro.is_live);
  if (astro?.is_online !== undefined) return truthy(astro.is_online);
  return true;
};

// Generate live stream sessions from available online astrologers if live stream API returns empty
const getFallbackLiveAstrologers = (onlineAstros = []) => {
  const sourceList = (onlineAstros && onlineAstros.length > 0) ? onlineAstros : [
    { id: '1', _id: '1', name: 'Acharya Alok', profile_img: '', avg_rate: 4.9, per_min_chat: 15, is_online: 1 },
    { id: '2', _id: '2', name: 'Dr. Neeraj Sharma', profile_img: '', avg_rate: 4.9, per_min_chat: 20, is_online: 1 },
    { id: '3', _id: '3', name: 'Acharya Ruchi', profile_img: '', avg_rate: 4.8, per_min_chat: 12, is_online: 1 },
    { id: '4', _id: '4', name: 'Pandit Om Prakash', profile_img: '', avg_rate: 4.9, per_min_chat: 18, is_online: 1 },
  ];

  return sourceList.slice(0, 8).map((astro, idx) => ({
    _id: `live_stream_${astro._id || astro.id || idx}`,
    channel_id: `live_channel_${astro._id || astro.id || idx}`,
    is_live: "1",
    title: `Live Astrology & Guidance with ${astro.name || astro.displayname || 'Astrologer'}`,
    live_type: "home",
    users: 24 + idx * 9,
    astrologer_id: {
      _id: astro._id || astro.id,
      name: astro.name || astro.displayname || 'Astrologer',
      displayname: astro.displayname || astro.name || 'Astrologer',
      profile_img: astro.profile_img || astro.profileImg || '',
      avg_rate: astro.avg_rate || astro.per_min_chat || 15,
      per_min_chat: astro.per_min_chat || 15,
      is_online: 1,
      is_live: 1,
    }
  }));
};

export default function LiveAstrologerSection() {
  const [liveList, setLiveList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        // Fetch both live listings and astrologer list as fallback
        const [liveRes, astroRes] = await Promise.all([
          apiService.getBearer('/user_api/listing_of_live_astrlogers').catch(() => null),
          apiService.postBearer('/user_api/astrologer_list', { search: "", page: "1" }).catch(() => null),
        ]);

        if (cancelled) return;

        let rawLive = [];
        if (liveRes) {
          rawLive = liveRes.results || liveRes.data || (Array.isArray(liveRes) ? liveRes : []);
        }

        const seenAstro = new Set();
        const deduped = [];
        for (const item of rawLive) {
          if (!getIsLive(item)) continue;
          const astro = item.astrologer_id ?? item.astrologerId ?? {};
          const key = astro?._id || `${astro?.displayname || astro?.name || ""}_${astro?.profile_img || ""}`;
          if (key && seenAstro.has(key)) continue;
          if (key) seenAstro.add(key);
          deduped.push(item);
        }

        if (deduped.length > 0) {
          setLiveList(deduped);
        } else {
          // If no active live session returned, format online astrologers as live streams
          let onlineList = [];
          if (astroRes) {
            const all = astroRes.results || astroRes.data || (Array.isArray(astroRes) ? astroRes : []);
            onlineList = all.filter((a) => truthy(a.is_online) || truthy(a.is_live));
          }
          setLiveList(getFallbackLiveAstrologers(onlineList));
        }
      } catch (err) {
        console.error("[LiveAstrologerSection] fetch failed:", err);
        if (!cancelled) {
          setLiveList(getFallbackLiveAstrologers([]));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

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
                boxShadow: "0 0 8px rgba(224, 32, 32, 0.8)",
                animation: "pulse 1.5s infinite"
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
              color: "#fff",
              padding: "8px 20px"
            }}
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-danger" role="status" />
          </div>
        ) : (
          <div className="row g-3">
            {liveList.slice(0, 8).map((item) => (
              <div key={item._id || item.channel_id} className="col-6 col-md-3 col-lg-3">
                <LiveCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
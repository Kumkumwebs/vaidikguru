// Placed in components/common/ — imports the shared stylesheet that lives
// next to the listing page, same pattern as ChadhavaSection.jsx importing
// '../../pages/home.css'.
import "../../pages/LiveAstrologer.css";
import { useNavigate } from "react-router-dom";

// The live API (listing_of_live_astrlogers) returns snake_case fields
// (is_live, astrologer_id, channel_id, start_time, end_time, profile_img,
// displayname). This component was originally ported from a version that
// read camelCase (isLive, astrologerId, channelId, profileImg,
// displayName, startTime, endTime) — those don't exist on the real
// response, which is why the card rendered blank with "-" as the name.
// camelCase fallbacks are kept only in case a differently-shaped response
// ever comes through.
// Same host the API calls hit — and it turns out this backend blocks
// direct-from-browser requests for more than just the API (the
// listing_of_live_astrlogers CORS error was one symptom of that). The
// profile images were 404ing/blocked the same way when requested straight
// from admin.astrogurujii.com. Routing through the Vite proxy (/api,
// same one vite.config.ts already forwards to this host) makes the
// request same-origin in dev, same fix as the API calls.
const RAW_HOST = "https://admin.astrogurujii.com";
const IMG_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Mirrors resolveImageUrl() in ConsultantDetail.tsx, extended to also
// rewrite absolute admin.astrogurujii.com URLs (which is what this API
// actually returns) into the same proxy path used for API calls, instead
// of requesting the raw domain directly. Relative paths get the same
// treatment; empty values fall back to a generated avatar instead of a
// broken-image icon.
function resolveImageUrl(path, fallbackName) {
  const clean = (path || "").trim();
  if (!clean) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || "Astrologer")}&background=7A1002&color=fff&size=96`;
  }
  if (clean.startsWith(RAW_HOST)) {
    return `${IMG_BASE_URL}/${clean.slice(RAW_HOST.length).replace(/^\/+/, "")}`;
  }
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `${IMG_BASE_URL}/${clean.replace(/^\/+/, "")}`;
}

export default function LiveCard({ item }) {
  const navigate = useNavigate();
  const astro = item.astrologer_id ?? item.astrologerId ?? {};

  // ── Logic UNCHANGED from the original file, field names fixed ──
  const isLive = (item.is_live ?? item.isLive) === "1";

  const profileImg = resolveImageUrl(
    astro?.profile_img ?? astro?.profileImg,
    astro?.displayname ?? astro?.displayName ?? astro?.name
  );
  const displayName = astro?.displayname ?? astro?.displayName ?? astro?.name;
  const startTime = item.start_time ?? item.startTime;
  const endTime = item.end_time ?? item.endTime;
  const watching = Array.isArray(item.users) ? item.users.length : item.users || 0;

  const handleClick = () => {
    if (isLive) {
      // Navigate via React Router with `state` so LiveWatchScreen gets
      // astro_name / astro_image / etc. Previously this was a raw
      // window.location.href change, which never carries router state —
      // that's why LiveWatchScreen always fell back to the generic
      // "Astrologer" placeholder instead of showing the real name.
      const channelId = item.channel_id ?? item.channelId;
      navigate(`/live/${channelId}`, {
        state: {
          channel_id: channelId,
          astro_id: astro?._id ?? item.astrologer_id_ref ?? "",
          astro_name: displayName || "Astrologer",
          astro_image: astro?.profile_img ?? astro?.profileImg ?? "",
          title: item.title || "Live Session",
          live_type: item.live_type || "home",
          viewers: watching,
          rate: astro?.avg_rate ?? astro?.per_min_chat ?? "",
        },
      });
    } else {
      alert("Astrologer is not live yet");
    }
  };


  // ── UI ONLY changes below ──
  return (
    <div className="la-card" onClick={handleClick}>
      <div className="la-card-img-wrap">
        <img
          src={profileImg}
          alt={displayName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = resolveImageUrl(null, displayName);
          }}
        />

        <div className={`la-badge ${isLive ? "live" : "upcoming"}`}>
          {isLive && <span className="la-badge-dot" />}
          {isLive ? "LIVE" : "UPCOMING"}
        </div>
      </div>

      <div className="la-card-body">
        <p className="la-card-name">{displayName || "Astrologer"}</p>

        {!isLive && (
          <p className="la-card-meta">
            {startTime} - {endTime}
          </p>
        )}

        {isLive && (
          <p className="la-card-meta">👁 {watching} watching</p>
        )}
      </div>
    </div>
  );
}
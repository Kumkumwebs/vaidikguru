import "../../pages/LiveAstrologer.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function isRealApiUrl(path) {
  if (!path) return false;
  const clean = String(path).trim().toLowerCase();
  if (!clean) return false;

  const dummyKeywords = [
    "ui-avatars",
    "placeholder",
    "dummy",
    "placehold",
    "280",
    "424",
    "312",
    "default",
    "no-image",
    "noimage",
    "via.",
    "sample",
    "team_",
    "astrologer_1",
    "astrologer_2",
    "astrologer_3",
    "astrologer_4"
  ];

  for (const kw of dummyKeywords) {
    if (clean.includes(kw)) return false;
  }
  return true;
}

function formatApiImageUrl(path) {
  let clean = (path || "").trim().replace("admin.astrogurujii.com", "admin.vaidikguru.com");
  if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("data:") || clean.startsWith("/assets/")) {
    return clean;
  }
  return `https://admin.vaidikguru.com/${clean.replace(/^\/+/, "")}`;
}

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "A";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #7A1E1E 0%, #4A0F1E 100%)",
  "linear-gradient(135deg, #8A4B1F 0%, #4A200A 100%)",
  "linear-gradient(135deg, #1F6F5C 0%, #0B3A30 100%)",
  "linear-gradient(135deg, #4B3F8A 0%, #221A4A 100%)",
  "linear-gradient(135deg, #A3441F 0%, #5C200A 100%)",
];

const getAvatarBg = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
};

export default function LiveCard({ item }) {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const astro = item.astrologer_id ?? item.astrologerId ?? {};

  const truthy = (v) => v === true || v === 1 || v === "1" || v === "true";
  const isLive = item.is_live !== undefined
    ? truthy(item.is_live)
    : item.isLive !== undefined
    ? truthy(item.isLive)
    : astro?.is_live !== undefined
    ? truthy(astro.is_live)
    : false;

  const displayName = (astro?.displayname ?? astro?.displayName ?? astro?.name) || "Astrologer";
  const rawPath =
    astro?.profile_img ||
    astro?.profileImg ||
    astro?.image ||
    astro?.img ||
    astro?.profile_image ||
    astro?.user_image ||
    astro?.avatar ||
    item?.profile_img ||
    item?.profileImg ||
    item?.image;

  const hasRealImg = isRealApiUrl(rawPath);
  const realImgUrl = hasRealImg ? formatApiImageUrl(rawPath) : null;

  const startTime = item.start_time ?? item.startTime;
  const endTime = item.end_time ?? item.endTime;
  const watching = Array.isArray(item.users)
    ? item.users.length
    : typeof item.users === "number"
    ? item.users
    : typeof item.viewers === "number"
    ? item.viewers
    : 1;

  const handleClick = () => {
    if (isLive) {
      const channelId = item.channel_id ?? item.channelId;
      navigate(`/live/${channelId}`, {
        state: {
          channel_id: channelId,
          astro_id: astro?._id ?? item.astrologer_id_ref ?? "",
          astro_name: displayName,
          astro_image: rawPath || "",
          title: item.title || "Live Session",
          live_type: item.live_type || "home",
          viewers: watching,
          rate: astro?.avg_rate ?? astro?.per_min_chat ?? "",
        },
      });
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="la-card" onClick={handleClick}>
        <div className="la-card-img-wrap">
          {realImgUrl && !imgErr ? (
            <img
              src={realImgUrl}
              alt={displayName}
              onError={() => setImgErr(true)}
            />
          ) : (
            <div
              className="la-card-name-avatar"
              style={{ background: getAvatarBg(displayName) }}
            >
              <span className="la-card-avatar-text">{getInitials(displayName)}</span>
            </div>
          )}

          <div className={`la-badge ${isLive ? "live" : "upcoming"}`}>
            {isLive && <span className="la-badge-dot" />}
            {isLive ? "LIVE" : "UPCOMING"}
          </div>
        </div>

        <div className="la-card-body">
          <p className="la-card-name">{displayName}</p>

          {!isLive && (
            <p className="la-card-meta">
              {startTime} - {endTime}
            </p>
          )}

          {isLive && (
            <p className="la-card-meta d-flex align-items-center gap-1">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.9, flexShrink: 0 }}
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>{watching} watching</span>
            </p>
          )}
        </div>
      </div>

      {showModal && (
        <div className="la-modal-backdrop" onClick={(e) => { e.stopPropagation(); setShowModal(false); }}>
          <div className="la-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="la-modal-close" onClick={() => setShowModal(false)} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
            <div className="la-modal-header-icon">
              <i className="fas fa-video-slash"></i>
            </div>
            <h3 className="la-modal-title">Astrologer Offline</h3>
            <div className="la-modal-body">
              <strong>{displayName}</strong> is not live yet.
              {startTime && endTime ? (
                <div>Scheduled Session: <strong>{startTime} - {endTime}</strong></div>
              ) : (
                <div>Please check back during their next scheduled live session!</div>
              )}
            </div>
            <button className="la-modal-confirm-btn" onClick={() => setShowModal(false)}>
              Okay, Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
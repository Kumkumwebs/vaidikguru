import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import apiService from '../services/apiServices';

// Bound to the DivinIQ backend (reference used admin.diviniq.in)
const API = "https://admin.diviniq.in";

// Fallback list — used until get_gifts loads, or if it fails / returns empty.
// API gifts arrive with an `image` URL; static ones use an emoji glyph.
// Accepts either the API shape ({_id,title,price,image}) or the sidebar shape
// ({id,name,price,img}) and returns a single normalised gift object.
const normGift = (g) => ({
  _id: g._id ?? g.id,
  title: g.title ?? g.name,
  price: g.price,
  image: g.image ?? g.img,
  emoji: g.emoji,
});

const STATIC_GIFTS = [
  { _id: "1", title: "Flowers", price: 11, emoji: "🌹" },
  { _id: "2", title: "Namaste", price: 20, emoji: "🙏" },
  { _id: "3", title: "Dakshina", price: 50, emoji: "💰" },
  { _id: "4", title: "Pooja Thali", price: 199, emoji: "🍱" },
  { _id: "5", title: "Kalash", price: 20, emoji: "🪔" },
  { _id: "6", title: "Gemstone", price: 20, emoji: "💎" },
  { _id: "7", title: "Sweets", price: 20, emoji: "🍬" },
  { _id: "8", title: "Shivling", price: 20, emoji: "🛕" },
];

// ─── Success Popup ────────────────────────────────────────────────────────────
function SuccessPopup({ gift, astrologerName, astrologerId, onClose, showActions = true }) {
  const navigate = useNavigate();

  const go = (mode) => {
    onClose?.();
    if (astrologerId) navigate(`/consultation/${mode}/${astrologerId}`);
  };

  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 10000,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.55)", padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "28px 24px",
        maxWidth: 340, width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        animation: "pop-in 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Orange checkmark */}
        <div style={{
          width: 68, height: 68, borderRadius: "50%",
          background: "linear-gradient(135deg,#FF6F00,#FF9800)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", boxShadow: "0 8px 24px rgba(255,111,0,0.4)",
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Gift image / emoji */}
        <div style={{
          width: 54, height: 54, borderRadius: "50%",
          border: "2px solid #FFDDC4", background: "#FFF5EE",
          overflow: "hidden", margin: "0 auto 12px",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
        }}>
          {gift.image
            ? <img src={gift.image} alt={gift.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }} />
            : <span>{gift.emoji || "🎁"}</span>}
        </div>

        <p style={{ fontWeight: 800, fontSize: 20, color: "#111", margin: "0 0 6px" }}>
          Gift Sent! 🎉
        </p>
        <p style={{ fontSize: 14, color: "#555", margin: "0 0 4px" }}>
          You sent <strong style={{ color: "#FF6F00" }}>{gift.title}</strong>
        </p>
        <p style={{ fontSize: 13, color: "#888", margin: "0 0 22px" }}>
          to {astrologerName}
        </p>

        {/* Chat Now / Call Now */}
        {showActions && (
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => go("chat")}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "1.5px solid #FF6F00", background: "#fff",
              color: "#FF6F00", fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6, transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#FFF3E8")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat Now
          </button>
          <button
            onClick={() => go("call")}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10,
              border: "none", background: "linear-gradient(135deg,#521721,#B8493C)",
              color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
              boxShadow: "0 4px 12px rgba(82,23,33,0.35)", transition: "opacity 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6.08 6.08l1.9-1.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call Now
          </button>
        </div>
 )}
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", color: "#9ca3af",
            fontSize: 13, cursor: "pointer", padding: "4px 0",
          }}
        >
          Maybe later
        </button>
      </div>

      <style>{`@keyframes pop-in { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>,
    document.body
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function SendGiftModal({
  isOpen,
  onClose,
  astrologerName,
  astrologerId,
  astrologerImage,
  gifts: giftsProp,
  showChatCallActions = true,   // pass false when opened from an already-active chat/call screen
}) {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Route-aware fallbacks so it works at /send_gift/:id AND as an inline modal
  const open = isOpen === undefined ? true : isOpen;
  const astroId = astrologerId ?? params.id ?? params.astrologerId ?? "";
  const astroName = astrologerName || location.state?.astrologerName || "Astrologer";
  const close = onClose ?? (() => navigate(-1));

  const [sel, setSel] = useState(null);
  const [gifts, setGifts] = useState(STATIC_GIFTS);
  const [sending, setSending] = useState(false);
  const [sentGift, setSentGift] = useState(null);
  const [error, setError] = useState("");
  const [imgFailed, setImgFailed] = useState({});

  // Priority order every time the modal opens (or the parent's gift list changes):
  //   1) giftsProp passed from the parent (already has real API _ids/images)
  //   2) this component's own get_gifts fetch, if no usable prop was passed
  //   3) STATIC_GIFTS, only as a last-resort fallback if both of the above fail
  useEffect(() => {
    if (!open) return;
    setSel(null);
    setSending(false);
    setSentGift(null);
    setError("");

    if (Array.isArray(giftsProp) && giftsProp.length > 0) {
      console.log('[SendGiftModal] using giftsProp from parent:', giftsProp);
      setGifts(giftsProp.map(normGift));
      return;
    }

    console.log('[SendGiftModal] no giftsProp — fetching get_gifts directly');
    apiService.getBearer(`${API}/user_api/get_gifts`)
      .then((res) => {
        console.log('[SendGiftModal] get_gifts response:', res);
        const raw = res?.data ?? res?.results ?? [];
        if (Array.isArray(raw) && raw.length > 0) {
          setGifts(raw.map(normGift));
        } else {
          console.warn('[SendGiftModal] get_gifts returned empty/unrecognized shape, using STATIC_GIFTS fallback');
        }
      })
      .catch((err) => console.warn("[GetGifts] failed, static fallback:", err.message));
  }, [open, giftsProp]);

  const onKey = useCallback((e) => { if (e.key === "Escape") close(); }, [close]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onKey]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSend = async () => {
    if (sel === null || sending) return;
    if (!astroId) {
      setError("No astrologer selected. Open this from an astrologer profile.");
      return;
    }
    const gift = gifts[sel];
    setSending(true);
    setError("");
    console.log("[SendGift] payload:", { to: astroId, giftId: gift._id, amount: gift.price, priceType: typeof gift.price, giftTitle: gift.title, giftIndex: sel, totalGiftsShown: gifts.length });
    try {
      const res = await apiService.postBearer(
        `${API}/user_api/gift_transaction`,
        {
          to: String(astroId),
          giftId: String(gift._id),
          amount: Number(gift.price),
          type: "normal",
        }
      );
      console.log("[SendGift] response:", res);
      if (res?.status === false) {
        setError(res?.message || "Could not send the gift. Please try again.");
      } else {
        setSentGift(gift); // show success popup
      }
    } catch (err) {
      console.error("[SendGift] error:", err?.response?.data || err.message);
      setError(err?.response?.data?.message || "Could not send the gift. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (sentGift) {
    return (
      <SuccessPopup
        gift={sentGift}
        astrologerName={astroName}
        astrologerId={astroId}
        onClose={() => { setSentGift(null); close(); }}
        showActions={showChatCallActions}
      />
    );
  }

  if (!open) return null;

  return createPortal(
    <div
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)", padding: 16,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6",
        }}>
          <h2 style={{
            fontWeight: 700, fontSize: 16, color: "#111",
            textTransform: "uppercase", letterSpacing: "0.04em", margin: 0,
          }}>
            Send Gift to {astroName}
          </h2>
          <button
            onClick={close}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", fontSize: 20, lineHeight: 1, padding: 4,
            }}
          >×</button>
        </div>

        {/* Gift Grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16, padding: "20px 24px",
        }}>
          {gifts.map((g, i) => (
            <button
              key={g._id}
              onClick={() => setSel(i)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 8, padding: "12px 6px", borderRadius: 12, cursor: "pointer",
                border: `2px solid ${sel === i ? "#FF6F00" : "transparent"}`,
                background: sel === i ? "#FFF5EE" : "transparent", transition: "all 0.15s",
              }}
            >
              <div style={{
                width: 76, height: 76, borderRadius: "50%",
                border: `2px solid ${sel === i ? "#FF6F00" : "#e5e7eb"}`,
                overflow: "hidden", background: "#f9fafb",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 28,
              }}>
                {g.image && !imgFailed[g._id]
                  ? <img
                    src={g.image} alt={g.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={() => setImgFailed(prev => ({ ...prev, [g._id]: true }))}
                  />
                  : <span>{g.emoji || "🎁"}</span>}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "#111", textAlign: "center",
                textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.2,
              }}>
                {g.title}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#34a853" }}>
                ₹ {g.price}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: 13, textAlign: "center", margin: "0 24px 4px" }}>
            {error}
          </p>
        )}

        {/* Send Button */}
        <div style={{ padding: "4px 24px 24px" }}>
          <button
            onClick={handleSend}
            disabled={sel === null || sending}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 8, border: "none",
              background: sel !== null ? "linear-gradient(135deg, #FF6F00, #FF9800)" : "#f3f4f6",
              color: sel !== null ? "#fff" : "#9ca3af",
              fontWeight: 700, fontSize: 17,
              cursor: sel !== null ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: sel !== null ? "0 4px 14px rgba(255,111,0,0.4)" : "none",
              transition: "all 0.2s",
            }}
          >
            {sending && (
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
                display: "inline-block", animation: "gift-spin 0.7s linear infinite",
              }} />
            )}
            {sending
              ? "Sending…"
              : sel !== null
                ? `Send ${gifts[sel].title} · ₹${gifts[sel].price}`
                : "Send Gift"}
          </button>
        </div>
      </div>

      <style>{`@keyframes gift-spin { to { transform: rotate(360deg); } }`}</style>
    </div>,
    document.body
  );
}

export default SendGiftModal;
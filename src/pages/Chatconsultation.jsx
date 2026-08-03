import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EndCallFlow from './EndCallFlow';


import { db } from '../services/liveFirebase';
import { useChat } from '../context/ChatContext';
import SendGiftModal from './Sendgiftmodal';
import { ref, onValue, push, set, update, off, remove } from 'firebase/database';
import {
  callStatusUpdate,
  addRating,
  uploadChatFile,
  buildKundliString,
  lastCallList,
} from '../services/liveService';
import { getUserId, getUserName } from '../services/Liveconfig';
import apiService from '../services/apiServices';
import './ChatConsultation.css';

/* ── helpers ── */
const initials = (n) =>
  (n || '').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb'];
const avColor = (n) => COLORS[((n || '').charCodeAt(0) || 65) % COLORS.length];

const formatTimer = (secs) => {
  const h = String(Math.floor(secs / 3600)).padStart(2, '0');
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};
const fmtTime = (ts) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

// Literal Firebase path — deliberately NOT going through a helper function.
// A known-working reference implementation of this same chat feature builds
// this path inline as `Group/${gid}/${userId}/${otherId}` with no wrapper at
// all, so we match that exactly instead of trusting an unverified
// fbChatPath() in Liveconfig.js that we haven't been able to confirm works.
const groupPath = (gid, a, b) => `Group/${gid}/${a}/${b}`;

// Same reasoning for user id/name — fall back to localStorage directly
// (as the reference does) if Liveconfig's getUserId()/getUserName() ever
// come back empty, rather than silently breaking every downstream path.
const resolveUserId = () => {
  const fromConfig = getUserId();
  if (fromConfig) return String(fromConfig);
  try {
    const raw = sessionStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      const uid = parsed?._id || parsed?.id || parsed?.user_id || parsed?.uid;
      if (uid) return String(uid);
    }
  } catch { /* silent */ }
  return '';
};

const resolveUserName = () => {
  const fromConfig = getUserName();
  if (fromConfig) return fromConfig;
  try {
    const raw = sessionStorage.getItem('user');
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.name || parsed?.full_name || parsed?.username || 'User';
    }
  } catch { /* silent */ }
  return 'User';
};

// How long to wait after the last keystroke before clearing the typing flag —
// mirrors a normal debounce so we're not writing to Firebase on every keypress.
const TYPING_IDLE_MS = 2000;

// ── Personal-info detection (phone / email / link) ──
// Regexes are created fresh on every call (not module-level `g` constants)
// because a shared global-flag RegExp keeps `lastIndex` state between
// .test() calls, which silently causes alternating true/false/true results
// on repeated input — a classic gotcha that would let every other message
// through undetected.
const containsPersonalInfo = (text) => {
  const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const websiteRegex = /(https?:\/\/|www\.)[^\s]+/gi;
  // Catches bare domains too (e.g. "reach me at rohit.in" or "insta: x.com/y")
  // even without a protocol or "www." prefix.
  const bareDomainRegex = /\b[a-zA-Z0-9-]+\.(com|in|net|org|co|io|me|app|xyz|info|biz)(\/[^\s]*)?\b/gi;
  return (
    phoneRegex.test(text) ||
    emailRegex.test(text) ||
    websiteRegex.test(text) ||
    bareDomainRegex.test(text)
  );
};

// ── Emoji picker data + component ──
const EMOJI_LIST = [
  '😀', '😁', '😂', '🤣', '😊', '🙂', '😉', '😍', '😘', '😎', '🤩', '🥳',
  '🙏', '👍', '👏', '🤝', '❤️', '🔥', '🎉', '🙌', '😢', '😅', '🤔', '😴',
  '🌸', '✨', '🕉️', '😇', '🥰', '😜',
];
const GIFT_EMOJI = {
  flowers: '🌹', namaste: '🙏', dakshina: '💰', 'pooja thali': '🍱',
  kalash: '🪔', gemstone: '💎', sweets: '🍬', shivling: '🛕',
  rose: '🌹', 'fruits basket': '🧺', diya: '🪔', 'puja samagri': '🍱',
  'blessings shawl': '🧣', 'premium gift': '🎁',
};
const emojiFor = (t) => GIFT_EMOJI[(t || '').trim().toLowerCase()] || '🎁';
function EmojiPicker({ pickerRef, onSelect }) {
  return (
    <div ref={pickerRef} className="cc-emoji-picker">
      <div className="cc-emoji-grid">
        {EMOJI_LIST.map((e) => (
          <button
            key={e}
            type="button"
            className="cc-emoji-item"
            onClick={() => onSelect(e)}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Toast notifications (top-right) — used to confirm image/audio sends ──
let toastCounter = 0;

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;
  return (
    <div className="cc-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`cc-toast cc-toast--${t.type}`}>
          <i className={`fas ${t.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`} />
          <span>{t.message}</span>
          <button
            type="button"
            className="cc-toast-close"
            onClick={() => onRemove(t.id)}
            aria-label="Dismiss"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Custom audio player bubble (play button + progress + time) ──
//
// Chrome (and browsers sharing its media stack) has a known quirk with
// MediaRecorder-produced blobs: audio.duration reads as Infinity right
// after loadedmetadata fires, because the container has no duration in
// its header — the browser only knows the real length once it has
// scanned to the end at least once. That's why duration showed as
// "--:--" for a freshly recorded clip but worked for one that had
// already been played/seeked. The fix is the standard workaround: force
// a seek to a huge timestamp, let the browser resolve the real duration
// on the resulting timeupdate, then seek back to 0 — all before the
// user ever notices, since we never set isPlaying during this.
function AudioPlayer({ src, onReady }) {
  const audioRef = useRef(null);
  const fixingDurationRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fire once on mount so the parent can re-scroll once this bubble
    // has real height (before this, the bubble may still be collapsed).
    onReady && onReady();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fmt = (s) =>
    !isFinite(s) || s <= 0
      ? '0:00'
      : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const applyDuration = (d) => {
      if (isFinite(d) && d > 0) setDuration(d);
    };
    const handleSubmitChatRating = async (payload) => {
      // Backend's add_rating only stores rating + review — category/tags/
      // anonymous from RateConsultationModal aren't persisted server-side,
      // so we don't send them.
      try {
        await addRating(gid, payload?.rating || 5, payload?.review || '');
      } catch (err) {
        console.error('[ChatConsultation] add_rating failed:', err?.response?.data || err.message);
      }
    };

    const fixInfiniteDuration = () => {
      if (fixingDurationRef.current) return;
      fixingDurationRef.current = true;
      audio.currentTime = 1e101;
      const onTimeUpdate = () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        applyDuration(audio.duration);
        audio.currentTime = 0;
        fixingDurationRef.current = false;
      };
      audio.addEventListener('timeupdate', onTimeUpdate);
    };

    const handleMeta = () => {
      const d = audio.duration;
      if (isFinite(d) && d > 0) applyDuration(d);
      else if (d === Infinity || isNaN(d)) fixInfiniteDuration();
    };

    audio.addEventListener('loadedmetadata', handleMeta);
    audio.addEventListener('durationchange', handleMeta);
    audio.addEventListener('canplay', handleMeta);
    handleMeta();

    return () => {
      audio.removeEventListener('loadedmetadata', handleMeta);
      audio.removeEventListener('durationchange', handleMeta);
      audio.removeEventListener('canplay', handleMeta);
    };
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('[AudioPlayer] play error:', e);
      setError(true);
    }
  };

  if (error) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer" className="cc-audio-fallback">
        Open audio ↗
      </a>
    );
  }

  return (
    <div className="cc-audio-player">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        crossOrigin="anonymous"
        onTimeUpdate={() => {
          // Ignore updates fired by the silent duration-fix seek — only
          // react to real playback progress.
          if (fixingDurationRef.current) return;
          const a = audioRef.current;
          if (!a) return;
          setCurrentTime(a.currentTime);
          if (isFinite(a.duration) && a.duration > 0) {
            setProgress((a.currentTime / a.duration) * 100);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(0);
          setCurrentTime(0);
        }}
        onError={() => setError(true)}
      />

      <button type="button" className="cc-audio-toggle" onClick={toggle}>
        {isPlaying ? (
          <i className="fas fa-pause" />
        ) : (
          <i className="fas fa-play" />
        )}
      </button>

      <div className="cc-audio-track">
        <div
          className="cc-audio-bar"
          onClick={(e) => {
            const audio = audioRef.current;
            if (!audio || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
          }}
        >
          <div className="cc-audio-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="cc-audio-time">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}

// Pick the best MediaRecorder mime type the browser actually supports.
function getSupportedMimeType() {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ];
  for (const t of types) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(t)) return t;
  }
  return '';
}

const STATIC_GIFTS = [
  { _id: 'rose', title: 'Rose', price: 51, image: '/assets/img/gift/rose.png', emoji: '🌹' },
  { _id: 'fruits', title: 'Fruits Basket', price: 101, image: '/assets/img/gift/fruits.png', emoji: '🧺' },
  { _id: 'diya', title: 'Diya', price: 251, image: '/assets/img/gift/diya.png', emoji: '🪔' },
  { _id: 'puja', title: 'Puja Samagri', price: 501, image: '/assets/img/gift/puja.png', emoji: '🍱' },
  { _id: 'shawl', title: 'Blessings Shawl', price: 751, image: '/assets/img/gift/shawl.png', emoji: '🧣' },
  { _id: 'premium', title: 'Premium Gift', price: 1100, image: '/assets/img/gift/gift.png', emoji: '🎁' },
];
const ChatConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const chatCtx = useChat();

  /* ── resolve session ──
     FIX: previously this was purely synchronous — st.wallet ||
     chatCtx.chatInfo?.wallet || 0 — with no fallback for when BOTH are
     empty, which is exactly what happens on a real page refresh (the whole
     ChatProvider resets, wiping chatCtx.chatInfo; and Chrome can either
     preserve or drop location.state across a reload depending on how the
     page got there). Now mirrors AudioCall.jsx's three-tier resolution:
       1) chatCtx.chatInfo already has this session (resume, no refresh)
       2) router state present AND this isn't an actual page reload (fresh
          navigation from Astrologerdetail/wherever)
       3) otherwise — ask the backend directly via last_call_list, and
          fetch the real wallet balance rather than trusting any stale
          transaction-amount field. */
  const st = location.state || {};
  const ACCEPTED_STATUSES = ['accept_astro', 'accepted', 'ongoing', 'active'];

  // Same robust resolver used for audio — prefers the backend's precomputed
  // `difference` field, but only if it's a genuinely valid non-negative
  // number (a valid 0 early in a call shouldn't be treated as "no data"),
  // falling back to computing from start_time otherwise.
  function resolveElapsedSeconds(data2) {
    const diff = Number(data2?.difference);
    if (Number.isFinite(diff) && diff >= 0) return diff;
    if (data2?.start_time) {
      const startMs = new Date(data2.start_time).getTime();
      if (Number.isFinite(startMs)) {
        return Math.max(Math.floor((Date.now() - startMs) / 1000), 0);
      }
    }
    return 0;
  }

  const [session, setSession] = useState(null);
  const [resolving, setResolving] = useState(true);
  const [resolveErr, setResolveErr] = useState('');

 useEffect(() => {
    let cancelled = false;
    // FIX: performance.getEntriesByType('navigation')[0].type reflects the
    // BROWSER DOCUMENT's load type — set once per tab lifetime — not
    // whether THIS specific SPA route change was a refresh. Once true
    // (e.g. user refreshed any page earlier in the session), it stays
    // true for every future client-side navigate() for the rest of the
    // tab, incorrectly treating fresh hand-offs from ChatCallingScreen as
    // reloads and forcing an unnecessary/slower backend round-trip that
    // left gid/astrologer_id empty in the meantime.
    // location.key is the correct signal: React Router sets it to
    // 'default' only on a genuine hard refresh / direct URL load, and to
    // a fresh unique value on every programmatic navigate().
    const reloaded = location.key === 'default';
    console.log('[ChatConsultation] resolving session — reloaded:', reloaded, 'chatCtx.chatInfo:', chatCtx.chatInfo, 'router state (st):', st);
    (async () => {
      // 1) Same-session resume — chatCtx already tracking this chat.
      if (chatCtx.chatInfo?.gid) {
        let w = parseFloat(chatCtx.chatInfo.wallet || 0);
        if (!w || w <= 0) {
          console.warn('[ChatConsultation] chatCtx.chatInfo.wallet was empty/zero on resume — fetching real balance');
          try {
            const profile = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
            w = parseFloat(profile?.results?.wallet ?? profile?.results_web?.wallet ?? profile?.wallet ?? 0);
          } catch (err) {
            console.error('[ChatConsultation] failed to fetch wallet on resume:', err);
          }
        }
        if (!cancelled) {
          setSession({
            gid: chatCtx.chatInfo.gid,
            fbchannelID: chatCtx.chatInfo.fbchannelID || chatCtx.chatInfo.gid,
            astrologer_id: String(chatCtx.chatInfo.astrologer_id || id || ''),
            name: chatCtx.chatInfo.astroName || 'Astrologer',
            profileImg: chatCtx.chatInfo.astrologerImage || '',
            rate: parseFloat(chatCtx.chatInfo.rate || 5),
            wallet: w,
            intake: {
              name: chatCtx.chatInfo.name || '',
              gender: chatCtx.chatInfo.gender || '',
              dob: chatCtx.chatInfo.dob || '',
              tob: chatCtx.chatInfo.tob || '',
              place: chatCtx.chatInfo.place || '',
            },
            initialElapsed: 0, // unused here — ChatContext skips reseeding on same-gid resume
          });
          setResolving(false);
        }
        return;
      }

      // 2) Fresh navigation from ChatCallingScreen/Astrologerdetail — but
      // NOT if this is actually a page reload (Chrome can preserve
      // history.state across F5, making stale state look "present").
      if (!reloaded && st.gid) {
        if (!cancelled) {
          setSession({
            gid: st.gid,
            fbchannelID: st.gid,
            astrologer_id: String(st.astrologer_id || id || ''),
            name: st.astroName || 'Astrologer',
            profileImg: st.astrologerImage || '',
            rate: parseFloat(st.rate || 5),
            wallet: parseFloat(st.wallet || 0),
            intake: {
              name: st.name || '',
              gender: st.gender || '',
              dob: st.dob || '',
              tob: st.tob || '',
              place: st.place || st.birthPlace || '',
            },
            initialElapsed: 0, // genuinely a fresh call
          });
          setResolving(false);
        }
        return;
      }

      // 3) Refresh recovery — neither context nor usable router state.
      // Ask the backend what's actually still active for this user.
      try {
        const { result, data2 } = await lastCallList();
        const callType = String(data2?.call_type || '').toLowerCase();
        const status = String(data2?.status || '').toLowerCase();
        const matchesThisAstrologer = String(data2?.astro_id || '') === String(id);

        if (result && data2 && callType === 'chat' && ACCEPTED_STATUSES.includes(status) && matchesThisAstrologer) {
          // data2.total_amount is a transaction debit amount (often "0"
          // mid-session, since no per-minute debit has posted yet) — NOT
          // the user's real balance. Fetch that separately.
          let realWallet = data2.total_amount || '0';
          try {
            const profile = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
            realWallet = profile?.results?.wallet ?? profile?.results_web?.wallet ?? profile?.wallet ?? realWallet;
          } catch (err) {
            console.error('[ChatConsultation] failed to fetch real wallet balance:', err);
          }

          if (!cancelled) {
            setSession({
              gid: data2.channel_id,
              fbchannelID: data2.fb_channel_id || data2.channel_id,
              astrologer_id: String(data2.astro_id || ''),
              name: data2.astro_name || 'Astrologer',
              profileImg: data2.astro_profile_img || '',
              rate: parseFloat(data2.call_rate || 5),
              wallet: parseFloat(realWallet || 0),
              intake: { name: '', gender: '', dob: '', tob: '', place: '' },
              initialElapsed: resolveElapsedSeconds(data2),
            });
          }
        } else {
          console.warn('[ChatConsultation] refresh recovery: no matching active chat session found.', { result, data2 });
          if (!cancelled) setResolveErr('This chat session is no longer active.');
        }
      } catch (err) {
        console.error('[ChatConsultation] refresh recovery failed:', err);
        if (!cancelled) setResolveErr('Could not restore this chat session.');
      } finally {
        if (!cancelled) setResolving(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gid = session?.gid || '';
  const astrologer_id = String(session?.astrologer_id || '');
  const name = session?.name || 'Astrologer';
  const profileImg = session?.profileImg || '';
  const rate = session?.rate || 5;
  const wallet = session?.wallet || 0;
  const intake = session?.intake || { name: '', gender: '', dob: '', tob: '', place: '' };

  const userId = resolveUserId();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [imgErr, setImgErr] = useState(false);
  // FIX: previously elapsedSecs was a separate local counter
  // (setInterval ticking up from 0 on every mount), completely disconnected
  // from chatCtx.chatTimeLeft — the value that's ACTUALLY Firebase-synced
  // via ChatContext's correction logic. That meant "Time Elapsed" always
  // reset to 0 on resume/refresh (same bug audio had), and its own
  // "Remaining Balance" calc could disagree with the real synced value.
  // Now both are derived from chatCtx.chatTimeLeft directly — one
  // authoritative source, no separate counter to fall out of sync.
  const maxSeconds = rate > 0 ? Math.floor((wallet / rate) * 60) : 0;
  const elapsedSecs = Math.max(maxSeconds - (chatCtx.chatTimeLeft || 0), 0);
  const [sending, setSending] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [endFlowOpen, setEndFlowOpen] = useState(false);
  // 'confirm' = user tapped End Chat locally, walk them through confirm→...
  // 'rate'    = the astrologer/backend already ended the session remotely
  //             (Firebase status), so we skip straight past the confirm step.
  const [endFlowInitialStep, setEndFlowInitialStep] = useState('confirm');
   const [showGift, setShowGift] = useState(false);
   const [giftList, setGiftList] = useState(STATIC_GIFTS); 

  // Whether the astrologer is currently typing — mirrors Dart's
  // `typingStream` (Typing/{groupId}/{astrologerId}).
  const [astroTyping, setAstroTyping] = useState(false);

  // ── Blocked-message warning banner (phone/email/link) ──
  const [sendError, setSendError] = useState('');
  const sendErrorTimeoutRef = useRef(null);

  // ── Mobile info modal (profile + consultation details + safety + quick actions) ──
  const [showInfoModal, setShowInfoModal] = useState(false);

  // ── Toast notifications (top-right) ──
  const [toasts, setToasts] = useState([]);
  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Scroll-to-bottom arrow (WhatsApp-style) — shown only once the user
  // has scrolled up away from the latest message.
  const [showScrollDown, setShowScrollDown] = useState(false);

  // ── Audio recording state ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const streamRef = useRef(null);

  // ── Emoji picker state ──
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  // ── Scroll anchor — more reliable than scrollTop = scrollHeight because
  // it can be re-fired once late-loading media (images/audio) has resized
  // the bubble, not just when the message list itself changes.
  const messagesEndRef = useRef(null);

  // ── Private notes (left sidebar) — kept client-side only; these are
  // the user's own scratch notes for the session, not sent to Firebase.
  const [notes, setNotes] = useState([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  useEffect(() => {
    if (!gid || !userId) return;
    const path = notesPath(gid, userId);
    const notesRef = ref(db, path);
    onValue(notesRef, (snap) => {
      const data = snap.val();
      if (!data) { setNotes([]); return; }
      const list = Object.entries(data).map(([key, val]) => ({ id: key, text: val.text }));
      setNotes(list);
    });
    return () => off(notesRef);
  }, [gid, userId]);
 
  const kundliSentRef = useRef(false);
  const endingRef = useRef(false);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false); // tracks last value we wrote, so we don't spam Firebase

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, []);

  /* ── typing indicator (astrologer) ── */
  useEffect(() => {
    if (!gid || !astrologer_id) return;
    const path = `Typing/${gid}/${astrologer_id}`;
    const typingRef = ref(db, path);
    onValue(typingRef, (snap) => {
      setAstroTyping(snap.val() == true); // == not === handles string "true" too
    });
    return () => off(typingRef);
  }, [gid, astrologer_id]);


  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resp = await apiService.getBearer('https://admin.diviniq.in/user_api/get_gifts');
        console.log('[get_gifts] raw response:', resp); // ← check this in devtools
        const arr = resp?.data ?? resp?.results ?? (Array.isArray(resp) ? resp : []);
        if (!cancelled && Array.isArray(arr) && arr.length > 0) {
          setGiftList(arr.map(g => ({
            _id: g._id,
            title: g.title,
            price: g.price,
            image: g.image,
            emoji: emojiFor(g.title),
          })));
        } else {
          console.warn('[get_gifts] empty or unrecognized shape, keeping static fallback:', resp);
        }
      } catch (err) {
        console.error('[get_gifts] request FAILED:', err?.response?.status, err?.response?.data || err.message);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── start session timer (also drives ActiveChatBar) ──
     FIX: `wallet` was resolved synchronously at render time
     (st.wallet || chatCtx.chatInfo?.wallet || 0) with no verification — if
     that came back 0/empty (e.g. resuming from ActiveChatBar with a stale
     context value, or a fresh call where the wallet fetch upstream hadn't
     resolved yet), initialSeconds fell to a hardcoded 300 ("always 5:00"),
     and — worse for chat specifically — ChatContext's local countdown ends
     the session entirely once it hits 0, so a bad wallet value here doesn't
     just look wrong, it can prematurely kill an active chat. Now verifies
     wallet before seeding, fetching the real balance if it looks empty. */
  useEffect(() => {
    if (!gid || !astrologer_id) return;
    let cancelled = false;
    (async () => {
      let realWallet = wallet;
      if (!realWallet || realWallet <= 0) {
        console.warn('[ChatConsultation] resolved wallet was empty/zero — fetching real balance from get_profile');
        try {
          const profile = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
          realWallet = parseFloat(profile?.results?.wallet ?? profile?.results_web?.wallet ?? profile?.wallet ?? 0);
          console.log('[ChatConsultation] fetched wallet:', realWallet);
        } catch (err) {
          console.error('[ChatConsultation] failed to fetch wallet:', err);
        }
      }
      if (cancelled) return;

      // FIX: previously always seeded the FULL wallet/rate duration,
      // ignoring how much time had already elapsed (session?.initialElapsed
      // — real elapsed seconds on a refresh-recovery rejoin, 0 for a
      // genuinely fresh call). Combined with the ChatContext fix (which
      // now skips reseeding entirely for a same-gid resume), this means:
      // resume in the same tab → timer untouched (already correct);
      // refresh → timer seeded honestly at (maxSeconds - realElapsed), not
      // always the full duration.
      const maxSeconds = rate > 0 && realWallet > 0 ? Math.floor((realWallet / rate) * 60) : 300;
      const initialSeconds = Math.max(maxSeconds - (session?.initialElapsed || 0), 0);
      chatCtx.startChatTimer(
        {
          gid,
          fbchannelID: gid,
          astrologer_id,
          astroName: name,
          astrologerImage: profileImg,
          rate: String(rate),
          wallet: String(realWallet),
          name: intake.name,
          gender: intake.gender,
          dob: intake.dob,
          tob: intake.tob,
          place: intake.place,
        },
        initialSeconds
      );
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, astrologer_id]);

  /* ── detect the astrologer/backend ending the session remotely ──
     CallSession/{gid} status flips to end_astro / wallet_empty / rejected
     when the OTHER side ends it (or the wallet runs out) — ChatContext
     already watches this for the billing countdown, but we also need to
     surface it here so the rating flow opens automatically instead of the
     user being stuck on a dead chat with no explanation. */
     useEffect(() => {
      if (!gid) return;
      const REMOTE_END_STATUSES = ['end_astro', 'wallet_empty', 'rejected'];
      const sessionRef = ref(db, `CallSession/${gid}`);
      const handler = (snap) => {
        const status = String(snap.val()?.status ?? '');
        if (REMOTE_END_STATUSES.includes(status) && !endingRef.current) {
          endingRef.current = true; // stop handleEndChat from also firing end_user
          setEndFlowInitialStep('rate');
          setEndFlowOpen(true);
        }
      };
      onValue(sessionRef, handler);
      return () => off(sessionRef, 'value', handler);
    }, [gid]);

  /* Elapsed time is now a derived value (see maxSeconds/elapsedSecs above),
     recalculated automatically on every render as chatCtx.chatTimeLeft
     ticks — no separate interval needed here anymore. */

  /* ── Firebase listener (messages) ── */
  useEffect(() => {
    if (!gid || !userId || !astrologer_id) {
      console.warn('[ChatConsultation] message listener NOT attached — missing value(s):', { gid, userId, astrologer_id });
      return;
    }
    const path = groupPath(gid, userId, astrologer_id);
    const dbRef = ref(db, path);
    onValue(dbRef, (snap) => {
      const data = snap.val();
      if (!data) { setMessages([]); return; }
      const list = Object.entries(data).map(([key, val]) => ({ key, ...val }));
      list.sort((a, b) => (a.date_time || 0) - (b.date_time || 0));
      setMessages(list);
    }, (err) => {
      console.error('[ChatConsultation] message listener error (likely Firebase permission/rules issue):', err);
    });
    return () => off(dbRef);
  }, [gid, userId, astrologer_id]);

  /* ── write our own typing status ──
     Debounced so we don't hit Firebase on every keystroke — clears itself
     after TYPING_IDLE_MS of no input, and always clears immediately on send. */
  const writeTyping = useCallback(
    (isTyping) => {
      if (!gid || !userId) return;
      if (isTypingRef.current === isTyping) return; // no-op, avoid redundant writes
      isTypingRef.current = isTyping;
      set(ref(db, `Typing/${gid}/${userId}`), isTyping).catch(() => { /* silent */ });
    },
    [gid, userId]
  );

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessageText(value);

    if (value.trim()) {
      writeTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => writeTyping(false), TYPING_IDLE_MS);
    } else {
      writeTyping(false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  // Clear our typing flag + release the mic on unmount so nothing stays
  // stuck if we navigate away mid-type or mid-recording.
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (sendErrorTimeoutRef.current) clearTimeout(sendErrorTimeoutRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (gid && userId) {
        set(ref(db, `Typing/${gid}/${userId}`), false).catch(() => { /* silent */ });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, userId]);

  /* ── mark incoming (astrologer) messages as seen ── */
  useEffect(() => {
    if (!gid || !userId || !astrologer_id || messages.length === 0) return;
    const path = groupPath(gid, userId, astrologer_id);
    const unseen = messages.filter(
      (m) => String(m.from) !== String(userId) && !m.seen
    );
    unseen.forEach((m) => {
      update(ref(db, `${path}/${m.key}`), { seen: true }).catch(() => { /* silent */ });
    });
  }, [messages, gid, userId, astrologer_id]);

  /* ── auto-scroll on new messages ──
     This fires as soon as the message list changes, which is correct for
     text — but images/audio bubbles grow *after* this (once the media
     loads), so those media components also call scrollToBottom() again
     via onLoad / onReady once they know their real height. */
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ── track scroll position to show/hide the WhatsApp-style
     scroll-to-bottom arrow once the user has scrolled away from the
     latest message ── */
  useEffect(() => {
    const el = chatBodyRef.current;
    if (!el) return;
    const handleScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollDown(distanceFromBottom > 160);
    };
    handleScroll();
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── close emoji picker on outside click ── */
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmojiPicker]);

  // Notes path mirrors your Group/Typing convention: Notes/{gid}/{userId}
const notesPath = (gid, userId) => `Notes/${gid}/${userId}`;

const saveNoteToFirebase = useCallback(async (text) => {
  if (!gid || !userId) return;
  const path = notesPath(gid, userId);
  const noteId = push(ref(db, path)).key;
  if (!noteId) {
    console.error('[ChatConsultation] push() returned no key for note — check path:', path);
    return;
  }
  const body = {
    text,
    from: userId,
    to: astrologer_id,
    date_time: Date.now(),
  };
  try {
    await set(ref(db, `${path}/${noteId}`), body);
  } catch (err) {
    console.error('[ChatConsultation] Failed to save note to Firebase:', err, { path, body });
  }
}, [gid, userId, astrologer_id]);

  /* ── send message (writes both sides) ── */
  const sendFirebaseMessage = useCallback(
    async (content, type = 'text') => {
      if (!gid || !userId || !astrologer_id || !content) {
        console.warn('[ChatConsultation] sendFirebaseMessage aborted — missing value(s):', { gid, userId, astrologer_id, content });
        return;
      }
      const timestamp = Date.now();
      const senderPath = groupPath(gid, userId, astrologer_id);
      const receiverPath = groupPath(gid, astrologer_id, userId);
      const msgId = push(ref(db, senderPath)).key;
      if (!msgId) {
        console.error('[ChatConsultation] push() returned no key — check that senderPath is valid:', senderPath);
        return;
      }
      const body = {
        name: resolveUserName(),
        to: astrologer_id,
        from: userId,
        message: content,
        type,
        message_id: msgId,
        date_time: timestamp,
        seen: false,
      };
      try {
        await set(ref(db, `${senderPath}/${msgId}`), body);
        await set(ref(db, `${receiverPath}/${msgId}`), body);
      } catch (err) {
        console.error('[ChatConsultation] Firebase write FAILED (check rules/permissions):', err, { senderPath, receiverPath, body });
      }
    },
    [gid, userId, astrologer_id]
  );

  const handleSaveNote = () => {
    const text = noteDraft.trim();
    if (!text) { setShowNoteInput(false); return; }
    const note = { id: `${Date.now()}-${Math.random()}`, text };
    setNotes((prev) => [...prev, note]);
    saveNoteToFirebase(text); // persist so the astrologer can see it too
    setNoteDraft('');
    setShowNoteInput(false);
  };
  /* ── kundli auto-message (once) ── */
  useEffect(() => {
    if (kundliSentRef.current) return;
    if (!gid || !userId || !astrologer_id) return;
    if (!intake.gender || !intake.dob) return;
    kundliSentRef.current = true;
    sendFirebaseMessage(buildKundliString(intake), 'text');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid, userId, astrologer_id]);

  const flashSendError = (msg) => {
    setSendError(msg);
    if (sendErrorTimeoutRef.current) clearTimeout(sendErrorTimeoutRef.current);
    sendErrorTimeoutRef.current = setTimeout(() => setSendError(''), 4000);
  };

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;

    // Block phone numbers, emails, and links before it ever reaches
    // Firebase — preserve what they typed so they can edit and resend.
    if (containsPersonalInfo(text)) {
      flashSendError('⚠️ Sharing phone numbers, emails, or links isn\u2019t allowed here. Please remove that and try again.');
      return;
    }

    sendFirebaseMessage(text, 'text');
    setMessageText('');
    setSendError('');
    // Sending clears typing immediately rather than waiting for the idle timeout.
    writeTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleAttach = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSending(true);
    try {
      const url = await uploadChatFile(file, { isAudio: false });
      if (url) {
        await sendFirebaseMessage(url, 'image');
        showToast('Image sent!', 'success');
      } else {
        showToast('Image upload failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error('[ChatConsultation] image upload failed:', err);
      showToast('Image upload failed. Check your connection.', 'error');
    } finally {
      setSending(false);
      e.target.value = '';
    }
  };

  /* ── emoji select — insert into input, keep typing indicator alive ── */
  const handleEmojiSelect = (emoji) => {
    setMessageText((prev) => prev + emoji);
    writeTyping(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => writeTyping(false), TYPING_IDLE_MS);
    inputRef.current?.focus();
  };

  /* ── audio recording: mic → blob → upload → send ── */
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      audioChunksRef.current = [];

      recorder.addEventListener('dataavailable', (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      });

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error('[ChatConsultation] mic access failed:', err);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);

    const recorder = mediaRecorderRef.current;
    const mimeType = recorder.mimeType || 'audio/webm';

    await new Promise((resolve) => {
      recorder.addEventListener('stop', () => resolve(), { once: true });
      recorder.stop();
    });

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;

    const chunks = audioChunksRef.current;
    audioChunksRef.current = [];
    if (chunks.length === 0) return;

    const blob = new Blob(chunks, { type: mimeType });
    if (blob.size < 1000) {
      console.warn('[ChatConsultation] recording too short, dropped');
      return;
    }

    const file = new File([blob], `voice_${Date.now()}.mp3`, { type: 'audio/mpeg' });

    setSending(true);
    try {
      const url = await uploadChatFile(file, { isAudio: true });
      if (url) {
        await sendFirebaseMessage(url, 'audio');
        showToast('Voice message sent!', 'success');
      } else {
        showToast('Audio upload failed. Please try again.', 'error');
      }
    } catch (err) {
      console.error('[ChatConsultation] audio upload failed:', err);
      showToast('Audio upload failed. Check your connection.', 'error');
    } finally {
      setSending(false);
    }
  };

  /* ── minimize on back — chat stays active, ActiveChatBar shows ── */
  const handleMinimize = () => navigate(-1);

  /* ── quick action: send a virtual gift as a chat message ── */
  const GIFT_OPTIONS = ['🎁', '🌸', '🙏', '✨', '🪔'];
  const handleSendGift = () => {
    setShowGift(true);
  };
 


  /* ── end chat → EndCallFlow (confirm → rate → thankYou → gift → ended) ── */
  const handleEndChat = () => {
    if (endingRef.current) return; // already ending (e.g. remote end already opened the flow)
    setEndFlowInitialStep('confirm');
    setEndFlowOpen(true);
  };

  const handleConfirmEndChat = async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    writeTyping(false);
    try { await callStatusUpdate(gid, 'end_user'); } catch { /* silent */ }
  };

  const handleSubmitChatRating = async (payload) => {
    try { await addRating(gid, payload?.rating || 5, payload?.review || ''); } catch { /* silent */ }
  };

  const handleSendBlessingGift = async (giftId) => {
    const gift = giftList.find((g) => String(g._id) === String(giftId));
    if (!gift) {
      console.warn('[ChatConsultation] EndCallFlow gift send — id not found in giftList:', giftId, giftList);
      return;
    }
    try {
      await apiService.postBearer('https://admin.diviniq.in/user_api/gift_transaction', {
        to: String(astrologer_id),
        giftId: String(gift._id),
        amount: Number(gift.price),
        type: 'normal',
      });
    } catch (err) {
      console.error('[ChatConsultation] EndCallFlow gift send failed:', err?.response?.data || err.message);
    }
  };

  const handleEndFlowFinish = () => {
    chatCtx.stopChatTimer();
    setEndFlowOpen(false);
    navigate('/', { replace: true });
  };

  // FIX: previously computed from the disconnected local elapsedSecs
  // counter — now derived from chatCtx.chatTimeLeft, the same synced
  // source elapsedSecs itself is now derived from, so this and "Time
  // Elapsed" can never disagree with each other or with the real balance.
  const remainingBalance = rate > 0 ? Math.max(0, Math.round(((chatCtx.chatTimeLeft || 0) / 60) * rate)) : 0;

  const renderBubble = (msg) => {
    if (msg.type === 'image') {
      return (
        <img
          src={msg.message}
          alt="attachment"
          style={{ maxWidth: 200, borderRadius: 12, cursor: 'pointer' }}
          onClick={() => setPreviewImage(msg.message)}
          onLoad={scrollToBottom}
          onError={(e) => { e.currentTarget.style.display = 'none'; scrollToBottom(); }}
        />
      );
    }
    if (msg.type === 'audio') {
      return <AudioPlayer src={msg.message} onReady={scrollToBottom} />;
    }
    return (msg.message || '').split('\n').map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}{i < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (resolving) {
    return (
      <div className="cc-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Reconnecting your chat…</div>
        </div>
      </div>
    );
  }

  if (!gid) {
    return (
      <div className="cc-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 16, padding: 28, maxWidth: 360 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 6 }}>Chat not available</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{resolveErr || 'This chat session is no longer active.'}</div>
          <button
            onClick={() => navigate(`/astrologer/${id}`, { replace: true })}
            style={{ padding: '10px 20px', borderRadius: 30, border: 'none', background: '#7b1a3a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            Back to Astrologer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cc-page">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <div className="cc-main">

        {/* ────── LEFT SIDEBAR ────── */}
        <div className="cc-left">
          <motion.div className="cc-profile-card"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Link to={`/astrologer/${astrologer_id}`} className="cc-back">
              <i className="fas fa-arrow-left" /> Back
            </Link>

            <div className="cc-avatar-wrap">
              <div className="cc-avatar">
                {profileImg && !imgErr
                  ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} />
                  : <div className="cc-avatar-init" style={{ background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)` }}>{initials(name)}</div>}
              </div>
              <div className="cc-online-dot" />
            </div>

            <div className="cc-profile-name">
              {name} <i className="fas fa-check-circle cc-verified-check" />
            </div>
            <div className="cc-verified-label">
              <i className="fas fa-check-circle" /> Verified Expert
            </div>

            <div className="cc-stats">
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-clock" /> Rate</span>
                <span className="cc-stat-value">₹{rate}/min</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-hourglass-half" /> Time Left</span>
                <span className="cc-stat-value">{formatTimer(chatCtx.chatTimeLeft || 0)}</span>
              </div>
              <div className="cc-stat-row">
                <span className="cc-stat-label"><i className="fas fa-wallet" /> Balance</span>
                <span className="cc-stat-value">₹{remainingBalance}</span>
              </div>
            </div>

            <button className="cc-view-profile-btn" onClick={() => navigate(`/astrologer/${astrologer_id}`)}>
              View Profile
            </button>
          </motion.div>

          <div className="cc-safety-card">
            <div className="cc-safety-title"><i className="fas fa-shield-alt" /> Safety & Privacy</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> 100% Secure Chats</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> Your privacy is our priority</div>
            <div className="cc-safety-item"><span className="cc-safety-check">✓</span> End-to-end encrypted</div>
            <div className="cc-safety-warning">Never share your personal or payment details in chat.</div>
          </div>

          <div className="cc-notes-card">
            <div className="cc-notes-title"><i className="fas fa-clipboard" /> Your Notes</div>
            {notes.length === 0 ? (
              <div className="cc-notes-empty">
                <p>You can add private notes during the consultation.</p>
                <button type="button" className="cc-add-note-btn" onClick={() => setShowNoteInput(true)}>
                  <i className="fas fa-plus" /> Add Note
                </button>
              </div>
            ) : (
              <div className="cc-notes-list">
                {notes.map((n) => (
                  <div key={n.id} className="cc-note-item">
                    <span>{n.text}</span>
                    <button type="button" onClick={() => {
  setNotes((prev) => prev.filter((x) => x.id !== n.id));
  if (gid && userId) remove(ref(db, `${notesPath(gid, userId)}/${n.id}`)).catch(() => {});
}} aria-label="Delete note">
                      <i className="fas fa-times" />
                    </button>
                  </div>
                ))}
                <button type="button" className="cc-add-note-btn" onClick={() => setShowNoteInput(true)}>
                  <i className="fas fa-plus" /> Add Note
                </button>
              </div>
            )}
            {showNoteInput && (
              <div className="cc-note-input-row">
                <input
                  type="text"
                  autoFocus
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNote(); if (e.key === 'Escape') { setShowNoteInput(false); setNoteDraft(''); } }}
                  placeholder="Type a private note..."
                />
                <button type="button" onClick={handleSaveNote}><i className="fas fa-check" /></button>
              </div>
            )}
          </div>
        </div>

        {/* ────── CHAT CENTER ────── */}
        <motion.div className="cc-chat-center"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.05 }}>
          <div className="cc-chat-header">
            <div className="cc-chat-header-left">
              <button
                type="button"
                className="cc-minimize-btn"
                onClick={handleMinimize}
                title="Minimize — chat stays active"
                aria-label="Minimize chat"
              >
                <i className="fas fa-chevron-left" />
              </button>
              {/* ── astrologer avatar ── */}
              <div style={{
                width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
                flexShrink: 0, marginRight: 8,
                background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 14,
              }}>
                {profileImg && !imgErr
                  ? <img src={profileImg} alt={name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setImgErr(true)} />
                  : initials(name)
                }
              </div>

              <div className="cc-chat-online-badge">
                <span className="cc-chat-online-dot" />
                <span className="cc-chat-online-text">Online</span>
              </div>
              <div className="cc-chat-info">
                <span className="cc-chat-name">{name}</span>
                <span className="cc-chat-reply-time">
                  {astroTyping
                    ? <em style={{ fontStyle: 'normal', color: '#7b1a3a', fontWeight: 600 }}>typing…</em>
                    : `₹${rate}/min · ${formatTimer(chatCtx.chatTimeLeft || 0)} left`}
                </span>
              </div>
            </div>
            <div className="cc-chat-header-right">
              <button
                type="button"
                className="cc-info-btn"
                onClick={() => setShowInfoModal(true)}
                title="Astrologer info & consultation details"
                aria-label="Show consultation info"
              >
                <i className="fas fa-circle-info" />
                <span>Info</span>
              </button>
              <button className="cc-end-chat-btn" onClick={handleEndChat}>
                <i className="fas fa-phone-slash" /> End Chat
              </button>
            </div>
          </div>

          <div className="cc-chat-body" ref={chatBodyRef}>
            <div className="cc-encrypt-notice">
              <i className="fas fa-lock" /> This conversation is end-to-end encrypted. Your privacy is 100% protected.
            </div>
            <div className="cc-date-divider"><span>Today</span></div>

            <AnimatePresence>
              {messages.map((msg) => {
                const outgoing = String(msg.from) === String(userId);
                return (
                  <motion.div key={msg.key || msg.message_id}
                    className={`cc-message ${outgoing ? 'outgoing' : 'incoming'}`}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                    {!outgoing && (
                      <div className="cc-msg-avatar">
                        {profileImg && !imgErr ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} /> : null}
                      </div>
                    )}
                    <div className="cc-msg-content">
                      <div className="cc-msg-bubble">{renderBubble(msg)}</div>
                      <div className="cc-msg-time">
                        {fmtTime(msg.date_time || Date.now())}
                        {outgoing && <span className="cc-msg-ticks">{msg.seen ? '✓✓' : '✓'}</span>}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {astroTyping && (
              <div className="cc-message incoming" style={{ opacity: 0.7 }}>
                <div className="cc-msg-avatar">
                  {profileImg && !imgErr ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} /> : null}
                </div>
                <div className="cc-msg-content">
                  <div className="cc-msg-bubble">
                    <span className="cc-typing-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 0 && !astroTyping && (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 30 }}>
                Say Namaste 🙏 to begin your consultation.
              </div>
            )}

            {/* Scroll anchor — target for scrollIntoView(). Must stay the
                very last child so "bottom" always means "newest message". */}
            <div ref={messagesEndRef} />
          </div>

          <div className="cc-chat-input-area">
            {showScrollDown && (
              <button
                type="button"
                className="cc-scroll-down-btn"
                onClick={scrollToBottom}
                aria-label="Scroll to latest messages"
                title="Scroll to latest messages"
              >
                <i className="fas fa-arrow-down" />
              </button>
            )}
            {sendError && (
              <div className="cc-send-error-banner">
                <i className="fas fa-triangle-exclamation" />
                <span>{sendError}</span>
              </div>
            )}
            <div className="cc-input-row" style={{ position: 'relative' }}>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAttach} />
              <button className="cc-attach-btn" onClick={() => fileRef.current?.click()} disabled={sending || isRecording}>
                <i className={`fas ${sending ? 'fa-spinner fa-spin' : 'fa-paperclip'}`} />
              </button>

              {isRecording ? (
                <div className="cc-recording-indicator">
                  <span className="cc-rec-dot" />
                  Recording… {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                  {String(recordingSeconds % 60).padStart(2, '0')}
                </div>
              ) : (
                <input ref={inputRef} className="cc-chat-input" type="text"
                  placeholder="Type your message..." value={messageText}
                  onChange={handleMessageChange} onKeyDown={handleKeyDown} />
              )}

              <button
                type="button"
                className="cc-emoji-btn"
                onClick={() => setShowEmojiPicker((v) => !v)}
                disabled={isRecording}
              >
                😊
              </button>
              {showEmojiPicker && (
                <EmojiPicker pickerRef={emojiPickerRef} onSelect={handleEmojiSelect} />
              )}

              <button
                type="button"
                className={`cc-mic-btn${isRecording ? ' recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={sending}
                title={isRecording ? 'Tap to stop & send' : 'Tap to record voice'}
              >
                <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`} />
              </button>

              <button className="cc-send-btn" onClick={handleSend} disabled={isRecording}>
                <i className="fas fa-paper-plane" />
              </button>
            </div>
            <div className="cc-secure-note">
              <i className="fas fa-lock" /> Messages are secure and encrypted
            </div>
          </div>
        </motion.div>

        {/* ────── RIGHT SIDEBAR ────── */}
        <div className="cc-right">
          <motion.div className="cc-consult-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.1 }}>
            <div className="cc-consult-title"><i className="fas fa-clipboard-list" /> Consultation Details</div>
            <div className="cc-consult-row"><span className="cc-consult-label">Consultation Type</span><span className="cc-consult-value">Chat</span></div>
            <hr className="cc-consult-divider" />
            <div className="cc-consult-row"><span className="cc-consult-label">Rate</span><span className="cc-consult-value">₹{rate} / min</span></div>
            <div className="cc-consult-row">
              <span className="cc-consult-label">Time Elapsed</span>
              <span className="cc-consult-value"><i className="far fa-clock cc-timer-icon" /> {formatTimer(elapsedSecs)}</span>
            </div>
            <div className="cc-consult-row"><span className="cc-consult-label">Remaining Balance</span><span className="cc-consult-value">₹{remainingBalance}</span></div>
          </motion.div>

          <motion.div className="cc-qa-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.15 }}>
            <div className="cc-qa-title"><i className="fas fa-bolt" /> Quick Actions</div>
            <div className="cc-qa-grid">
              <div className="cc-qa-btn" onClick={() => fileRef.current?.click()}><i className="fas fa-image" /><span>Send Photo</span></div>
              <div className="cc-qa-btn" onClick={() => sendFirebaseMessage(buildKundliString(intake), 'text')}><i className="fas fa-file-alt" /><span>Share Details</span></div>
              <div className="cc-qa-btn" onClick={handleSendGift}><i className="fas fa-gift" /><span>Send Gift</span></div>
              <div className="cc-qa-btn cc-qa-end" onClick={handleEndChat}><i className="fas fa-phone-slash" /><span>End Consultation</span></div>
            </div>
          </motion.div>

          <motion.div className="cc-trust-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.2 }}>
            <div className="cc-trust-item">
              <span className="cc-trust-icon"><i className="fas fa-shield-alt" /></span>
              <div>
                <div className="cc-trust-title">100% Privacy</div>
                <div className="cc-trust-sub">Your data is safe with us</div>
              </div>
            </div>
            <div className="cc-trust-item">
              <span className="cc-trust-icon"><i className="fas fa-user-check" /></span>
              <div>
                <div className="cc-trust-title">Verified Astrologer</div>
                <div className="cc-trust-sub">Experienced & trusted experts</div>
              </div>
            </div>
            <div className="cc-trust-item">
              <span className="cc-trust-icon"><i className="fas fa-lock" /></span>
              <div>
                <div className="cc-trust-title">Secure Payments</div>
                <div className="cc-trust-sub">Multiple safe payment options</div>
              </div>
            </div>
            <div className="cc-trust-item">
              <span className="cc-trust-icon"><i className="fas fa-users" /></span>
              <div>
                <div className="cc-trust-title">Trusted by 50 Lakh+ Users</div>
                <div className="cc-trust-sub">Across India and worldwide</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* image preview */}
      {previewImage && (
        <div onClick={() => setPreviewImage(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <img src={previewImage} alt="preview" style={{ maxWidth: '92%', maxHeight: '92%', borderRadius: 12 }} />
        </div>
      )}

      {/* ── mobile info modal: astrologer profile + consultation details +
             safety & privacy + quick actions, all in one bottom sheet ── */}
      {showInfoModal && (
        <div className="cc-info-modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="cc-info-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cc-info-modal-handle" />
            <button
              type="button"
              className="cc-info-modal-close"
              onClick={() => setShowInfoModal(false)}
              aria-label="Close"
            >
              <i className="fas fa-times" />
            </button>

            <div className="cc-info-modal-scroll">
              {/* profile card */}
              <div className="cc-profile-card cc-profile-card--modal">
                <div className="cc-avatar-wrap">
                  <div className="cc-avatar">
                    {profileImg && !imgErr
                      ? <img src={profileImg} alt={name} onError={() => setImgErr(true)} />
                      : <div className="cc-avatar-init" style={{ background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)` }}>{initials(name)}</div>}
                  </div>
                  <div className="cc-online-dot" />
                </div>

                <div className="cc-profile-name">
                  {name} <i className="fas fa-check-circle cc-verified-check" />
                </div>
                <div className="cc-verified-label">
                  <i className="fas fa-check-circle" /> Verified Expert
                </div>

                <div className="cc-stats">
                  <div className="cc-stat-row">
                    <span className="cc-stat-label"><i className="fas fa-clock" /> Rate</span>
                    <span className="cc-stat-value">₹{rate}/min</span>
                  </div>
                  <div className="cc-stat-row">
                    <span className="cc-stat-label"><i className="fas fa-hourglass-half" /> Time Left</span>
                    <span className="cc-stat-value">{formatTimer(chatCtx.chatTimeLeft || 0)}</span>
                  </div>
                  <div className="cc-stat-row">
                    <span className="cc-stat-label"><i className="fas fa-wallet" /> Balance</span>
                    <span className="cc-stat-value">₹{remainingBalance}</span>
                  </div>
                </div>

                <button
                  className="cc-view-profile-btn"
                  onClick={() => { setShowInfoModal(false); navigate(`/astrologer/${astrologer_id}`); }}
                >
                  View Profile
                </button>
              </div>

              {/* consultation details */}
              <div className="cc-consult-card">
                <div className="cc-consult-title"><i className="fas fa-clipboard-list" /> Consultation Details</div>
                <div className="cc-consult-row"><span className="cc-consult-label">Consultation Type</span><span className="cc-consult-value">Chat</span></div>
                <hr className="cc-consult-divider" />
                <div className="cc-consult-row"><span className="cc-consult-label">Rate</span><span className="cc-consult-value">₹{rate} / min</span></div>
                <div className="cc-consult-row">
                  <span className="cc-consult-label">Time Elapsed</span>
                  <span className="cc-consult-value"><i className="far fa-clock cc-timer-icon" /> {formatTimer(elapsedSecs)}</span>
                </div>
                <div className="cc-consult-row"><span className="cc-consult-label">Remaining Balance</span><span className="cc-consult-value">₹{remainingBalance}</span></div>
              </div>

              {/* safety & privacy */}
              <div className="cc-safety-card">
                <div className="cc-safety-title"><i className="fas fa-shield-alt" /> Safety & Privacy</div>
                <div className="cc-safety-item"><span className="cc-safety-check">✓</span> 100% Secure Chats</div>
                <div className="cc-safety-item"><span className="cc-safety-check">✓</span> Your privacy is our priority</div>
                <div className="cc-safety-item"><span className="cc-safety-check">✓</span> End-to-end encrypted</div>
                <div className="cc-safety-warning">Never share your personal or payment details in chat.</div>
              </div>

              {/* quick actions */}
              <div className="cc-qa-card">
                <div className="cc-qa-title"><i className="fas fa-bolt" /> Quick Actions</div>
                <div className="cc-qa-grid">
                  <div
                    className="cc-qa-btn"
                    onClick={() => { setShowInfoModal(false); fileRef.current?.click(); }}
                  >
                    <i className="fas fa-image" /><span>Send Photo</span>
                  </div>
                  <div
                    className="cc-qa-btn"
                    onClick={() => { setShowInfoModal(false); sendFirebaseMessage(buildKundliString(intake), 'text'); }}
                  >
                    <i className="fas fa-file-alt" /><span>Share Details</span>
                  </div>
                  <div
                    className="cc-qa-btn"
                    onClick={() => { setShowInfoModal(false); handleSendGift(); }}
                  >
                    <i className="fas fa-gift" /><span>Send Gift</span>
                  </div>
                  <div
                    className="cc-qa-btn cc-qa-end"
                    onClick={() => { setShowInfoModal(false); handleEndChat(); }}
                  >
                    <i className="fas fa-phone-slash" /><span>End Consultation</span>
                  </div>
                </div>
              </div>

              {/* private notes */}
              <div className="cc-notes-card">
                <div className="cc-notes-title"><i className="fas fa-clipboard" /> Your Notes</div>
                {notes.length === 0 ? (
                  <div className="cc-notes-empty">
                    <p>You can add private notes during the consultation.</p>
                    <button type="button" className="cc-add-note-btn" onClick={() => setShowNoteInput(true)}>
                      <i className="fas fa-plus" /> Add Note
                    </button>
                  </div>
                ) : (
                  <div className="cc-notes-list">
                    {notes.map((n) => (
                      <div key={n.id} className="cc-note-item">
                        <span>{n.text}</span>
                        <button type="button" onClick={() => setNotes((prev) => prev.filter((x) => x.id !== n.id))} aria-label="Delete note">
                          <i className="fas fa-times" />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="cc-add-note-btn" onClick={() => setShowNoteInput(true)}>
                      <i className="fas fa-plus" /> Add Note
                    </button>
                  </div>
                )}
                {showNoteInput && (
                  <div className="cc-note-input-row">
                    <input
                      type="text"
                      autoFocus
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveNote(); if (e.key === 'Escape') { setShowNoteInput(false); setNoteDraft(''); } }}
                      placeholder="Type a private note..."
                    />
                    <button type="button" onClick={handleSaveNote}><i className="fas fa-check" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* rating dialog */}
     {/* End Chat → Rate → Thank You → Gift → Ended — same UI as /consultation/check, real API binding */}
     {endFlowOpen && (
        <EndCallFlow
          duration={formatTimer(elapsedSecs)}
          amountUsed={`₹${Math.round((elapsedSecs / 60) * rate)}`}
          remainingBalance={`₹${remainingBalance}`}
          astrologerName={name}
          gifts={giftList}
          initialStep={endFlowInitialStep}
          onCancel={() => setEndFlowOpen(false)}
          onConfirmEnd={handleConfirmEndChat}
          onSubmitRating={handleSubmitChatRating}
          onSendGift={handleSendBlessingGift}
          onFinish={handleEndFlowFinish}
        />
      )}
<SendGiftModal
  isOpen={showGift}
  onClose={() => setShowGift(false)}
  astrologerName={name}
  astrologerId={astrologer_id}
  astrologerImage={profileImg}
  gifts={giftList}
  walletBalance={wallet}
  showChatCallActions={false}
/>
    </div>
  );
};

export default ChatConsultation;
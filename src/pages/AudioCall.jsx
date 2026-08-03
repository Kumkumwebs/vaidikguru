import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../services/liveFirebase';
import { useAudioCall } from '../context/AudioCallContext';
import { agoraManager } from '../services/Agoramanager.';
import apiService from '../services/apiServices';
import SendGiftModal from './Sendgiftmodal';
import {
  fetchAgoraToken,
  callStatusUpdate,
  callInitiateStatus,
  addRating,
  lastCallList,
} from '../services/liveService';
import './AudioCall.css';

const STATUS_POLL_MS = 2000;
const ACCEPTED_STATUSES = ['accept_astro', 'accepted', 'ongoing', 'active'];

const initials = (n) => (n || '').trim().split(' ').slice(0, 2).map((w) => w[0] || '').join('').toUpperCase();
const COLORS = ['#7c3aed', '#059669', '#dc2626', '#d97706', '#2563eb'];
const avColor = (n) => COLORS[((n || '').charCodeAt(0) || 65) % COLORS.length];
const fmt = (s) => {
  const h = String(Math.floor(s / 3600)).padStart(2, '0');
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${h}:${m}:${sec}`;
};
const fmtShort = (s) => {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
};

const BARS = [
  { lbl: '5 Stars', pct: 82, color: '#f5a623' },
  { lbl: '4 Stars', pct: 13, color: '#f5a623' },
  { lbl: '3 Stars', pct: 3, color: '#f5c842' },
  { lbl: '2 Stars', pct: 1, color: '#ddd' },
  { lbl: '1 Star', pct: 1, color: '#ddd' },
];

const TRUST_POINTS = [
  { icon: 'fas fa-shield-alt', title: '100% Private & Secure', sub: 'Your conversation stays fully confidential' },
  { icon: 'fas fa-user-check', title: 'Verified Astrologers', sub: 'Every expert is background-checked' },
  { icon: 'fas fa-star', title: 'Trusted by Lakhs', sub: 'Rated 4.8+ across thousands of reviews' },
  { icon: 'fas fa-headset', title: '24x7 Support', sub: 'We\u2019re here whenever you need us' },
];

const extractStatus = (res) =>
  res?.results?.status ??
  res?.status ??
  res?.data?.status ??
  res?.result?.status ??
  null;

// FIX: `Number(data2.difference || 0)` still has the same falsy-zero risk if
// `difference` is ever NaN/undefined from a backend date-parsing hiccup —
// this adds the start_time-based fallback too, matching RestoreOngoingSession.
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

// Reads CallSession/{channelId} ONCE to compute an accurate remaining-time
// countdown, using the exact same fields ChatContext already relies on for
// its own countdown (max_minutes / last_tick_at / started_at).
function readCallSessionRemaining(channelId, rate, wallet) {
  return new Promise((resolve) => {
    try {
      const sessionRef = ref(db, `CallSession/${channelId}`);
      onValue(sessionRef, (snap) => {
        off(sessionRef);
        const d = snap.val();
        if (!d) { resolve(0); return; }
        const maxMinutes = d.max_minutes;
        const lastTick = d.last_tick_at;
        const startedAt = d.started_at;
        if (maxMinutes != null) {
          let secs = Math.max(Math.floor(Number(maxMinutes) * 60), 0);
          if (lastTick) secs = Math.max(secs - Math.floor((Date.now() - Number(lastTick)) / 1000), 0);
          resolve(secs);
        } else if (startedAt) {
          const maxSec = Math.floor((parseFloat(wallet) / (parseFloat(rate) || 1)) * 60);
          resolve(Math.max(maxSec - Math.floor((Date.now() - Number(startedAt)) / 1000), 0));
        } else {
          resolve(0);
        }
      }, { onlyOnce: true });
    } catch {
      resolve(0);
    }
  });
}

const AudioCall = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const ctx = useAudioCall();

  const st = location.state || {};

  // ── Session resolution ──
  // Three sources, tried in order:
  //   1) AudioCallContext already has an active session for this channel
  //      (resumed from the minimized bar — no refresh happened).
  //   2) router state from ChatCallingScreen (normal fresh navigation).
  //   3) NEITHER exists — this is a page refresh while sitting on this exact
  //      URL, which wipes router state. Ask the backend what's actually
  //      still active for this user instead of rendering a broken page.
  const [session, setSession] = useState(null);
  const [resolving, setResolving] = useState(true);
  const [resolveErr, setResolveErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    // FIX: Chrome (and other browsers) preserve history.state across a
    // plain page reload (F5) — it's the same navigation entry being
    // reloaded, not a fresh one. That meant location.state could still
    // look "present" right after a refresh, so the router-state branch
    // below fired and treated it as a brand-new call (seeding
    // initialElapsed: 0), instead of falling through to the backend
    // recovery branch that actually restores the true elapsed time.
    let reloaded = false;
    try {
      reloaded = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    } catch { /* Performance Navigation Timing not supported — assume not a reload */ }
    console.log('[AudioCall] resolving session — reloaded:', reloaded, 'ctx.callInfo:', ctx.callInfo, 'router state (st):', st);
    (async () => {
      if (ctx.callInfo?.channelId) {
        console.log('[AudioCall] using ctx.callInfo — wallet:', ctx.callInfo.wallet);
        // Defensive fallback: if the context's wallet is missing/empty/zero
        // for whatever reason at resume time, don't just display a fake
        // zero — go fetch the real current balance instead.
        let resumeWallet = ctx.callInfo.wallet;
        if (!resumeWallet || parseFloat(resumeWallet) <= 0) {
          console.warn('[AudioCall] ctx.callInfo.wallet was empty/zero on resume — fetching real balance from get_profile');
          try {
            const profile = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
            resumeWallet = profile?.results?.wallet ?? profile?.results_web?.wallet ?? profile?.wallet ?? resumeWallet;
            console.log('[AudioCall] fetched wallet for resume:', resumeWallet);
          } catch (err) {
            console.error('[AudioCall] failed to fetch wallet on resume:', err);
          }
        }
        if (!cancelled) {
          setSession({
            channelId: ctx.callInfo.channelId,
            astrologerId: ctx.callInfo.astrologerId,
            astroName: ctx.callInfo.astroName,
            astrologerImage: ctx.callInfo.astroImage,
            rate: ctx.callInfo.rate,
            wallet: resumeWallet,
            // Same-session resume (minimized bar → reopened, no refresh
            // happened) — the context already ticked this up correctly
            // while minimized, so it's the authoritative value.
            initialElapsed: ctx.elapsedSeconds || 0,
          });
          setResolving(false);
        }
        return;
      }
      if (!reloaded && (st.channelId || st.gid)) {
        console.log('[AudioCall] using router state — st.wallet:', st.wallet, '(typeof:', typeof st.wallet, ')');
        if (!cancelled) {
          setSession({
            channelId: st.channelId || st.gid,
            astrologerId: st.astrologer_id || id,
            astroName: st.astroName || 'Astrologer',
            astrologerImage: st.astrologerImage || '',
            rate: st.rate || 15,
            wallet: st.wallet || '210',
            // Fresh navigation straight from ChatCallingScreen — this really
            // is a brand-new call, so 0 is correct here.
            initialElapsed: 0,
          });
          setResolving(false);
        }
        return;
      }
      // Refresh recovery — no state anywhere. Ask the backend directly.
      try {
        const { result, data2 } = await lastCallList();
        const callType = String(data2?.call_type || '').toLowerCase();
        const status = String(data2?.status || '').toLowerCase();
        const matchesThisAstrologer = String(data2?.astro_id || '') === String(id);
        if (result && data2 && callType === 'audio' && ACCEPTED_STATUSES.includes(status) && matchesThisAstrologer) {
          // FIX: data2.total_amount is a recorded transaction debit amount
          // (often "0" mid-call, since no per-minute debit has posted yet —
          // see the earlier note about billing ticks not being implemented
          // server-side) — NOT the user's actual wallet balance. Using it
          // here made the time-remaining fallback compute to 0. Fetch the
          // real current balance instead, same call Astrologerdetail.jsx
          // already makes.
          let realWallet = data2.total_amount || '0';
          try {
            const profile = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
            realWallet = profile?.results?.wallet ?? profile?.results_web?.wallet ?? profile?.wallet ?? realWallet;
          } catch (err) {
            console.error('[AudioCall] failed to fetch real wallet balance for countdown fallback:', err);
          }

          if (!cancelled) {
            setSession({
              channelId: data2.channel_id,
              astrologerId: data2.astro_id,
              astroName: data2.astro_name || 'Astrologer',
              astrologerImage: data2.astro_profile_img || '',
              rate: data2.call_rate || 15,
              wallet: realWallet,
              // Refresh recovery — the whole JS runtime just reloaded, so
              // ctx.elapsedSeconds is gone (reset to 0 on the fresh
              // AudioCallProvider mount). `difference` is elapsed seconds
              // computed server-side (see /last_call_list), so it's the
              // only durable source of "how long has this call actually
              // been running" left at this point.
              initialElapsed: resolveElapsedSeconds(data2),
            });
          }
        } else {
          console.warn('[AudioCall] refresh recovery: no matching active audio call found.', { result, data2 });
          if (!cancelled) setResolveErr('This call session is no longer active.');
        }
      } catch (err) {
        console.error('[AudioCall] refresh recovery failed:', err);
        if (!cancelled) setResolveErr('Could not restore this call session.');
      } finally {
        if (!cancelled) setResolving(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const channelId = session?.channelId || '';
  const astrologer_id = String(session?.astrologerId || '');
  const name = session?.astroName || 'Astrologer';
  const pImg = session?.astrologerImage || '';
  const price = session?.rate || 15;
  const wallet = session?.wallet || '210';
  const initialElapsed = session?.initialElapsed || 0;

  const [imgErr, setImgErr] = useState(false);
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [spk, setSpk] = useState(true);
  const [onHold, setOnHold] = useState(false);
  const [err, setErr] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingReview, setRatingReview] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);

  // FIX: Remaining Balance / Time Remaining were static or dependent on
  // Firebase billing-tick fields (max_minutes/last_tick_at) nothing in the
  // backend writes yet. Both numbers are now derived directly from the
  // elapsed timer, which IS ticking correctly, so they move together and
  // stay internally consistent even without server-side billing ticks.
  const rateNum = parseFloat(price) || 0;
  const initialWalletNum = parseFloat(wallet) || 0;
  const consumed = rateNum > 0 ? (secs / 60) * rateNum : 0;
  const remainingBalance = Math.max(initialWalletNum - consumed, 0);
  const timeLeftSecs = rateNum > 0 ? Math.max(Math.floor((remainingBalance / rateNum) * 60), 0) : 0;

  const timerRef = useRef(null);
  const pollRef = useRef(null);
  const endingRef = useRef(false);
  const navRef = useRef(navigate);
  useEffect(() => { navRef.current = navigate; }, [navigate]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);
  const stopStatusPoll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  // FIX: previously always started ticking from 0 regardless of how long
  // the call had actually been running — `secs` is local component state,
  // reset to 0 on every mount, and this never looked at any external source
  // of truth before starting the interval. Now takes an explicit seed value
  // (`initialElapsed`, resolved above per-case) and applies it before the
  // interval begins, so both "resume from minimized bar" and "recovered
  // after a page refresh" show the real elapsed duration immediately.
  const startElapsedTimer = useCallback((from = 0) => {
    if (timerRef.current) return; // already running — don't reseed mid-flight
    setSecs(from);
    ctx.setElapsedSeconds(from);
    timerRef.current = setInterval(() => {
      setSecs((p) => { const n = p + 1; ctx.setElapsedSeconds(n); return n; });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEnd = useCallback(async (status = null, { remote = false } = {}) => {
    if (endingRef.current) return;
    endingRef.current = true;

    stopTimer();
    stopStatusPoll();

    ctx.setCallStatus('ended');

    const resolvedStatus = status || (ctx.callStatus === 'connected' ? 'end_user' : 'disconnect_user');
    try { if (!remote) await callStatusUpdate(channelId, resolvedStatus); } catch { /* silent */ }

    await agoraManager.leave();
    setShowRating(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, stopTimer, stopStatusPoll]);

  // FIX: previously used navigate(-1), which relies on browser history —
  // but ChatCallingScreen navigates here with { replace: true }, which
  // erases history entries as it goes. By the time this page is open,
  // there's often nothing meaningful left to go "back" to except Home.
  // Navigating to a known, deterministic destination (the astrologer's
  // page) fixes that regardless of how the user got here.
  const handleMinimize = useCallback(() => {
    stopStatusPoll();
    agoraManager.clearListeners();
    ctx.minimize();
    navRef.current(`/astrologer/${astrologer_id}`, { replace: true });
  }, [ctx, stopStatusPoll, astrologer_id]);

  const startStatusPoll = useCallback(() => {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await callInitiateStatus(channelId);
        const s = extractStatus(res);
        if (s === 'reject_astro' || s === 'disconnect_user') {
          handleEnd('disconnect_user', { remote: true });
        } else if (s === 'end_astro' || s === 'end_user') {
          handleEnd('end_user', { remote: true });
        }
      } catch (err) {
        console.error('[AudioCall] status poll error:', err);
      }
    }, STATUS_POLL_MS);
  }, [channelId, handleEnd]);

  /* ── join/attach, once session resolution finishes ── */
  useEffect(() => {
    if (!channelId) return; // still resolving, or resolution failed

    // FIX: this used to call ctx.startCall() unconditionally on every
    // mount — including when just reattaching to an already-running call
    // from the minimized bar. startCall() resets callStatus back to
    // 'connecting' and elapsedSeconds to 0, which is correct for a brand
    // new call but wrong for a resume — it was fighting with the "already
    // connected" branch below that tries to restore the real elapsed time.
    // Only (re)initialize context state if this is genuinely a different
    // session than what the context already has.
    if (ctx.callInfo?.channelId !== channelId) {
      ctx.startCall({
        channelId,
        astrologerId: astrologer_id,
        astroName: name,
        astroImage: pImg,
        rate: String(price),
        wallet: String(wallet),
      });
    }
    ctx.maximize(); // we're on the full page — override any minimize from a
                    // RestoreOngoingSession race, since this page is now the
                    // authoritative source of truth for this channel.

    agoraManager.setListeners({
      onUserJoined: () => { /* no-op */ },
      onAudioStarted: () => {
        ctx.setCallStatus('connected');
        setErr('');
        // initialElapsed is 0 for a genuinely fresh call, or the backend's
        // computed elapsed seconds if this connection is a refresh-recovery
        // rejoin of an already-ongoing call. remainingBalance/timeLeftSecs
        // above pick this up automatically since they're derived from secs.
        startElapsedTimer(initialElapsed);
      },
      onUserLeft: () => {
        handleEnd('end_astro', { remote: true });
      },
      onError: (msg) => setErr(msg),
    });

    if (agoraManager.isConnected && agoraManager.channelId === channelId) {
      // Same-session resume (minimized bar reopened, no refresh happened) —
      // AudioCallContext already ticked elapsedSeconds up correctly while
      // minimized, so that's the value to seed from, not initialElapsed.
      ctx.setCallStatus('connected');
      startElapsedTimer(ctx.elapsedSeconds || initialElapsed);
    } else {
      fetchAgoraToken(channelId).then((token) => {
        if (!token) { setErr('Could not get an Agora token for this call.'); return; }
        agoraManager.join(channelId, token);
      });
    }

    startStatusPoll();

    return () => {
      stopTimer();
      stopStatusPoll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    ctx.setIsMuted(next);
    agoraManager.setMuted(next);
  };
  const handleSubmitCallRating = async (payload) => {
    try {
      await addRating(channelId, payload?.rating || 5, payload?.review || '');
    } catch (err) {
      console.error('[AudioCall] add_rating failed:', err?.response?.data || err.message);
    }
  };
  const toggleSpeaker = () => {
    const next = !spk;
    setSpk(next);
    ctx.setIsSpeakerOn(next);
    agoraManager.setSpeaker(next);
  };
  const toggleHold = () => {
    const next = !onHold;
    setOnHold(next);
    agoraManager.setHold(next);
  };

  const submitRating = async () => {
    try { await addRating(channelId, ratingScore || 5, ratingReview); } catch { /* silent */ }
    ctx.endCall();
    setShowRating(false);
    navRef.current('/', { replace: true });
  };
  const skipRating = () => {
    ctx.endCall();
    setShowRating(false);
    navRef.current('/', { replace: true });
  };

  const cats = ['Vedic Astrology', 'Numerology', 'Vastu', 'Kundli Matching', 'Career Guidance'];
  const lang = 'Hindi, English';
  const rating = 4.9;
  const reviews = '12,456';
  const exp = '15';

  const callState = ctx.callStatus === 'connected' ? 'connected' : ctx.callStatus === 'ended' ? 'ended' : 'connecting';

  // Still figuring out whether there's anything to show (refresh-recovery in flight)
  if (resolving) {
    return (
      <div className="ac-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Reconnecting your call…</div>
        </div>
      </div>
    );
  }

  // Resolution finished but found nothing to restore (session truly ended,
  // or this URL doesn't correspond to an active call at all).
  if (!channelId) {
    return (
      <div className="ac-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 16, padding: 28, maxWidth: 360 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', marginBottom: 6 }}>Call not available</div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{resolveErr || 'This call session is no longer active.'}</div>
          <button
            onClick={() => navRef.current(`/astrologer/${id}`, { replace: true })}
            style={{ padding: '10px 20px', borderRadius: 30, border: 'none', background: '#7b1a3a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
          >
            Back to Astrologer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-page">
      <div className="ac-main">

        {/* ══ LEFT ══ */}
        <div className="ac-left">
          <motion.div className="ac-lcard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
            <div className="ac-lcard-title"><i className="fas fa-calendar-check" /> Consultation Details</div>
            {[
              { lbl: 'Topic', val: 'Consultation' },
              { lbl: 'Astrologer', val: name, icon: true },
              { lbl: 'Experience', val: `${exp}+ Years` },
              { lbl: 'Language', val: lang },
              { lbl: 'Call Type', val: 'Audio Call' },
              { lbl: 'Rate', val: `₹${price} / min` },
              { lbl: 'Remaining Balance', val: `₹${Math.round(remainingBalance)}` },
            ].map((r) => (
              <div key={r.lbl} className="ac-drow">
                <div className="ac-dlbl">{r.lbl}</div>
                <div className="ac-dval">{r.val}{r.icon && <i className="fas fa-check-circle" />}</div>
              </div>
            ))}
          </motion.div>

          <motion.div className="ac-lcard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.07 }}>
            <div className="ac-rtitle"><i className="fas fa-star" /> Astrologer Rating</div>
            <div className="ac-rscore"><i className="fas fa-star" /><span>{rating} ({reviews} Reviews)</span></div>
            {BARS.map((b) => (
              <div key={b.lbl} className="ac-brow">
                <span className="ac-blbl">{b.lbl}</span>
                <div className="ac-btrack"><div className="ac-bfill" style={{ width: `${b.pct}%`, background: b.color }} /></div>
                <span className="ac-bpct">{b.pct}%</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ CENTER ══ */}
        <div className="ac-center">
          <motion.div className="ac-callcard" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.26 }}>
            <div className="ac-enc">
              <i className="fas fa-lock" />
              <div>
                <div className="ac-enc-t">End-to-end Encrypted</div>
                <div className="ac-enc-s">Your privacy is 100% protected</div>
              </div>
            </div>
            <button className="ac-infobtn" onClick={handleMinimize}><i className="fas fa-chevron-left" /> Minimize</button>

            <div className="ac-calltop">
              <div className="ac-calllbl">
                {callState === 'connected' ? (onHold ? 'On Hold' : 'Audio Call') : callState === 'ended' ? 'Call Ended' : 'Connecting…'}
                <div className="ac-wave">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="ac-wb" />)}</div>
              </div>
              <div className="ac-timer">{fmt(secs)}</div>
            </div>

            {err && <div style={{ color: '#dc2626', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>{err}</div>}

            {callState === 'connected' && (
              <div style={{ textAlign: 'center', fontSize: 12, color: timeLeftSecs < 60 ? '#dc2626' : '#9ca3af', marginBottom: 8 }}>
                Time remaining: {fmtShort(timeLeftSecs)}
              </div>
            )}

            <div className="ac-avwrap">
              <div className="ac-av">
                {pImg && !imgErr
                  ? <img src={pImg} alt={name} onError={() => setImgErr(true)} />
                  : <div className="ac-avinit" style={{ background: `linear-gradient(135deg,${avColor(name)},${avColor(name)}99)` }}>{initials(name)}</div>}
              </div>
              <div className="ac-avbadge"><i className="fas fa-check" /></div>
            </div>

            <div className="ac-namerow">
              <span className="ac-name">{name}</span>
              <span className="ac-pill"><i className="fas fa-check-circle" /> Verified Expert</span>
            </div>
            <div className="ac-ratingrow"><i className="fas fa-star" /><span>{rating} ({reviews} Reviews)</span></div>

            <div className="ac-skills">
              {cats.map((c, i) => <span key={i} className="ac-spill"><i className="fas fa-om" /> {c}</span>)}
            </div>

            <div className="ac-ctrls">
              <button className="ac-cb" onClick={toggleSpeaker}>
                <div className="ac-cico"><i className={`fas ${spk ? 'fa-volume-up' : 'fa-volume-mute'}`} style={{ color: spk ? '#333' : '#d32f2f' }} /></div>
                <span className="ac-clbl">Speaker</span>
              </button>
              <button className="ac-cb" onClick={toggleMute}>
                <div className="ac-cico"><i className="fas fa-microphone-slash" style={{ color: muted ? '#d32f2f' : '#333' }} /></div>
                <span className="ac-clbl">{muted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button className="ac-cb" onClick={toggleHold}>
                <div className="ac-cico"><i className="fas fa-pause" style={{ color: onHold ? '#d32f2f' : '#333' }} /></div>
                <span className="ac-clbl">{onHold ? 'Resume' : 'Hold'}</span>
              </button>
              <button className="ac-cb end" onClick={() => handleEnd()}>
                <div className="ac-cico"><i className="fas fa-phone-slash" /></div>
                <span className="ac-clbl">End Call</span>
              </button>
              <button className="ac-cb" onClick={handleMinimize}>
                <div className="ac-cico"><i className="fas fa-compress" /></div>
                <span className="ac-clbl">Minimize</span>
              </button>
            </div>
          </motion.div>

          <motion.div className="ac-actions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.12 }}>
            {[
              { icon: 'fas fa-share-alt', lbl: 'Share Details', sub: 'Share your birth details or documents' },
              { icon: 'fas fa-sticky-note', lbl: 'Notes', sub: 'Take notes during your consultation' },
              { icon: 'fas fa-record-vinyl', lbl: 'Record Call', sub: 'Record this call for your reference' },
              { icon: 'fas fa-gift', lbl: 'Send Gift', sub: 'Show your gratitude with a gift', onClick: () => setShowGiftModal(true) },
            ].map((a) => (
              <div key={a.lbl} className="ac-act" onClick={a.onClick} style={a.onClick ? { cursor: 'pointer' } : undefined}>
                <div className="ac-aico"><i className={a.icon} /></div>
                <span className="ac-albl">{a.lbl}</span>
                <span className="ac-asub">{a.sub}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="ac-right">
          <motion.div className="ac-sum" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.1 }}>
            <div className="ac-sumtitle"><i className="fas fa-calendar-check" /> Consultation Summary</div>
            {[
              { lbl: 'Call Type', val: 'Audio Call' },
              { lbl: 'Rate', val: `₹${price} / min` },
              { lbl: 'Duration', val: fmt(secs) },
              { lbl: 'Time Remaining', val: fmtShort(timeLeftSecs) },
            ].map((r) => (
              <div key={r.lbl} className="ac-srow"><div className="ac-slbl">{r.lbl}</div><div className="ac-sval">{r.val}</div></div>
            ))}
            <div className="ac-srow"><div className="ac-slbl">Remaining Balance</div><div className="ac-sval big">₹{Math.round(remainingBalance)}</div></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.16 }}
            style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
          >
            <button
              onClick={() => setShowGiftModal(true)}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#FF6F00,#FF9800)', color: '#fff',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 14px rgba(255,111,0,0.35)',
              }}
            >
              <i className="fas fa-gift" /> Send a Blessing Gift
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.2 }}
            style={{ background: '#7b1a3a', borderRadius: 12, padding: '14px 13px', boxShadow: '0 2px 8px rgba(123,26,58,0.3)' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700,
              color: '#fff', paddingBottom: 7, marginBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.15)',
            }}>
              <i className="fas fa-om" style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }} /> Why Trust Vaidik Guru
            </div>
            {TRUST_POINTS.map((t) => (
              <div key={t.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <i className={t.icon} style={{ fontSize: 12, color: '#fff' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, marginTop: 1 }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      {/* rating dialog */}
      {showRating && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(400px,92vw)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 6px', color: '#1f2937' }}>Rate your call</h3>
            <p style={{ color: '#6b7280', fontSize: 13, marginTop: 0 }}>How was your call with {name}?</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '14px 0', fontSize: 30 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ cursor: 'pointer', color: i <= ratingScore ? '#f5a623' : '#d1d5db' }} onClick={() => setRatingScore(i)}>★</span>
              ))}
            </div>
            <textarea value={ratingReview} onChange={(e) => setRatingReview(e.target.value)}
              placeholder="Write a short review (optional)" rows={3}
              style={{ width: '100%', borderRadius: 12, border: '1px solid #e5e7eb', padding: 10, resize: 'none', fontSize: 13 }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={skipRating} style={{ flex: 1, padding: 12, borderRadius: 30, border: '1px solid #e5e7eb', background: '#fff', fontWeight: 600, cursor: 'pointer' }}>Skip</button>
              <button onClick={submitRating} style={{ flex: 1, padding: 12, borderRadius: 30, border: 'none', background: '#7b1a3a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      <SendGiftModal
        isOpen={showGiftModal}
        onClose={() => setShowGiftModal(false)}
        astrologerName={name}
        astrologerId={astrologer_id}
        astrologerImage={pImg}
        walletBalance={wallet}
        showChatCallActions={false}
      />
   
    </div>
  );
};

export default AudioCall;
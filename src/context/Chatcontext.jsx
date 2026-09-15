<<<<<<< HEAD
/**
 * ChatContext.jsx
 *
 * Keeps the active chat session alive across navigation (so ActiveChatBar
 * floats), and runs the billing countdown synced to Firebase CallSession —
 * a faithful JS port of astroguruji's ChatContext.
 *
 * Countdown logic:
 *   - Local 1s tick counts down chatTimeLeft.
 *   - Firebase CallSession/{channelId} corrects drift on every server debit
 *     tick (seconds_remaining / max_minutes + last_tick_at).
 *   - status end_astro | end_user | wallet_empty | rejected → stop everything.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../services/liveFirebase';

const ChatContext = createContext(null);

// Literal Firebase path — deliberately not routed through a Liveconfig
// helper. A known-working reference implementation of this same feature
// builds this inline as `CallSession/${channelId}` with no wrapper at all,
// so we match that exactly rather than trusting an unverified
// fbSessionPath() we haven't been able to confirm is correct.
const sessionPath = (channelId) => `CallSession/${channelId}`;

export function ChatProvider({ children }) {
  const [chatActive, setChatActive] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [chatTimeLeft, setChatTimeLeft] = useState(0);

  const chatInfoRef = useRef(null);
  const timerRef = useRef(null);
  const activeGidRef = useRef(null);
  const firebaseSubRef = useRef(null);
  const totalDeductedSecondsRef = useRef(0);

  useEffect(() => {
    chatInfoRef.current = chatInfo;
  }, [chatInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (firebaseSubRef.current) firebaseSubRef.current();
    };
  }, []);

  // Local countdown
  useEffect(() => {
    if (!chatActive) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          activeGidRef.current = null;
          chatInfoRef.current = null;
          totalDeductedSecondsRef.current = 0;
          if (firebaseSubRef.current) {
            firebaseSubRef.current();
            firebaseSubRef.current = null;
          }
          setChatActive(false);
          setChatInfo(null);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [chatActive]);

  function resolveElapsedSeconds(data2) {
    console.log('[DEBUG] resolveElapsedSeconds — raw data2:', data2);
    const diff = Number(data2?.difference);
    if (Number.isFinite(diff) && diff >= 0) { console.log('[DEBUG] using difference:', diff); return diff; }
    if (data2?.start_time) {
      const startMs = new Date(data2.start_time).getTime();
      if (Number.isFinite(startMs)) {
        const el = Math.max(Math.floor((Date.now() - startMs) / 1000), 0);
        console.log('[DEBUG] using start_time, computed elapsed:', el);
        return el;
      }
    }
    console.log('[DEBUG] resolveElapsedSeconds falling through to 0');
    return 0;
  }

  // Subscribe to Firebase CallSession for server-authoritative time
  const subscribeFirebase = useCallback((channelId) => {
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }

    const sessionRef = ref(db, sessionPath(channelId));
    console.log('[ChatContext] subscribing to:', sessionPath(channelId));

    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const status = String(data.status ?? '');
      const maxMinutes = data.max_minutes;
      const lastTick = data.last_tick_at;
      const startedAt = data.started_at;
      const secondsRemaining = data.seconds_remaining;

      // Server ended the session
      if (['end_astro', 'end_user', 'disconnect_user', 'wallet_empty', 'rejected', 'completed', 'ended'].includes(status)) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (firebaseSubRef.current) {
          firebaseSubRef.current();
          firebaseSubRef.current = null;
        }
        activeGidRef.current = null;
        chatInfoRef.current = null;
        totalDeductedSecondsRef.current = 0;
        setChatTimeLeft(0);
        setChatActive(false);
        setChatInfo(null);
        return;
      }

      // Synchronize time left from Firebase CallSession (accounting for gift deductions)
      const secRem = data.seconds_remaining ?? data.seconds_left ?? data.time_left;
      if (secRem != null) {
        let accurate = Number(secRem);
        if (lastTick != null) {
          const elapsed = Math.floor((Date.now() - Number(lastTick)) / 1000);
          accurate = Math.max(accurate - elapsed, 0);
        }
        accurate = Math.max(0, accurate - totalDeductedSecondsRef.current);
        setChatTimeLeft((prev) => (Math.abs(prev - accurate) > 3 ? accurate : prev));
      } else if (maxMinutes != null) {
        let serverSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);
        const refTime = lastTick || startedAt || data.start_time || data.created_at;
        if (refTime) {
          const elapsed = Math.floor((Date.now() - Number(refTime)) / 1000);
          serverSeconds = Math.max(serverSeconds - elapsed, 0);
        }
        serverSeconds = Math.max(0, serverSeconds - totalDeductedSecondsRef.current);
        setChatTimeLeft((prev) => (Math.abs(prev - serverSeconds) > 3 ? serverSeconds : prev));
      }

      
    }, (err) => {
      console.error('[ChatContext] Firebase CallSession listener error:', err);
    });

    firebaseSubRef.current = () => off(sessionRef, 'value');
  }, []);

  const startChatTimer = useCallback(
    (info, initialSeconds) => {
      if (activeGidRef.current === info.gid) {
        chatInfoRef.current = info;
        setChatInfo(info);
        return;
      }
      totalDeductedSecondsRef.current = 0;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      activeGidRef.current = info.gid;
      chatInfoRef.current = info;
      setChatInfo(info);
      setChatTimeLeft(initialSeconds);
      setChatActive(true);

      const channelId = info.fbchannelID || info.gid;
      subscribeFirebase(channelId);
    },
    [subscribeFirebase]
  );

  const stopChatTimer = useCallback(() => {
    totalDeductedSecondsRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }
    activeGidRef.current = null;
    chatInfoRef.current = null;
    setChatActive(false);
    setChatInfo(null);
    setChatTimeLeft(0);
  }, []);

  const updateChatTimeLeft = useCallback((seconds) => {
    setChatTimeLeft(Math.max(0, Math.floor(seconds)));
  }, []);

  const deductChatTime = useCallback((secondsToDeduct) => {
    const s = Math.floor(Number(secondsToDeduct) || 0);
    if (s <= 0) return;
    totalDeductedSecondsRef.current += s;
    setChatTimeLeft((prev) => Math.max(0, Math.floor(prev - s)));
  }, []);

  return (
    <ChatContext.Provider
      value={{ chatActive, chatInfo, chatTimeLeft, startChatTimer, stopChatTimer, updateChatTimeLeft, deductChatTime }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
=======
/**
 * ChatContext.jsx
 *
 * Keeps the active chat session alive across navigation (so ActiveChatBar
 * floats), and runs the billing countdown synced to Firebase CallSession —
 * a faithful JS port of astroguruji's ChatContext.
 *
 * Countdown logic:
 *   - Local 1s tick counts down chatTimeLeft.
 *   - Firebase CallSession/{channelId} corrects drift on every server debit
 *     tick (seconds_remaining / max_minutes + last_tick_at).
 *   - status end_astro | end_user | wallet_empty | rejected → stop everything.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../services/liveFirebase';

const ChatContext = createContext(null);

// Literal Firebase path — deliberately not routed through a Liveconfig
// helper. A known-working reference implementation of this same feature
// builds this inline as `CallSession/${channelId}` with no wrapper at all,
// so we match that exactly rather than trusting an unverified
// fbSessionPath() we haven't been able to confirm is correct.
const sessionPath = (channelId) => `CallSession/${channelId}`;

export function ChatProvider({ children }) {
  const [chatActive, setChatActive] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [chatTimeLeft, setChatTimeLeft] = useState(0);

  const chatInfoRef = useRef(null);
  const timerRef = useRef(null);
  const activeGidRef = useRef(null);
  const firebaseSubRef = useRef(null);
  const totalDeductedSecondsRef = useRef(0);

  useEffect(() => {
    chatInfoRef.current = chatInfo;
  }, [chatInfo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (firebaseSubRef.current) firebaseSubRef.current();
    };
  }, []);

  // Local countdown
  useEffect(() => {
    if (!chatActive) return;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setChatTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          activeGidRef.current = null;
          chatInfoRef.current = null;
          totalDeductedSecondsRef.current = 0;
          if (firebaseSubRef.current) {
            firebaseSubRef.current();
            firebaseSubRef.current = null;
          }
          setChatActive(false);
          setChatInfo(null);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [chatActive]);

  function resolveElapsedSeconds(data2) {
    console.log('[DEBUG] resolveElapsedSeconds — raw data2:', data2);
    const diff = Number(data2?.difference);
    if (Number.isFinite(diff) && diff >= 0) { console.log('[DEBUG] using difference:', diff); return diff; }
    if (data2?.start_time) {
      const startMs = new Date(data2.start_time).getTime();
      if (Number.isFinite(startMs)) {
        const el = Math.max(Math.floor((Date.now() - startMs) / 1000), 0);
        console.log('[DEBUG] using start_time, computed elapsed:', el);
        return el;
      }
    }
    console.log('[DEBUG] resolveElapsedSeconds falling through to 0');
    return 0;
  }

  // Subscribe to Firebase CallSession for server-authoritative time
  const subscribeFirebase = useCallback((channelId) => {
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }

    const sessionRef = ref(db, sessionPath(channelId));
    console.log('[ChatContext] subscribing to:', sessionPath(channelId));

    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const status = String(data.status ?? '');
      const maxMinutes = data.max_minutes;
      const lastTick = data.last_tick_at;
      const startedAt = data.started_at;
      const secondsRemaining = data.seconds_remaining;

      // Server ended the session
      if (['end_astro', 'end_user', 'disconnect_user', 'wallet_empty', 'rejected', 'completed', 'ended'].includes(status)) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        if (firebaseSubRef.current) {
          firebaseSubRef.current();
          firebaseSubRef.current = null;
        }
        activeGidRef.current = null;
        chatInfoRef.current = null;
        totalDeductedSecondsRef.current = 0;
        setChatTimeLeft(0);
        setChatActive(false);
        setChatInfo(null);
        return;
      }

      // Synchronize time left from Firebase CallSession (accounting for gift deductions)
      const secRem = data.seconds_remaining ?? data.seconds_left ?? data.time_left;
      if (secRem != null) {
        let accurate = Number(secRem);
        if (lastTick != null) {
          const elapsed = Math.floor((Date.now() - Number(lastTick)) / 1000);
          accurate = Math.max(accurate - elapsed, 0);
        }
        accurate = Math.max(0, accurate - totalDeductedSecondsRef.current);
        setChatTimeLeft((prev) => (Math.abs(prev - accurate) > 3 ? accurate : prev));
      } else if (maxMinutes != null) {
        let serverSeconds = Math.max(Math.floor(Number(maxMinutes) * 60), 0);
        const refTime = lastTick || startedAt || data.start_time || data.created_at;
        if (refTime) {
          const elapsed = Math.floor((Date.now() - Number(refTime)) / 1000);
          serverSeconds = Math.max(serverSeconds - elapsed, 0);
        }
        serverSeconds = Math.max(0, serverSeconds - totalDeductedSecondsRef.current);
        setChatTimeLeft((prev) => (Math.abs(prev - serverSeconds) > 3 ? serverSeconds : prev));
      }

      
    }, (err) => {
      console.error('[ChatContext] Firebase CallSession listener error:', err);
    });

    firebaseSubRef.current = () => off(sessionRef, 'value');
  }, []);

  const startChatTimer = useCallback(
    (info, initialSeconds) => {
      if (activeGidRef.current === info.gid) {
        chatInfoRef.current = info;
        setChatInfo(info);
        return;
      }
      totalDeductedSecondsRef.current = 0;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      activeGidRef.current = info.gid;
      chatInfoRef.current = info;
      setChatInfo(info);
      setChatTimeLeft(initialSeconds);
      setChatActive(true);

      const channelId = info.fbchannelID || info.gid;
      subscribeFirebase(channelId);
    },
    [subscribeFirebase]
  );

  const stopChatTimer = useCallback(() => {
    totalDeductedSecondsRef.current = 0;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (firebaseSubRef.current) {
      firebaseSubRef.current();
      firebaseSubRef.current = null;
    }
    activeGidRef.current = null;
    chatInfoRef.current = null;
    setChatActive(false);
    setChatInfo(null);
    setChatTimeLeft(0);
  }, []);

  const updateChatTimeLeft = useCallback((seconds) => {
    setChatTimeLeft(Math.max(0, Math.floor(seconds)));
  }, []);

  const deductChatTime = useCallback((secondsToDeduct) => {
    const s = Math.floor(Number(secondsToDeduct) || 0);
    if (s <= 0) return;
    totalDeductedSecondsRef.current += s;
    setChatTimeLeft((prev) => Math.max(0, Math.floor(prev - s)));
  }, []);

  return (
    <ChatContext.Provider
      value={{ chatActive, chatInfo, chatTimeLeft, startChatTimer, stopChatTimer, updateChatTimeLeft, deductChatTime }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
>>>>>>> aa80a669f20626b94ce61983f7f51cf2d8888024
}
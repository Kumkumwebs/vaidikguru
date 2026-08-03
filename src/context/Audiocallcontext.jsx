/**
 * AudioCallContext.jsx
 *
 * Pure UI-state holder for the active audio call — mirrors the reference
 * project's design exactly. It does NOT hold the Agora client, tracks, or
 * any join/leave logic; that all lives in agoraManager.js (a module-level
 * singleton, outside React entirely). This context only tracks what the UI
 * needs to render: status, who you're talking to, elapsed time, mute/
 * speaker/minimized flags.
 *
 * elapsedSeconds behavior:
 *   - While AudioCall.jsx is open (not minimized), IT ticks its own local
 *     timer and pushes updates into this context via setElapsedSeconds, so
 *     the value is always current if you minimize mid-tick.
 *   - While minimized, THIS context takes over ticking so ActiveCallBar
 *     keeps showing a live-incrementing timer even with the page closed.
 * Only one side ticks at a time — controlled by isMinimized + callStatus.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const AudioCallContext = createContext(null);

export function AudioCallProvider({ children }) {
  const [callStatus, _setCallStatus] = useState('idle'); // idle | connecting | ringing | connected | on_hold | ended
  const [callInfo, setCallInfo] = useState(null); // { channelId, astrologerId, astroName, astroImage, rate, wallet }
  const [elapsedSeconds, _setElapsedSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const elapsedRef = useRef(0);
  const tickerRef = useRef(null);
  const callStatusRef = useRef('idle');

  const setElapsedSeconds = useCallback((n) => {
    elapsedRef.current = n;
    _setElapsedSeconds(n);
  }, []);

  useEffect(() => { callStatusRef.current = callStatus; }, [callStatus]);

  // Ticker only runs while minimized + connected — AudioCall.jsx manages its
  // own timer whenever it's actually open, so this exists purely to keep
  // the floating ActiveCallBar's timer alive while the page is closed.
  useEffect(() => {
    if (isMinimized && callStatus === 'connected') {
      if (tickerRef.current) clearInterval(tickerRef.current);
      tickerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        _setElapsedSeconds(elapsedRef.current);
      }, 1000);
    } else if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    return () => {
      if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
    };
  }, [isMinimized, callStatus]);

  const startCall = useCallback((info) => {
    setCallInfo(info);
    _setCallStatus('connecting');
    elapsedRef.current = 0;
    _setElapsedSeconds(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsMinimized(false);
  }, []);

  const setCallStatus = useCallback((s) => { _setCallStatus(s); }, []);
  const minimize = useCallback(() => setIsMinimized(true), []);
  const maximize = useCallback(() => setIsMinimized(false), []);

  const endCall = useCallback(() => {
    _setCallStatus('idle');
    setCallInfo(null);
    elapsedRef.current = 0;
    _setElapsedSeconds(0);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setIsMinimized(false);
  }, []);

  return (
    <AudioCallContext.Provider
      value={{
        callStatus,
        callInfo,
        elapsedSeconds,
        isMuted,
        isSpeakerOn,
        isMinimized,
        startCall,
        setCallStatus,
        setElapsedSeconds,
        setIsMuted,
        setIsSpeakerOn,
        setCallInfo,
        minimize,
        maximize,
        endCall,
      }}
    >
      {children}
    </AudioCallContext.Provider>
  );
}

export function useAudioCall() {
  const ctx = useContext(AudioCallContext);
  if (!ctx) throw new Error('useAudioCall must be used inside <AudioCallProvider>');
  return ctx;
}
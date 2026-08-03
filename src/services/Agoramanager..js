import AgoraRTC from 'agora-rtc-sdk-ng';
import { AGORA_APP_ID } from './Liveconfig';

/**
 * agoraManager
 *
 * Module-level singleton — this object is created once when the module is
 * first imported and lives for the lifetime of the page load, completely
 * outside any React component tree. AudioCallContext and AudioCall.jsx never
 * hold the Agora client/tracks themselves; they only ever call into this
 * object and register listeners on it.
 *
 * Why this matters: previously the Agora client lived inside AudioCall.jsx
 * (a page component). Minimizing navigated away, which unmounted that page,
 * which ran its cleanup effect, which called leave() — actually hanging up
 * the call even though the UI still showed "connected". Since this object
 * isn't a React component at all, there's no unmount to accidentally trigger
 * a hangup — minimizing just means "nobody's listening to the events right
 * now", not "the call ended".
 *
 * Usage:
 *   agoraManager.setListeners({ onUserJoined, onAudioStarted, onUserLeft, onError });
 *   await agoraManager.join(channelId, token);
 *   agoraManager.setMuted(true);
 *   agoraManager.setHold(true);
 *   agoraManager.setSpeaker(true);
 *   agoraManager.clearListeners();   // detach screen callbacks — audio keeps playing
 *   await agoraManager.leave();      // actually hang up
 *   agoraManager.isConnected         // true once remote audio is live
 *   agoraManager.channelId           // which channel it's currently on (if any)
 */

let client = null;
let localTrack = null;
let remoteTrack = null;
let currentChannelId = '';
let listeners = {};
let connected = false;
let speakerOn = true;

function safeCall(name, ...args) {
  try {
    listeners[name]?.(...args);
  } catch (err) {
    console.error(`[agoraManager] listener "${name}" threw:`, err);
  }
}

export const agoraManager = {
  get isConnected() {
    return connected;
  },
  get channelId() {
    return currentChannelId;
  },

  setListeners(next) {
    listeners = next || {};
  },

  clearListeners() {
    listeners = {};
  },

  async join(channelId, token) {
    // Already connected to this exact channel — nothing to do. This is the
    // "resume from minimized bar" case: the screen remounts, calls join()
    // again out of habit, and we just no-op instead of double-joining.
    if (client && currentChannelId === channelId) {
      // Still let the screen know it's already live, in case it was
      // relying on onAudioStarted to kick off its own UI state.
      if (connected) safeCall('onAudioStarted');
      return;
    }
    // Switching to a different channel while one is already active — clean
    // up the old one first (shouldn't normally happen, but be safe).
    if (client) await this.leave();

    currentChannelId = channelId;
    connected = false;
    client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'audio' && user.audioTrack) {
        remoteTrack = user.audioTrack;
        remoteTrack.setVolume(0);
        remoteTrack.play();
        setTimeout(() => { remoteTrack?.setVolume(speakerOn ? 100 : 0); }, 100);
        connected = true;
        safeCall('onUserJoined');
        safeCall('onAudioStarted');
      }
    });

    client.on('user-unpublished', (user) => {
      user.audioTrack?.stop();
    });

    // Matches the astrologer actually leaving the channel — the status poll
    // (reject_astro/end_astro) is the authoritative signal for call-ended
    // logic elsewhere, but this is a useful direct fallback too.
    client.on('user-left', () => {
      connected = false;
      safeCall('onUserLeft');
    });

    try {
      if (!token) {
        safeCall('onError', 'Missing Agora token.');
        client = null;
        currentChannelId = '';
        return;
      }
      await client.join(AGORA_APP_ID, channelId, token, null);
      localTrack = await AgoraRTC.createMicrophoneAudioTrack();
      await client.publish([localTrack]);
    } catch (e) {
      const m = e?.message || '';
      if (m.includes('OPERATION_ABORTED') || m.includes('cancel token canceled')) {
        // Expected during React StrictMode's dev-only double effect
        // invocation — not a real failure.
        return;
      }
      console.error('[agoraManager] join error:', e);
      let msg = 'Could not connect to the call server.';
      if (m.includes('CAN_NOT_GET_GATEWAY_SERVER')) msg = 'Token rejected — check Agora App ID / Certificate.';
      else if (m.includes('INVALID_TOKEN')) msg = 'Invalid Agora token from backend.';
      else if (m.includes('TOKEN_EXPIRED')) msg = 'Agora token expired.';
      safeCall('onError', msg);
      client = null;
      currentChannelId = '';
    }
  },

  async leave() {
    try {
      localTrack?.stop();
      localTrack?.close();
      localTrack = null;
      remoteTrack?.stop();
      remoteTrack = null;
      await client?.leave();
    } catch { /* silent */ }
    client = null;
    connected = false;
    currentChannelId = '';
    listeners = {};
  },

  setMuted(muted) {
    localTrack?.setEnabled(!muted);
  },

  setHold(onHold) {
    localTrack?.setEnabled(!onHold);
    remoteTrack?.setVolume(onHold ? 0 : (speakerOn ? 100 : 0));
  },

  setSpeaker(on) {
    speakerOn = on;
    remoteTrack?.setVolume(on ? 100 : 0);
  },
};
/**
 * liveService.js
 *
 * JS port of astroguruji's https_service + agoraToken, pointed at DivinIq's
 * backend via liveConfig.js. Self-contained (uses fetch + bearer token) so it
 * doesn't depend on the exact signature of DivinIq's apiService.
 *
 * If you'd rather route through your existing apiService, each function below
 * is a thin wrapper you can swap — the request/response shapes are what matter.
 */

import apiService from './apiServices';
import { API_BASE, ENDPOINTS, getToken, getUserId, getUserName } from './Liveconfig';

// ── low-level helpers ─────────────────────────────────────────────────────────
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

async function post(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    // FIX: fetch's `body` must be a string/Blob/FormData — passing a raw
    // object here (as this used to do with `body: body || {}`) gets
    // silently coerced to the literal string "[object Object]" instead of
    // real JSON. This was the entire cause of the [object Object] payload.
    body: JSON.stringify(body || {}),
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: authHeaders(),
  });
  return res.json();
}

// ── channel id + kundli helpers ───────────────────────────────────────────────
/**
 * Client-generated unique channel id. This same id is:
 *   - sent to call_initiate as fb_channel_id
 *   - used to poll call_initiate_status
 *   - used as the Firebase `Group/{channelId}/...` path
 *   - used as the Agora channel name
 * Uniqueness is all that's required.
 */
export function generateChannelId() {
  const uid = getUserId() || 'u';
  const rand = Math.random().toString(36).slice(2, 8);
  return `${uid}_${Date.now()}_${rand}`;
}

/**
 * The birth-details block sent to call_initiate and posted as the first chat
 * message. Format matches astroguruji's initial Firebase message exactly.
 */
export function buildKundliString({ name, gender, dob, tob, place }) {
  const displayName = (name || getUserName() || 'User').trim();
  return [
    `Name : ${displayName}`,
    `Gender : ${gender || ''}`,
    `Birth Date : ${dob || ''}`,
    `Birth Time : ${tob || ''}`,
    `Birth Location : ${place || ''}`,
  ].join('\n');
}

// ── call handshake ────────────────────────────────────────────────────────────
/**
 * call_initiate — starts the request to the astrologer.
 * payload = { astrologer_id, call_type: 'chat'|'audio'|'video', fb_channel_id, kundli }
 *
 * NOTE per the sample response you shared:
 *   { status, message, results: null, channel_id, fb_channel_id, type }
 * The real channel id comes back at the TOP LEVEL as `channel_id`, not
 * inside `results` (which is null) and not in `fb_channel_id` (which came
 * back empty in your sample). Whatever calls this should read
 * `res.channel_id` first.
 */
export function callInitiate(payload) {
  return apiService.postBearer(ENDPOINTS.call_initiate, payload);
}

/**
 * call_initiate_status — poll every 2s.
 * status: accept_astro | reject_astro | end_astro | end_user | disconnect_user
 */
export function callInitiateStatus(channel_id) {
  return apiService.postBearer(ENDPOINTS.call_initiate_status, { channel_id });
}

/**
 * call_status_update.
 * 'disconnect_user' = cancelled while waiting | 'end_user' = user ended session
 */
export function callStatusUpdate(channel_id, status) {
  return post(ENDPOINTS.call_status_update, { channel_id, status });
}

/** add_rating after a session ends. */
export function addRating(channel_id, rating, review) {
  return post(ENDPOINTS.add_rating, {
    channel_id,
    rating: String(rating),
    review: review || '',
  });
}

/** geocode a place name → { lat, lng } (used to build the kundli). */
export async function geocode(place) {
  try {
    const data = await post(ENDPOINTS.geocode, { place });
    if (data?.status === true && data?.results) {
      return {
        lat: String(data.results.lat ?? data.results.latitude ?? '0'),
        lng: String(data.results.lng ?? data.results.longitude ?? '0'),
      };
    }
  } catch {
    /* non-fatal */
  }
  return { lat: '0', lng: '0' };
}

// ── profile / wallet ──────────────────────────────────────────────────────────
/** Live wallet balance from the profile endpoint. */
export async function getWalletBalance() {
  try {
    const w = await get(ENDPOINTS.get_profile);
    const raw =
      w?.results?.wallet ??
      w?.results_web?.wallet ??
      w?.results?.balance ??
      w?.wallet ??
      0;
    const n = Number(raw);
    return Number.isNaN(n) ? 0 : n;
  } catch {
    return 0;
  }
}


/**
 * lastCallList — used on app load to restore an in-progress session so the
 * floating bars reappear after a refresh. Defensive field mapping.
 */
export async function lastCallList() {
  try {
    const res = await post(ENDPOINTS.last_call_list, {});
    const d = res?.results ?? res?.data ?? res?.data2 ?? null;
    if (!d) return { result: false, data2: null };
    return { result: true, data2: d };
  } catch {
    return { result: false, data2: null };
  }
}

// ── file upload (chat images / voice notes) ───────────────────────────────────
/**
 * Uploads a File/Blob and returns the hosted URL string, or null on failure.
 * mp3 uses the mp3 endpoint first (server expects the .mp3 extension there).
 */
export async function uploadChatFile(file, { isAudio = false } = {}) {
  const token = getToken();
  const tryEndpoint = async (path) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // no Content-Type: browser sets multipart boundary
      body: fd,
    });
    return res.json();
  };

  try {
    let data = await tryEndpoint(isAudio ? ENDPOINTS.upload_mp3 : ENDPOINTS.upload_file);
    if (data?.status !== true || !data?.results) {
      data = await tryEndpoint(ENDPOINTS.upload_file);
    }
    if (data?.status === true && data?.results) return data.results;
  } catch {
    /* fall through */
  }
  return null;
}

// ── Agora token ───────────────────────────────────────────────────────────────
function extractToken(data) {
  return (
    data?.token ??
    data?.results?.token ??
    data?.data?.token ??
    data?.agoraToken ??
    data?.rtc_token ??
    null
  );
}

/**
 * Fetches an Agora RTC token from the backend, trying each endpoint in order.
 * Returns null if none produce a token (call will fail if App Certificate is on).
 */
export async function fetchAgoraToken(channelId) {
  for (const endpoint of ENDPOINTS.agora_token) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ channel_id: channelId }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      const token = extractToken(data);
      if (token) return token;
    } catch {
      /* try next */
    }
  }
  return null;
}
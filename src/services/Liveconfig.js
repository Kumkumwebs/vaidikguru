/**
 * liveConfig.js
 *
 * Single source of truth for the live chat + audio-call engine ported from
 * astroguruji into DivinIq. EVERYTHING that differs between the two apps lives
 * here so you never have to hunt through the code.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │  ⚠️  YOU MUST FILL IN 3 THINGS BELOW FOR REAL SESSIONS TO WORK:          │
 * │                                                                          │
 * │  1. AGORA_APP_ID   — DivinIq's own Agora App ID (must match the App ID   │
 * │                      the DivinIq *astrologer* app uses, else audio calls │
 * │                      will never connect two people together).            │
 * │                                                                          │
 * │  2. FIREBASE_CONFIG — DivinIq's own Firebase project config (same        │
 * │                      project the DivinIq astrologer app writes to, else  │
 * │                      chat messages never meet). Grab this from the       │
 * │                      Firebase console → Project settings → Web app, or   │
 * │                      from google-services.json of the astrologer app.    │
 * │                                                                          │
 * │  3. Confirm admin.diviniq.in exposes the /user_api/* endpoints listed    │
 * │      under ENDPOINTS (call_initiate, agora_token, etc.). They almost     │
 * │      certainly do — your existing endpoints already match astroguruji.   │
 * └────────────────────────────────────────────────────────────────────────┘
 */

// ── Backend ───────────────────────────────────────────────────────────────────
// DivinIq's API host (same host your existing apiService already hits).
export const API_BASE = 'https://admin.diviniq.in';

// ── Agora (audio call) ────────────────────────────────────────────────────────
// TODO(diviniq): replace with DivinIq's real Agora App ID.
// The value below is astroguruji's — it will NOT connect DivinIq users.
export const AGORA_APP_ID = '8782e154141a4c0bbc8acaa3004d21f2';

// ── Firebase (realtime chat + billing session) ────────────────────────────────
// TODO(diviniq): replace every field with DivinIq's real Firebase web config.
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCjcrKb6m-6Yn9Wx-qdkOEdgI4V0oJVQt4",
  authDomain: "astrogurujii-production.firebaseapp.com",
  databaseURL: "https://astrogurujii-production-default-rtdb.firebaseio.com",
  projectId: "astrogurujii-production",
  storageBucket: "astrogurujii-production.firebasestorage.app",
  messagingSenderId: "307653017355",
  appId: "1:307653017355:web:5b9012107424480ec8ec0e",
  measurementId: "G-77W4E12DBC"
};

// ── Auth token ────────────────────────────────────────────────────────────────
// Where DivinIq stores the logged-in user's bearer token. Adjust the key name
// if your app uses something other than "token".
export const TOKEN_KEY = 'token';
export const getToken = () => {
  try {
    return sessionStorage.getItem('token') || '';
  } catch {
    return '';
  }
};

// The logged-in user's own id. astroguruji reads this from localStorage; adjust
// the key(s) to whatever DivinIq persists at login.
export const getUserId = () => {
  try {
    return (
      localStorage.getItem('user_id') ||
      localStorage.getItem('userId') ||
      localStorage.getItem('id') ||
      ''
    );
  } catch {
    return '';
  }
};

export const getUserName = () => {
  try {
    return (
      localStorage.getItem('user_name') ||
      localStorage.getItem('name') ||
      'User'
    );
  } catch {
    return 'User';
  }
};

// ── Endpoints (relative to API_BASE) ──────────────────────────────────────────
// These mirror the Flutter/astroguruji backend contract. If DivinIq named any
// of them differently, change the string here — nothing else needs to move.
export const ENDPOINTS = {
  call_initiate: 'https://admin.diviniq.in/user_api/call_initiate',
  call_initiate_status: 'https://admin.diviniq.in/user_api/call_initiate_status',
  call_status_update: '/user_api/call_status_update',
  add_rating: '/user_api/add_rating',
  geocode: '/user_api/geocode',
  get_profile: '/user_api/get_profile',
  last_call_list: '/user_api/last_call_list',
  upload_file: '/user_api/upload_a_file',
  upload_mp3: '/user_api/upload_mp3_file',
  // Agora token — tried in order until one returns a token.
  agora_token: [
    '/user_api/agora_token',
    '/user_api/get_agora_token',
    '/user_api/token',
  ],
};

// ── Firebase paths ────────────────────────────────────────────────────────────
// Matches astroguruji exactly. The astrologer app reads/writes the same paths.
export const fbChatPath = (channelId, fromId, toId) =>
  `Group/${channelId}/${fromId}/${toId}`;
export const fbSessionPath = (channelId) => `CallSession/${channelId}`;
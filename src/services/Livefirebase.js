// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcrKb6m-6Yn9Wx-qdkOEdgI4V0oJVQt4",
  authDomain:"astrogurujii-production.firebaseapp.com",
  databaseURL: "https://astrogurujii-production-default-rtdb.firebaseio.com",
  projectId: "astrogurujii-production",
  storageBucket: "astrogurujii-production.firebasestorage.app",
  messagingSenderId:  "307653017355",
  appId:"1:307653017355:web:5b9012107424480ec8ec0e",
  measurementId: "G-77W4E12DBC"
};

// Initialize Firebase
// Vite HMR can re-execute this module without a full page reload — guard
// against calling initializeApp() twice against the same [DEFAULT] app,
// which throws app/duplicate-app.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ── Realtime Database ──
// This is the piece ChatContext.jsx / ChatConsultation.jsx actually need:
// they do `import { db } from '../services/liveFirebase'` and then use
// `ref(db, ...)`, `onValue`, `push`, `set`, `off` on it directly.
export const db = getDatabase(app);

// ── Analytics (optional) ──
// Calling getAnalytics() unconditionally can throw — e.g. during SSR,
// in browsers with tracking blocked, or where the Measurement API isn't
// supported. Since this file is a hard import for the chat feature, an
// analytics failure shouldn't be able to break chat. We check support
// first and swallow any error, exposing `analytics` as null until (if)
// it initializes.
export let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) analytics = getAnalytics(app);
    })
    .catch(() => {
      // Analytics unsupported/blocked — safe to ignore, chat doesn't depend on it.
    });
}

export default app;
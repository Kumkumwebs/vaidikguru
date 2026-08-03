// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTB6yFD8Nm3-6Lpcyt_5_7m3PC2hi1CUA",
  authDomain: "diviniq-5c0d0.firebaseapp.com",
  databaseURL: "https://diviniq-5c0d0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "diviniq-5c0d0",
  storageBucket: "diviniq-5c0d0.firebasestorage.app",
  messagingSenderId: "23211911286",
  appId: "1:23211911286:web:231a6f957fff4c72f51757",
  measurementId: "G-SGSTHWBF4D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

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
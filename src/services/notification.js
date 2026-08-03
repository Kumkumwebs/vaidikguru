import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

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

const app = initializeApp(firebaseConfig);

let messaging;

export async function initNotifications() {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log("FCM not supported in this browser");
      return;
    }

    messaging = getMessaging(app);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "BLckdlEmPiST05kuVStcbFIz11svyEmbnM47ft-7p_icVat7Gixrs2L_YynYYc3tJrdjvJPsbNr04NDSL7OVtSA"
    });

    console.log("FCM Token:", token);

    onMessage(messaging, (payload) => {
      console.log("Foreground Notification:", payload);
      const title = payload.notification?.title ?? "New notification";
      const body = payload.notification?.body ?? "";
      // Replace with a toast/snackbar instead of alert() in production
      alert(`${title}${body ? "\n" + body : ""}`);
    });

    return token;
  } catch (err) {
    console.error(err);
  }
}
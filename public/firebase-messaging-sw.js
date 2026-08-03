importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBTB6yFD8Nm3-6Lpcyt_5_7m3PC2hi1CUA",
  authDomain: "diviniq-5c0d0.firebaseapp.com",
  projectId: "diviniq-5c0d0",
  storageBucket: "diviniq-5c0d0.firebasestorage.app",
  messagingSenderId: "23211911286",
  appId: "1:23211911286:web:231a6f957fff4c72f51757",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.ico",
  });
});
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCjcrKb6m-6Yn9Wx-qdkOEdgI4V0oJVQt4",
  authDomain: "astrogurujii-production.firebaseapp.com",
  databaseURL: "https://astrogurujii-production-default-rtdb.firebaseio.com",
  projectId: "astrogurujii-production",
  storageBucket: "astrogurujii-production.firebasestorage.app",
  messagingSenderId: "307653017355",
  appId: "1:307653017355:web:5b9012107424480ec8ec0e",
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/favicon.ico",
  });
});
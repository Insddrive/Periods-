importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "ਤੁਹਾਡੀ-api-key",
  projectId: "periods-pwa",
  messagingSenderId: "1037007369851",
  appId: "1:1037007369851:web:f109f4e0eb5def1830d4d"
});

const messaging = firebase.messaging();

// ਇਹ ਫੰਕਸ਼ਨ ਉਦੋਂ ਚੱਲੇਗਾ ਜਦੋਂ ਐਪ ਬੰਦ ਹੋਵੇਗੀ
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

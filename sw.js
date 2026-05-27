importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAZQSsBTBMR4dGBkyka5VhPGB0FZ3lVtjQ",
  authDomain: "periods-pwa.firebaseapp.com",
  projectId: "periods-pwa",
  storageBucket: "periods-pwa.firebasestorage.app",
  messagingSenderId: "1037007369851",
  appId: "1:1037007369851:web:f109f4e0eb5def1830d4de"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('ਨਵਾਂ ਬੈਕਗ੍ਰਾਊਂਡ ਮੈਸੇਜ ਆਇਆ: ', payload);
  const notificationTitle = payload.notification.title || 'Periods Alert';
  const notificationOptions = {
    body: payload.notification.body,
    icon: './icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'periods-v10';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ਫਾਇਰਬੇਸ ਦੀਆਂ ਬਾਹਰੀ ਫਾਈਲਾਂ ਨੂੰ ਕੈਸ਼ ਹੋਣ ਤੋਂ ਰੋਕਣ ਲਈ
  if (new URL(request.url).origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./', copy)).catch(() => {});
          return response;
        })
        .catch(() => caches.match('./').then((res) => res || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request))
  );
});

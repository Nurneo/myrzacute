const CACHE_NAME = 'myrzacute-v5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - clear old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      scheduleNextBackgroundNotification();
      return self.clients.claim();
    })
  );
});

// Fetch Event - Optimized Caching Strategy for Mobile
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);
  const isHtml = event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/';

  if (isHtml) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});

// Notification Click Event handler for mobile PWAs
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// ── Background Notification Scheduler (Runs even when app is closed) ──
let bgTimer = null;

function scheduleNextBackgroundNotification() {
  if (bgTimer) clearTimeout(bgTimer);

  const now = new Date();
  const hours = now.getHours();

  let target = new Date(now);
  if (hours < 12) {
    target.setHours(12, 0, 0, 0);
  } else {
    target.setDate(target.getDate() + 1);
    target.setHours(0, 0, 0, 0);
  }

  const delayMs = Math.max(1000, target.getTime() - now.getTime());

  bgTimer = setTimeout(() => {
    fireBackgroundSlotNotification();
    scheduleNextBackgroundNotification();
  }, delayMs);
}

function fireBackgroundSlotNotification() {
  const currentHours = new Date().getHours();
  const isMidnight = currentHours >= 23 || currentHours < 2;

  const title = isMidnight ? 'Полночный поцелуй 🌙💋' : 'Полуденное солнце ☀️💖';
  const body = isMidnight
    ? 'Уже 00:00! Время закрыть свои прекрасные глазки, львица. Обнимаю тебя крепко-крепко и шлю полуночный поцелуй. Сладких снов! 💖'
    : 'Уже 12:00! Заглянул напомнить тебе, что ты умничка и отлично справляешься. Сияй, львица! 🦁👑';

  if (self.registration && self.registration.showNotification) {
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `myrzacute-slot-${Date.now()}`,
      vibrate: [200, 100, 200, 100, 200],
    });
  }
}

// Initial trigger on Service Worker startup
scheduleNextBackgroundNotification();

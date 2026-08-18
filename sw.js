/* ============================================
   CardSaver.pk — Service Worker (Phase 10 isValidEmail Fix)
   ============================================ */

const CACHE_NAME = 'cardsaver-v10';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/variables.css',
  './css/base.css',
  './css/animations.css',
  './css/components.css',
  './css/pages.css',
  './js/utils.js',
  './js/data.js',
  './js/notifications.js',
  './js/auth.js',
  './js/wallet.js',
  './js/deals.js',
  './js/groups.js',
  './js/admin.js',
  './js/app.js',
  './manifest.json',
  './assets/images/hero_banner.png',
  './assets/images/bank_logos.png',
  './assets/images/category_restaurants.png',
  './assets/images/category_electronics.png',
  './assets/images/category_shopping.png',
  './assets/images/category_fashion.png',
  './assets/images/kababjees_logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets Phase 10');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          event.waitUntil(
            fetch(request)
              .then(response => {
                if (response && response.status === 200) {
                  const clone = response.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(request, clone));
                }
              })
              .catch(() => {})
          );
          return cachedResponse;
        }

        return fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

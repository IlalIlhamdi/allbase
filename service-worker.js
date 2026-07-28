/* ============================================================
   ALLBASE PWA SERVICE WORKER
   Static App Shell Caching & Offline Fallback Strategy
   ============================================================ */

const CACHE_NAME = 'allbase-static-v3.1.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './favicon.png',
  './profile.jpg',
  './rahmat_ilal.jpg',
  './data/projects.json',
  './data/skills.json',
  './data/experience.json',
  './assets/css/variables.css',
  './assets/css/base.css',
  './assets/css/layout.css',
  './assets/css/components.css',
  './assets/css/animations.css',
  './assets/css/responsive.css',
  './assets/css/subpage.css',
  './assets/js/utils.js',
  './assets/js/theme.js',
  './assets/js/projects.js',
  './assets/js/filters.js',
  './assets/js/app.js',
  './assets/js/subpage.js',
  './network-converter/index.html',
  './tools/subnet-calculator/index.html',
  './college-tasks/index.html',
  './friendship-page/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ALLBASE Service Worker] Caching static app shell...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ALLBASE Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Network-first with cache fallback strategy
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
            return caches.match('./offline.html');
          }
        });
      })
  );
});

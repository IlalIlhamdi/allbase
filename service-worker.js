/* ============================================================
   ALLBASE PWA SERVICE WORKER
   Static App Shell Caching & Offline Fallback Strategy
   ============================================================ */

const CACHE_NAME = 'allbase-static-v8';
const STATIC_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './favicon.ico',
  './favicon-96.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
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
  './assets/vendor/cloudflare-speedtest/speedtest.bundle.js',
  './network-converter/index.html',
  './tools/subnet-calculator/index.html',
  './tools/ip-calculator/index.html',
  './tools/internet-speed-test/index.html',
  './tools/internet-speed-test/speed-test.css',
  './tools/internet-speed-test/speed-test.js',
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
  const url = request.url;

  // Never cache robots.txt, sitemap.xml, or non-GET requests
  if (url.includes('robots.txt') || url.includes('sitemap.xml') || request.method !== 'GET') {
    event.respondWith(fetch(request));
    return;
  }

  // Bypass service worker interception for Cloudflare SpeedTest measurement endpoints
  if (
    url.includes('speed.cloudflare.com') ||
    url.includes('__down') ||
    url.includes('__up') ||
    url.includes('__results') ||
    url.includes('turn-creds')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first with cache fallback strategy for static app shell
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

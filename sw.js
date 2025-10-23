const CACHE_NAME = '12at1-v2.0';
const urlsToCache = [
  './',
  './index.html',
  './kiemtra.html',
  './favicon.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// CACHE CÁC FILE CDN QUAN TRỌNG
const externalResources = [
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// CÀI ĐẶT - CACHE THÔNG MINH
self.addEventListener('install', event => {
  console.log('🚀 12AT1 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ App shell cached');
        return self.skipWaiting();
      })
  );
});

// KÍCH HOẠT - XÓA CACHE CŨ
self.addEventListener('activate', event => {
  console.log('🎯 12AT1 Service Worker activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH - CACHE STRATEGY THÔNG MINH
self.addEventListener('fetch', event => {
  // Bỏ qua các request không phải HTTP
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về cached response nếu có
        if (response) {
          console.log('📂 Serving from cache:', event.request.url);
          return response;
        }

        // Không có trong cache → fetch từ network
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            // Cache response mới nếu thành công
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            // Fallback khi offline
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            return new Response('📚 12AT1 - Bạn đang offline!', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// BACKGROUND SYNC (TÍNH NĂNG NÂNG CAO)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
  }
});
// Service Worker cho 12AT1 PWA
const CACHE_NAME = '12at1-pwa-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// INSTALL - Cache resources khi cài đặt
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting on install');
        return self.skipWaiting();
      })
  );
});

// ACTIVATE - Xóa cache cũ
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// FETCH - Serve từ cache hoặc network
self.addEventListener('fetch', (event) => {
  // Bỏ qua các request không phải HTTP(S)
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('[ServiceWorker] Fetch from cache:', event.request.url);
          return response;
        }

        // Clone request vì nó là stream và chỉ dùng được 1 lần
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Kiểm tra response hợp lệ
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response vì nó là stream và chỉ dùng được 1 lần
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('[ServiceWorker] Caching new resource:', event.request.url);
              });

            return response;
          })
          .catch(() => {
            // Fallback cho offline
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// BACKGROUND SYNC (nếu cần)
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);
});
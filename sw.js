const CACHE_NAME = '12at1-v2.1';
const urlsToCache = [
  '/',
  '/index.html',
  '/kiemtra.html',
  '/assets/icons/favicon.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon-180.png',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/app.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// CÀI ĐẶT SERVICE WORKER
self.addEventListener('install', event => {
  console.log('🚀 12AT1 Service Worker installing...');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ App shell cached successfully');
      })
      .catch(error => {
        console.log('❌ Cache failed:', error);
      })
  );
});

// KÍCH HOẠT SERVICE WORKER
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
    }).then(() => {
      console.log('✅ Cleanup completed');
      return self.clients.claim();
    })
  );
});

// XỬ LÝ FETCH REQUESTS
self.addEventListener('fetch', event => {
  // Bỏ qua các request không phải HTTP
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về cached response nếu có
        if (response) {
          return response;
        }
        
        // Nếu không có trong cache, fetch từ network
        return fetch(event.request)
          .then(networkResponse => {
            // Kiểm tra response hợp lệ
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone response để cache
            const responseToCache = networkResponse.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(error => {
            // Fallback cho offline
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Fallback cho các request khác
            return new Response('📚 12AT1 - Bạn đang offline! Vui lòng kết nối internet để sử dụng đầy đủ tính năng.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          });
      })
  );
});
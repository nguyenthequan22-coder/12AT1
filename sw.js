const CACHE_NAME = '12at1-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './kiemtra.html',
  './favicon.png',
  './icon-192.png', 
  './icon-512.png',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600&display=swap',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// CÀI ĐẶT - LƯU VÀO KHO
self.addEventListener('install', event => {
  console.log('🚀 Service Worker 12AT1 installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// XỬ LÝ REQUEST - PHỤC VỤ TỪ KHO
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Trả về file cached hoặc fetch từ network
        return response || fetch(event.request);
      })
  );
});

// KÍCH HOẠT
self.addEventListener('activate', event => {
  console.log('✅ Service Worker 12AT1 activated');
});
const CACHE_NAME = '12at1-no-cache';

// CÀI ĐẶT SERVICE WORKER - KHÔNG CACHE GÌ CẢ
self.addEventListener('install', event => {
  console.log('🚀 12AT1 Service Worker installing (NO CACHE)...');
  self.skipWaiting();
  
  // KHÔNG cache gì cả
  event.waitUntil(Promise.resolve());
});

// KÍCH HOẠT SERVICE WORKER - CHỈ XÓA CACHE CŨ, GIỮ APP
self.addEventListener('activate', event => {
  console.log('🎯 12AT1 Service Worker activated - KEEPING APP...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // CHỈ XÓA CACHE CŨ, GIỮ LẠI CÁC FILE APP
          if (cacheName.includes('12at1') && cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      console.log('✅ Cache cleanup completed - APP PRESERVED');
      return self.clients.claim();
    })
  );
});

// XỬ LÝ FETCH REQUESTS - LUÔN TẢI TỪ MẠNG
self.addEventListener('fetch', event => {
  // Bỏ qua các request không phải HTTP
  if (!event.request.url.startsWith('http')) return;
  
  // LUÔN TẢI TỪ MẠNG, KHÔNG BAO GIỜ DÙNG CACHE
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        return networkResponse;
      })
      .catch(error => {
        // Chỉ fallback khi mất mạng hoàn toàn
        console.log('📡 Network error, no cache available');
        return new Response('Bạn đang offline! Vui lòng kết nối internet.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
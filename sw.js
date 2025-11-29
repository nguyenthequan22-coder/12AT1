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
  console.log('🎯 Force updating app...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // XÓA TẤT CẢ CACHE CŨ
          console.log('🗑️ Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // FORCE UPDATE APP
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
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
const CACHE_NAME = 'lang-games-v1';

const urlsToCache = [

  // الصفحة الرئيسية
  '/',
  '/index.html',

  // صفحات المستويات الثلاثة
  '/three-level-page/frist-page.html',
  '/three-level-page/secondly-page.html',
  '/three-level-page/thirdly-page.html',

  // المستوى الأول
  '/frist-level/box-game.html',
  '/frist-level/capital-small-game.html',
  '/frist-level/catch-word.html',
  '/frist-level/clock-game.html',
  '/frist-level/flip-card.html',
  '/frist-level/frist-game .html',
  '/frist-level/img-basket.html',
  '/frist-level/listen-choose.html',

  // المستوى الثاني
  '/secondly-level/mail-game.html',
  '/secondly-level/pictures-word.html',
  '/secondly-level/touch-word.html',
  '/secondly-level/true-false-game.html',

  // المستوى الثالث
  '/thirdly-level/sentence-game.html',
  '/thirdly-level/whatisthis-game.html',
  '/thirdly-level/word-builder.html',

  // كل الصور
  '/logo.png',
  '/img/logo.jpg',
  '/img/box-game.jpg',
  '/img/capital-small-game.jpg',
  '/img/catch-word.jpg',
  '/img/clock-game.jpg',
  '/img/flip-card.jpg',
  '/img/frist-game.jpg',
  '/img/img-basket.jpg',
  '/img/listen-choose.jpg',
  '/img/mail-game.jpg',
  '/img/pictures-word.jpg',
  '/img/senrence-game.jpg',
  '/img/touch-word.jpg',
  '/img/true-false-game.jpg',
  '/img/whatisthis-game.jpg',
  '/img/word-builder.jpg'
];

// تثبيت وتخزين كل الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// حذف الكاش القديم عند التحديث
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// الرد من الكاش لو مفيش إنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        console.log('[SW] Offline:', event.request.url);
      });
    })
  );
});

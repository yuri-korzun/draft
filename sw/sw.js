(() => {
  const CACHE_NAME = 'static-cache';
  const urlToCache = [
    'index.html',
    'favicon.ico',
    'main.js',
    'custom.js',
    'polyfills.js',
    'runtime.js',
    'styles.css'
  ];

  const notStaticUrls = [
    'images'
  ];

  self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlToCache)));
  });

  self.addEventListener('fetch', event => {
    const relativeUrl = event.request.url.replace(event.request.referrer, '');

    if (event.request.method !=='POST') {
      if (navigator.onLine && notStaticUrls.includes(relativeUrl)) {
        return fetchAndCache(event.request);
      } else {
        event.respondWith(
          caches.match(event.request).then(response => response || fetchAndCache(event.request)))
      }
    }
  });

  function fetchAndCache (url) {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(url, response.clone());
            return response;
          });
      })
      .catch(error => {
        console.log('Request failed:', error);
      });
  }
})();

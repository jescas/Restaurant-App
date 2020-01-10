const staticCacheName = 'v1';
const total = [staticCacheName];
const cacheAssets = [
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './js/main.js',
  './js/restaurant_info.js',
  './js/private.js',
  './js/dbhelper.js',
  './data/restaurants.json',
  './imgs/1.jpg',
  './imgs/2.jpg',
  './imgs/3.jpg',
  './imgs/4.jpg',
  './imgs/5.jpg',
  './imgs/6.jpg',
  './imgs/7.jpg',
  './imgs/8.jpg',
  './imgs/9.jpg',
  './imgs/10.jpg',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      cache.addAll(cacheAssets);
    })
  );
});

self.addEventListener('activate', function(e) {
e.waitUntil(
  caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.filter(function(cacheName) {
        return cacheName.startsWith('mws-') &&
               !total.includes(cacheName);
      }).map(function(cacheName) {
        return caches.delete(cacheName);
      })
    );
  })
)});

self.addEventListener('fetch', function(e) {
  let requestUrl = new URL(e.request.url);
  let index = e.request.url + "index.html";
  if (requestUrl.origin == location.origin) {
   if (requestUrl.pathname == './') {
     e.respondWith(servePage(e.request, index));
     return;
   } e.respondWith(servePage(e.request, requestUrl.href));
   return;
  };
});

function servePage(request, customUrl) {
 return caches.open(staticCacheName).then(function(cache) {
   return cache.match(customUrl).then(function(res) {
     let netFetch = fetch(request).then(function(res) {
       cache.put(customUrl, res.clone());
       return res;
     });
     return netFetch;
   });
 });
};
'use strict';

//@ GF-MODDATE @//

importScripts('serviceworker-cache-polyfill.js');

var CURRENT_CACHES = {
  assetCache: 'gf-asset-cache-v1',
  fontCache: 'gf-font-cache-v1'
};

self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
    //@ GF-SW @//
  ];

  console.log('Handling install event: Pre-fetching:', urlsToPrefetch);

  event.waitUntil(
    caches.open(CURRENT_CACHES.assetCache)
      .then(function(cache) {
        console.log('Opened cache. Starting to cache URLs: ', urlsToPrefetch);
        return cache.addAll(urlsToPrefetch);
      })
      .catch(function(error) {
        console.error('Pre-fetching failed:', error);
      })
  );
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

function saveToCache(request, response) {
  var urlString = request.url;
  var pathname = urlString.substring(request.referrer.length);

  var cacheName = CURRENT_CACHES.assetCache;
  if (pathname.indexOf('fonts/') === 0) {
    cacheName = CURRENT_CACHES.fontCache;
  }

  caches.open(cacheName)
    .then(function(cache) {
      cache.put(request, response);
    });
}

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('Cache HIT: ', event.request.url);

          // Start Cache Update
          fetch(event.request)
            .then(function(freshResponse) {
              if (!freshResponse || freshResponse.status !== 200) {
                return;
              }

              saveToCache(event.request, freshResponse);
            })
            .catch(function(err) {
              console.warn('Unable to update cache.', err);
            });

          return response;
        }

        console.log('Cache MISS: ', event.request.url);

        return fetch(event.request)
          .then(function(response) {
            // Fonts are big - cache them if we clean
            if (!response || response.status !== 200) {
              console.log(event.request.url + ': ' + response.status);
              return response;
            }

            var urlString = event.request.url;
            var pathname = urlString.substring(event.request.referrer.length);
            console.log(pathname);
            if (
              pathname.indexOf('fonts/') === 0 ||
              pathname.indexOf('images/') === 0) {
              // Font
              var cacheResponse = response.clone();
              saveToCache(event.request, cacheResponse);
            }

            return response;
          });
      })
  );
});

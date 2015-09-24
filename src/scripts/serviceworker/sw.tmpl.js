'use strict';

//@ GF-MODDATE @//

importScripts('serviceworker-cache-polyfill.js');

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  assetCache: 'gf-asset-cache-v' + CACHE_VERSION
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

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          console.log('Found response in cache:', response);

          // Start Cache Update
          fetch(event.request)
            .then(function(freshResponse) {
              console.warn('Updating cache ', freshResponse);
              if (!freshResponse || freshResponse.status !== 200) {
                return;
              }

              caches.open(CURRENT_CACHES.assetCache)
                .then(function(cache) {
                  cache.put(event.request, freshResponse);
                });
            })
            .catch(function(err) {
              console.warn('Unable to update cache.', err);
            });

          return response;
        }

        console.log('No response found in cache. About to fetch from ' +
          'network...');

        return fetch(event.request)
          .then(function(response) {
            console.log('Response from network is:', response);

            return response;
          })
          .catch(function(error) {
            console.error('Fetching failed:', error);
            throw error;
          });
      })
  );
});

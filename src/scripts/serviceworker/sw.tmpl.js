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

self.addEventListener('push', function(event) {
  console.log('New Push.');

  event.waitUntil(
    // Get push info
    fetch('/api/push/getNotificationInfo', {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
    .then(function(response) {
      // Check if response is good, if not throw error
      if (response.status !== 200) {
        throw Error('Response from API was bad.');
      }

      console.log('Response for notification looks ok.');

      // If data return js obj
      return response.json();
    })
    .then(function(responseObj) {
      console.log('responseObj: ', responseObj);

      // Check if there is a page to cache
      if (!responseObj.data) {
        throw new Error('Incorrect response format');
      }

      if (responseObj.data.pageToCache) {
        // We have a page to cache
        return caches.open(CURRENT_CACHES.assetCache)
          .then(function(cache) {
            return cache.add(responseObj.data.pageToCache);
          })
          .then(function() {
            return responseObj;
          })
          .catch(function(error) {
            console.error('Pre-fetching failed:', error);
            return responseObj;
          })
      }

      return responseObj;
    })
    .then(function(responseObj) {
      // Show notification with image, title and message
      return self.registration.showNotification(responseObj.data.title, {
        body: responseObj.data.message,
        icon: responseObj.data.icon,
        data: {
          url: responseObj.data.pageToCache
        }
      });
    })
    .catch(function(err) {
      // Show generic push error
      return self.registration.showNotification('New Post.', {
        body: 'There is a new blog post on gauntface.com.',
        icon: '/images/notifications/icon-512x512.jpg',
        data: {
          url: '/blog'
        }
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  var desiredUrl = self.location.origin + event.notification.data.url;

  // This looks to see if their is an existing controlled page
  // focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {

      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        console.log(client);
        console.log(client.url);
        console.log(desiredUrl);
        console.log(client.url === desiredUrl);
        console.log('------------\n');
        if (client.url == desiredUrl && 'focus' in client) {
          return client.focus();
        }
      }

      return clients.openWindow(event.notification.data.url);
    })
  );
});

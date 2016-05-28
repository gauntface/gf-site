const handlePushEvent = () => {
  // Get push info
  return fetch('/api/push/getNotificationInfo', {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
  .then(response => {
    // Check if response is good, if not throw error
    if (response.status !== 200) {
      throw Error('Response from API was bad.');
    }

    // If data return js obj
    return response.json();
  })
  .then(responseObj => {
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
      .then(() => {
        return responseObj;
      })
      .catch(() => {
        return responseObj;
      });
    }

    return responseObj;
  })
  .then(responseObj => {
    // Show notification with image, title and message
    return self.registration.showNotification(responseObj.data.title, {
      body: responseObj.data.message,
      icon: responseObj.data.icon,
      data: {
        url: responseObj.data.pageToCache
      }
    });
  })
  .catch(err => {
    // Show generic push error
    return self.registration.showNotification('New Post from @GauntFace.', {
      body: 'There is a new blog post up on gauntface.com.',
      icon: '/images/notifications/icon-512x512.jpg',
      data: {
        url: '/blog'
      }
    });
  });
};

self.addEventListener('push', function(event) {
  const pushEventPromise = handlePushEvent();
  event.waitUntil(pushEventPromise);
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
        if (client.url == desiredUrl && 'focus' in client) {
          return client.focus();
        }
      }

      return clients.openWindow(event.notification.data.url);
    })
  );
});

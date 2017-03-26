const NodeCache = require('node-cache');

const logHelper = require('../utils/log-helper');

class CacheableInterface {
  constructor(cacheName) {
    if (!cacheName) {
      cacheName = 'gf-site-default-cache';
    }

    this._cache = new NodeCache(cacheName);
    this._cacheUpdates = {};
  }

  getFromCache(key) {
    return new Promise((resolve, reject) => {
      this._cache.get(key, (err, value) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(value);
      });
    });
  }

  getFromCacheAndUpdate({key, updateMethod, expiryTimeSeconds}) {
    return this.getFromCache(key)
    .then((cachedEntry) => {
      if (this.hasExpired(cachedEntry, expiryTimeSeconds)) {
        // Check if we need a new update
        if (!this._cacheUpdates[key]) {
          const updatePromise = updateMethod()
          .then((result) => {
            if (result) {
              this.saveToCache(key, result);
            }
          })
          .catch((err) => {
            logHelper.warn(`Unable to update '${key}' cache entry. ` +
              `Error Message: "${err.message}"`);
          })
          .then(() => {
            delete this._cacheUpdates[key];
          });
          this._cacheUpdates[key] = updatePromise;
        }
      }

      if (cachedEntry) {
        return cachedEntry;
      } else {
        return null;
      }
    });
  }

  hasExpired(cacheEntry, expiryTimeSeconds) {
    if (!cacheEntry) {
      return true;
    }

    if (typeof cacheEntry._updateTimestamp !== 'number') {
      return true;
    }

    const timestamp = cacheEntry._updateTimestamp;
    const expiryMilliseconds = expiryTimeSeconds * 1000;
    return (Date.now() - timestamp) > expiryMilliseconds;
  }

  saveToCache(key, value) {
    return new Promise((resolve, reject) => {
      value._updateTimestamp = Date.now();
      this._cache.set(key, value, (err, success) => {
        if (err) {
          reject(err);
          return;
        }

        if (!success) {
          reject(new Error('Cache was unsuccessful but no error given.'));
          return;
        }

        resolve();
      });
    });
  }
}

module.exports = CacheableInterface;

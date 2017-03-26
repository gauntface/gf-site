const sinon = require('sinon');

const CacheableInterface = require('../../src/models/cacheable-interface');

describe('Test CacheableInterface', function() {
  const stubs = [];

  afterEach(function() {
    stubs.forEach((stub) => {
      stub.restore();
    });
  });

  it('should manage failing update', function() {
    const interface = new CacheableInterface();
    return interface.getFromCacheAndUpdate({
      key: 'example',
      updateMethod: () => {
        return Promise.reject('Oops.');
      },
      expiryTimeSeconds: 10,
    })
    .then((result) => {
      if (result !== null) {
        throw new Error('Result should be null.');
      }
    });
  });

  it('should manage expirying and update', function() {
    const clock = sinon.useFakeTimers();
    stubs.push(clock);

    const CACHE_KEY = 'example';
    const CACHE_UPDATE = {
      msg: 'Hello - ' + Date.now(),
    };
    const CACHE_UPDATE_2 = {
      msg: 'Hello 2 - ' + Date.now(),
    };
    const CACHE_EXPIRATION = 60;

    const interface = new CacheableInterface();
    return interface.getFromCacheAndUpdate({
      key: CACHE_KEY,
      updateMethod: () => {
        return Promise.resolve(CACHE_UPDATE);
      },
      expiryTimeSeconds: CACHE_EXPIRATION,
    })
    .then((result) => {
      if (result !== null) {
        throw new Error('Result should be null.');
      }
    })
    .then(() => {
      // Update should be called this time
      // as the cache hasn't expired.
      let updateCalled = false;
      return interface.getFromCacheAndUpdate({
        key: CACHE_KEY,
        updateMethod: () => {
          updateCalled = true;
          return Promise.resolve({
            message: 'Injected Failure Message.',
          });
        },
        expiryTimeSeconds: CACHE_EXPIRATION,
      })
      .then((result) => {
        result.should.deep.equal(CACHE_UPDATE);
        updateCalled.should.equal(false);
      });
    })
    .then(() => {
      clock.tick(CACHE_EXPIRATION * 1000);
      // Update should be called this time
      // as the cache hasn't expired.
      let updateCalled = false;
      return interface.getFromCacheAndUpdate({
        key: CACHE_KEY,
        updateMethod: () => {
          updateCalled = true;
          return Promise.resolve({
            message: 'Injected Failure Message.',
          });
        },
        expiryTimeSeconds: CACHE_EXPIRATION,
      })
      .then((result) => {
        result.should.deep.equal(CACHE_UPDATE);
        updateCalled.should.equal(false);
      });
    })
    .then(() => {
      clock.tick(1);
      // Update should be called this time
      // as the cache hasn't expired.
      let updateCalled = false;
      let promiseResolve;
      return interface.getFromCacheAndUpdate({
        key: CACHE_KEY,
        updateMethod: () => {
          updateCalled = true;
          return new Promise((resolve) => {
            promiseResolve = resolve;
          });
        },
        expiryTimeSeconds: CACHE_EXPIRATION,
      })
      .then((result) => {
        result.should.deep.equal(CACHE_UPDATE);
        updateCalled.should.equal(true);
      })
      .then(() => {
        updateCalled = false;
        // This check ensures we re-use existing
        // promises rather than pile them up.
        return interface.getFromCacheAndUpdate({
          key: CACHE_KEY,
          updateMethod: () => {
            updateCalled = true;
            return Promise.reject('Injected Error.');
          },
          expiryTimeSeconds: CACHE_EXPIRATION,
        })
        .then(() => {
          updateCalled.should.equal(false);
          promiseResolve(CACHE_UPDATE_2);
        });
      });
    })
    .then(() => {
      return interface.getFromCacheAndUpdate({
        key: CACHE_KEY,
        updateMethod: () => {
          return Promise.resolve({
            message: 'Injected Failure Message.',
          });
        },
        expiryTimeSeconds: CACHE_EXPIRATION,
      })
      .then((result) => {
        result.should.deep.equal(CACHE_UPDATE_2);
      });
    });
  });
});

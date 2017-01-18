/* eslint-disable no-console */
/* eslint-env serviceworker */
/* global goog */

/** @ GF-MODDATE @ **/

importScripts('/third_party/sw-lib.min.js');

const swlib = goog.swlib;

let revisionedAssets; /** @ GF-REVISIONED-ASSETS @ **/
if (revisionedAssets) {
    swlib.cacheRevisionedAssets(revisionedAssets);
}

let unrevisionedAssets; /** @ GF-UNREVISIONED-ASSETS @ **/
if (unrevisionedAssets) {
    swlib.warmRuntimeCache(unrevisionedAssets);
}

// Revisioned Scripts
swlib.router.registerRoute(/\/scripts\/((?:.*\/)?.*\..*\.js)/, swlib.cacheOnly({
  cacheName: `sw-precaching-revisioned-v1-${self.registration.scope}`,
}));

// Revisioned Styles
swlib.router.registerRoute(/\/styles\/((?:.*\/)+.*\..*\.css)/, swlib.cacheOnly({
  cacheName: `sw-precaching-revisioned-v1-${self.registration.scope}`,
}));

swlib.router.registerRoute('/', swlib.staleWhileRevalidate({
  cacheName: `sw-precaching-unrevisioned-v1-${self.registration.scope}`,
}));

swlib.router.registerRoute(/\/styles\/((?:.*\/)+.*\.css)/,
  swlib.staleWhileRevalidate());

swlib.router.registerRoute(/\/images\/((?:.*\/)+.*)/,
  swlib.staleWhileRevalidate());

swlib.router.registerRoute('/about', new swlib.Route({
  match: () => {
    console.log(arguments);
  },
  handler: {
    handle: () => {
      console.log('Handler about.');
    },
  },
}));

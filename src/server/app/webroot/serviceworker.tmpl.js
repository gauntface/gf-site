/* eslint-disable no-console */
/* eslint-env serviceworker, browser */
/* global goog */

/** @ GF-MODDATE @ **/

/** @ GF-SWLIB-IMPORT @ **/

const swlib = goog.swlib;

let revisionedAssets; /** @ GF-REVISIONED-ASSETS @ **/

if (revisionedAssets && revisionedAssets.length > 0) {
    swlib.cacheRevisionedAssets(revisionedAssets);
}

let unrevisionedAssets; /** @ GF-UNREVISIONED-ASSETS @ **/

if (unrevisionedAssets && unrevisionedAssets.length > 0) {
    swlib.warmRuntimeCache(unrevisionedAssets);
}

swlib.router.registerRoute(/\/styles\/((?:.*\/)+.*\.css)/,
  swlib.cacheFirst());

swlib.router.registerRoute(/\/images\/((?:.*\/)+.*)/,
  swlib.staleWhileRevalidate());

swlib.router.registerRoute('/', {
  handle: (details) => {
    if (details.event.request.mode !== 'navigate') {
      return;
    }

    // const layoutId = 'headerfooter';
    const requiredTemplates = [
      // `/document?output=json&section=document`,
      // `/layout/${layoutId}?output=json&section=layout`,
      `/home.json`,
    ];
    return Promise.all(
      requiredTemplates.map((templateUrl) => {
        return fetch(templateUrl).then((response) => response.json());
      })
    )
    .then((results) => {
      return new Response('<html><body>' + results[0].html + '</body></html>', {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    });
  },
});

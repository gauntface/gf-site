/* eslint-disable no-console */
/* eslint-env serviceworker, browser */
/* global goog */

/** @ GF-MODDATE @ **/

/** @ GF-SWLIB-IMPORT @ **/
importScripts('/scripts/utils/template-builder.js');

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

    // TODO's
    // 1. How to version control /home.json, document.json, layout/id.json
    // 2. How to serve up document.json
    // 3. How to serve up layout.json
    // 4. How to make reuse of template in window and service worker
    // 5. How to make use of sw-lib caching strategies?

    const layoutId = 'headerfooter';
    const requiredTemplates = [
      `/document.json`,
      `/shell/${layoutId}.json`,
      `/home.json`,
    ];
    return Promise.all(
      requiredTemplates.map((templateUrl) => {
        // TODO: Need to get from Caches
        return fetch(templateUrl).then((response) => response.json());
      })
    )
    .then((results) => {
      const documentData = results[0];
      const shellData = results[1];
      const contentData = results[2];

      return self.GauntFace.TemplateBuilder.mergeTemplates({
        documentData, shellData, contentData,
      });
    })
    .then((completeTemplate) => {
      console.log(completeTemplate);
      return new Response(completeTemplate, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    });
  },
});

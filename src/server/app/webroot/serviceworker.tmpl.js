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

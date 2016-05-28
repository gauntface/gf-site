'use strict';

/**@ GF-MODDATE @**/

importScripts('/scripts/third_party/sw-toolbox.js');

const knownRoutes = [{
  regex: /\//,
  shellId: 'headerfooter'
}, {
  regex: /\/about/,
  shellId: 'keyart'
}, {
  regex: /\/contact/,
  shellId: 'headerfooter'
}, {
  regex: /\/blog/,
  shellId: 'headerfooter'
}, {
  regex: /\/blog\/\d\d\d\d\/\d\d?\/\d\d?\/\w*/,
  shellId: 'keyart'
}];

const ENABLE_DEBUGGING = true;
self.toolbox.options.debug = ENABLE_DEBUGGING && (location.origin === 'http://localhost');
self.toolbox.options.cache = {
  name: 'gauntface-toolbox-cache'
};

var urlsToPrefetch;/**@ GF-SW @**/

if (urlsToPrefetch) {
  self.toolbox.precache(urlsToPrefetch);
}

toolbox.router.get(/\/(\?homescreen=true)?/, toolbox.fastest);
toolbox.router.get('/contact', toolbox.fastest);
toolbox.router.get('/about', toolbox.fastest);
toolbox.router.get('/blog', toolbox.fastest);
toolbox.router.get('/blog/:year/:month/:date/:slug', toolbox.fastest);
toolbox.router.get(/https:\/\/storage.googleapis.com\/gauntface-site-uploads\/(.*)/, toolbox.fastest);
toolbox.router.get('/static/image/(.*)', toolbox.fastest);

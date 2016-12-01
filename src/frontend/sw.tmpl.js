'use strict';

/**@ GF-MODDATE @**/

importScripts('/scripts/third_party/sw-toolbox.js');

import Routes from './scripts/models/routes.js';

const routes = new Routes();

const ENABLE_DEBUGGING = false;
self.toolbox.options.debug = ENABLE_DEBUGGING && (location.hostname === 'localhost');
self.toolbox.options.cache = {
  name: 'gauntface-precache'
};

var urlsToPrefetch;/**@ GF-SW @**/

if (urlsToPrefetch) {
  self.toolbox.precache(urlsToPrefetch);
}


/**
toolbox.router.get(
  /https:\/\/storage.googleapis.com\/gauntface-site-uploads\/(.*)/,
  toolbox.fastest, IMAGE_OPTIONS);
toolbox.router.get('/static/image/(.*)', toolbox.fastest, STATIC_ASSET_OPTIONS);
**/

const manageNavigation = pathname => {
  const layoutId = routes.getLayoutForPath(pathname);
  return (request, values, options) => {
    // console.log(`RECEIVED <-------------- ${request.url}`);

    // This is not a full page render
    const requestURL = new URL(request.url);
    if (requestURL.search && requestURL.search.length > 0) {
      if (requestURL.search.indexOf('output=remote_css') !== -1) {
        // It's for remote CSS.
        return toolbox.cacheFirst(request, values, options);
      }

      console.log('');
      console.log(`Loading ${request.url} with cacheFirst`);
      console.log('');
      return toolbox.cacheOnly(request, values, options);
    }

    if (request.mode !== 'navigate') {
      console.log(`Not a navigation`);
      // return fetch(request);
    }

    return Promise.all([
      toolbox.cacheOnly(
        new Request(`/document?output=json&section=document`))
      .then(response => {
        return response.json();
      }),
      toolbox.cacheOnly(
        new Request(`/layout/${layoutId}?output=json&section=layout`))
      .then(response => {
        return response.json();
      }),
      toolbox.cacheOnly(
        new Request(request.url+`?output=json&section=content`))
      .then(response => {
        return response.json();
      })
    ])
    .then(results => {
      const document = results[0].document;
      const layout = results[1].layout;
      const content = results[2].content;

      // This code swaps empty body for body with layout
      let documentHTML = results[0].document.html;

      const bodyRegex = new RegExp(/<body[^>]*>((.|[\n\r])*)<\/body>/, 'g');
      const mainPageRegex =
        new RegExp(/<main class="page js-page">(.|\s)*?<\/main>/, 'g');
      const titleRegexp = new RegExp(/<title>(.|\s)*?<\/title>/, 'g');
      const descriptionRegexp =
        new RegExp(/<meta.*name="description".*content="(.*)">/, 'g');
      const themeColorRegexp =
        new RegExp(/<meta.* name="theme-color".*content="(.*)">/, 'g');
      const remoteStylesRegexp =
        new RegExp(/(window.GauntFace._remoteStylesheets.*=.*\[[.|\s]*)(\])/, 'g');

      const bodySearch = bodyRegex.exec(documentHTML);
      documentHTML = documentHTML.replace(bodySearch[0],
        `<body>${layout.html} ${bodySearch[1]}</body>`);

      const mainSearch = mainPageRegex.exec(documentHTML);
      documentHTML = documentHTML.replace(mainSearch[0],
        `<main class="page js-page">${content.html}</main>`);

      if (layout.css && layout.css.inline) {
        documentHTML = documentHTML.replace('</head>',
          `<style class="layout-inline-styles">${layout.css.inline}</style></head>`);
      }

      if (content.css && content.css.inline) {
        documentHTML = documentHTML.replace('</head>',
          `<style class="content-inline-styles">${content.css.inline}</style></head>`);
      }

      const titleSearch = titleRegexp.exec(documentHTML);
      documentHTML = documentHTML.replace(titleSearch[0],
        `<title>${content.title}</title>`);

      const descriptionSearch = descriptionRegexp.exec(documentHTML);
      documentHTML = documentHTML.replace(descriptionSearch[0],
        `<meta name="description" content="${content.description}"`);

      const themeColorSearch = themeColorRegexp.exec(documentHTML);
      documentHTML = documentHTML.replace(themeColorSearch[0],
        `<meta name="theme-color" content="${content.themeColor}">`)

      const remoteStylesSearch = remoteStylesRegexp.exec(documentHTML);
      documentHTML = documentHTML.replace(remoteStylesSearch[0],
        `${remoteStylesSearch[1]}'${content.css.remote}'${remoteStylesSearch[2]}`);

      return new Response(documentHTML, {
        headers: {
          'Content-Type': 'text/html'
        }
      });
    })
  };
};

toolbox.router.get('/', manageNavigation('/'));
toolbox.router.get('/about', manageNavigation('/about'));
toolbox.router.get('/contact', manageNavigation('/contact'));

toolbox.router.get(/\/images\/.*/, toolbox.cacheFirst);
toolbox.router.get(/\/scripts\/.*/, toolbox.cacheFirst);
toolbox.router.get(/\/fonts\/.*/, toolbox.cacheFirst);

toolbox.router.default = toolbox.networkFirst;

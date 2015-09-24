'use strict';

import { addAnalytics } from '../analytics';

var LoadCSS = require('./../third_party/loadCSS/loadCSS.js');

export default class BaseController {
  constructor() {
    window.GauntFace = window.GauntFace || {};

    if (this.onDOMContentLoaded) {
      this.addDOMContentLoadedCallback(() => this.onDOMContentLoaded());
    }

    // Code to handle Async Load of CSS
    window.addEventListener('load', () => {
      this.asyncLoadCSS();
    });

    addAnalytics();
    this.registerServiceWorker();
  }

  asyncLoadCSS() {
    if (!window.GauntFace || !window.GauntFace._remoteStylesheets) {
      return;
    }

    for (var i = 0; i < window.GauntFace._remoteStylesheets.length; i++) {
      LoadCSS.loadCSS(window.GauntFace._remoteStylesheets[i]);
    }
  }

  addDOMContentLoadedCallback(cb) {
    document.addEventListener('DOMContentLoaded', cb);
    if (document.readyState !== 'loading') {
      cb();
    }
  }

  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ',
          registration.scope);
      })
      .catch(function(err) {
        // registration failed
        console.log('ServiceWorker registration failed: ', err);
      });
  }
}

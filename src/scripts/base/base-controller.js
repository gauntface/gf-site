'use strict';

import { addAnalytics } from '../analytics';

var LoadCSS = require('./../third_party/loadCSS/loadCSS.js');

export default class BaseController {
  constructor() {
    addAnalytics();
    this.asyncLoadCSS();

    window.GauntFace = window.GauntFace || {};

    if (this.onDOMContentLoaded) {
      this.addDOMContentLoadedCallback(() => this.onDOMContentLoaded());
    }
  }

  asyncLoadCSS() {
    if (!window._gfRemoteStylesheets) {
      return;
    }

    for (var i = 0; i < window._gfRemoteStylesheets.length; i++) {
      LoadCSS.loadCSS(window._gfRemoteStylesheets[i]);
    }
  }

  addDOMContentLoadedCallback(cb) {
    document.addEventListener('DOMContentLoaded', cb);
    if (document.readyState !== 'loading') {
      cb();
    }
  }
}

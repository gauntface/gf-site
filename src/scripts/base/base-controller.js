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
}

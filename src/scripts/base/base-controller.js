'use strict';

import { addAnalytics } from '../analytics';

export default class BaseController {
  constructor() {
    addAnalytics();

    window.GauntFace = window.GauntFace || {};

    if (this.onDOMContentLoaded) {
      this.addDOMContentLoadedCallback(() => this.onDOMContentLoaded());
    }

    this.asyncLoadCSS();
  }

  asyncLoadCSS() {
    if (!window.GauntFace || !window.GauntFace._remoteStylesheets) {
      // No stylesheets to load
      console.log('No CSS to load');
      return;
    }

    // <3 to Paul Irish - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    var raf = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame;

    var loadCSS = () => {
      var elementToInsertLinkBefore =
        document.getElementsByTagName('script')[0];
      for (var i = 0; i < window.GauntFace._remoteStylesheets.length; i++) {
        var linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.media = 'all';
        linkElement.href = window.GauntFace._remoteStylesheets[i];

        elementToInsertLinkBefore.parentNode.insertBefore(linkElement,
          elementToInsertLinkBefore);
      }
    };

    if (raf) {
      raf(loadCSS);
    } else {
      window.addEventListener('load', loadCSS);
    }
  }

  addDOMContentLoadedCallback(cb) {
    document.addEventListener('DOMContentLoaded', cb);
    if (document.readyState !== 'loading') {
      cb();
    }
  }
}

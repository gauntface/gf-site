'use strict';

import { addAnalytics } from '../analytics';

export default class BaseController {
  constructor () {
    addAnalytics();

    window.GauntFace = window.GauntFace || {};

    if (this.onDOMContentLoaded) {
      this.addDOMContentLoadedCallback(() => this.onDOMContentLoaded());
    }
  }

  addDOMContentLoadedCallback (cb) {
    document.addEventListener('DOMContentLoaded', cb);
    if (document.readyState !== 'loading') {
      cb();
    }
  }
}

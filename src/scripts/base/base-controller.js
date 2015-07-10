'use strict';

import { addAnalytics } from '../analytics';

export default class BaseController {
  constructor () {
    addAnalytics();

    window.GauntFace = window.GauntFace || {};
  }

  onDOMContentLoaded (cb) {
    document.addEventListener('DOMContentLoaded', cb);
    if (document.readyState !== 'loading') {
      cb();
    }
  }
}

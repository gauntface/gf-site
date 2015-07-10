'use strict';

import BaseController from '../base/base-controller';
import Debug from '../debug';

class StyleguideMessageContainer extends BaseController {
  constructor () {
    super();

    super.onDOMContentLoaded(() => this.onDOMContentLoaded());
  }

  onDOMContentLoaded () {
    this.sendMessageToContainer();

    this.debug = new Debug();
  }

  sendMessageToContainer () {
    // This method let's the container know there is a new URL to
    // manage on the stack
    var pathSections = window.location.pathname.split('/');
    var value = null;
    while (pathSections.length > 0 && value === null) {
      var popValue = pathSections.pop();
      if (popValue && popValue.length > 0) {
        value = popValue;
      }
    }

    if (value === null || value === 'view') {
      return;
    }

    window.top.postMessage(value, '*');
  }
}

new StyleguideMessageContainer();

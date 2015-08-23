'use strict';

import BaseController from '../base/base-controller';
import Debug from '../debug';

class StyleguideMessageContainer extends BaseController {
  constructor() {
    super();
  }

  onDOMContentLoaded() {
    this.sendMessageToContainer();

    this.debug = new Debug();
  }

  sendMessageToContainer() {
    // This method let's the container know there is a new URL to
    // manage on the stack
    var removeTrailingSlash = window.location.pathname.replace(/^\/?|\/?$/g, '');
    var pathSections = removeTrailingSlash.split('/');
    if (pathSections.length < 4) {
      return;
    }

    var value = pathSections[pathSections.length - 2] + '/' +
      pathSections[pathSections.length - 1];

    window.top.postMessage(value, '*');
  }
}

new StyleguideMessageContainer();

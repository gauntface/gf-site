'use strict';

import BaseController from '../base/base-controller';
import Debug from '../debug';
import Toggle from '../components/toggle';

class StyleguideMessageContainer extends BaseController {
  constructor() {
    super();

    this.upgradeViews();
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

  upgradeViews() {
    var upgradeElements = [
      {
        class: '.toggle',
        cb: (element) => {
          new Toggle(element);
        }
      }
    ];

    for (var i = 0; i < upgradeElements.length; i++) {
      var upgradeInfo = upgradeElements[i];
      var elements = document.querySelectorAll(upgradeInfo.class);
      for (var j = 0; j < elements.length; j++) {
        upgradeInfo.cb(elements[j]);
      }
    }
  }
}

new StyleguideMessageContainer();

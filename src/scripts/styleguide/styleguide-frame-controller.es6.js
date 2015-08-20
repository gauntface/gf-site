'use strict';

import BaseController from '../base/base-controller';

class StyleguideViewerController extends BaseController {
  constructor () {
    super();
  }

  onDOMContentLoaded () {
    this.wrapperElement = document.querySelector(
      '.js-styleguide-window-wrapper');
    this.iframeElement = document.querySelector(
      '.js-styleguide-contents-iframe');
    this.containerElement = document.querySelector(
      '.styleguide-window-container');
    this.backBtn = document.querySelector(
      '.js-styleguide-viewoptions__backbtn');

    this.prepareButtons();
    this.updateIframeSrc();

    window.addEventListener('popstate', (e) => this.onPopState(e));

    window.addEventListener('message', (e) => this.onWindowMessage(e));
  }

  prepareButtons () {
    var buttons = [
      {
        className: 'js-styleguide-viewoptions__backbtn',
        action: () => history.back()
      },
      {
        className: 'js-styleguide-viewoptions__circle-watch',
        action: () => this.setIframeClass('is-circle-watch')
      },
      {
        className: 'js-styleguide-viewoptions__square-watch',
        action: () => this.setIframeClass('is-square-watch')
      },
      {
        className: 'js-styleguide-viewoptions__phone',
        action: () => this.setIframeClass('is-phone')
      },
      {
        className: 'js-styleguide-viewoptions__desktop',
        action: () => this.setIframeClass('is-desktop')
      },
      {
        className: 'js-styleguide-viewoptions__none',
        action: () => this.setIframeClass(null)
      },
      {
        className: 'js-styleguide-viewoptions__debug',
        action: () => this.postMessageToIframe({
            action: 'cmd',
            functionName: 'toggleBaselineGrid',
          })
      }
    ];
    for (var i = 0; i < buttons.length; i++) {
      var element = document.querySelector('.' + buttons[i].className);
      element.addEventListener('click', buttons[i].action);
    }
  }

  setIframeClass (className) {
    for (var i = 0; i < this.iframeElement.classList.length; i++) {
      if (this.wrapperElement.classList.item(i).indexOf('is-') === 0) {
        this.wrapperElement.classList.remove(this.iframeElement.classList[i]);
      }
      if (this.iframeElement.classList.item(i).indexOf('is-') === 0) {
        this.iframeElement.classList.remove(this.iframeElement.classList[i]);
      }
    }

    if (!className) {
      this.containerElement.classList.remove('is-fixed-size');
      return;
    }

    this.containerElement.classList.add('is-fixed-size');
    this.wrapperElement.classList.add(className);
    this.iframeElement.classList.add(className);
  }

  postMessageToIframe (message) {
    this.iframeElement.contentWindow.postMessage(message, '*');
  }

  updateIframeSrc () {
    var hash = window.location.hash;
    if (hash) {
      this.backBtn.disabled = false;
      var viewName = hash.substr(1);
      this.iframeElement.src = window.location.origin +
        '/styleguide/view/' +
        viewName;
    } else {
      this.backBtn.disabled = true;
      this.iframeElement.src = window.location.origin + '/styleguide/view/';
    }
  }

  onPopState (e) {
    this.updateIframeSrc();
  }

  onWindowMessage (e) {
    if (window.location.hash === '#' + e.data) {
      return;
    }

    history.pushState(null, null, '#' + e.data);
    this.backBtn.disabled = false;
  }
}

new StyleguideViewerController();

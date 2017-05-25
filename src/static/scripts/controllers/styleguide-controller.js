/* eslint-env browser */

class StyleguideController {
  constructor() {
    this._iframe = document.querySelector('.js-styleguide-iframe');
    this._gridBtn = document.querySelector('.js-styleguide-grid-btn');
    this._cssToggleBtn = document.querySelector('.js-styleguide-css-toggle');

    this._viewportPhoneBtn =
      document.querySelector('.js-styleguide-viewport-phone');
    this._viewportDesktopBtn =
      document.querySelector('.js-styleguide-viewport-desktop');
  }

  start() {
    this._initButtonClicks();
  }

  _initButtonClicks() {
    this._gridBtn.addEventListener('click', () => this.toggleGrid());
    this._cssToggleBtn.addEventListener('click', () => this.toggleAsyncCSS());
  }

  toggleGrid() {
    return this._postMessageToIframe({
      action: 'toggle-grid',
    });
  }

  toggleAsyncCSS() {
    return this._postMessageToIframe({
      action: 'toggle-css',
    });
  }

  _postMessageToIframe(msg) {
    // '*' is the "targetOrigin"
    this._iframe.contentWindow.postMessage(msg, '*');
  }
}

window.addEventListener('load', () => {
  const styleguideController = new StyleguideController();
  styleguideController.start();
});

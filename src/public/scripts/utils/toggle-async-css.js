/* eslint-env browser */

'use strict';

class ToggleAsyncCSSController {
  constructor() {
    this._displayAsyncCSS = true;
  }

  start() {
    // this.sendMessageToContainer();
    this._initMessageListener();
  }

  _initMessageListener() {
    window.addEventListener('message', (e) => {
      if(e.data.action !== 'toggle-css') {
        return;
      }

      this.toggleCSS();
    });
  }

  toggleCSS() {
    this._displayAsyncCSS = !this._displayAsyncCSS;

    const styleLinks = document.querySelectorAll('link[rel=stylesheet]');
    for (let i = 0; i < styleLinks.length; i++) {
      const styleLink = styleLinks[i];
      if (!styleLink.dataset.origMediaType) {
        const currentMedia = styleLink.media || 'all';
        styleLink.dataset.origMediaType = currentMedia;
      }

      const newMedia = this._displayAsyncCSS ? styleLink.dataset.origMediaType :
        'ZZZ';
      styleLink.media = newMedia;
    };
  }
}

window.addEventListener('load', () => {
  const controller = new ToggleAsyncCSSController();
  controller.start();
});

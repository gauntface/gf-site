/* eslint-env browser */

class AsyncFontController {
  constructor() {
    this._CSS_PATH = '/styles/fonts/fonts-async.css';
    this._CSS_CLASSNAME = 'js-async-loaded-fonts';
  }

  load() {
    // Check the fonts aren't already loaded
    if (document.querySelector(`.${this._CSS_CLASSNAME}`)) {
      return;
    }

    const linkElement = document.createElement('link');
    linkElement.classList.add(this._CSS_CLASSNAME);
    linkElement.rel = 'stylesheet';
    linkElement.media = 'all';
    linkElement.class = 'js-async-loaded-fonts';
    linkElement.href = this._CSS_PATH;

    document.head.appendChild(linkElement);
  }
}

(() => {
  const asyncFontController = new AsyncFontController();
  asyncFontController.load();
})();

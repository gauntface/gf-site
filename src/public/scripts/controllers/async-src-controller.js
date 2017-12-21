/* eslint-env browser */

class AsyncSrcController {
  start() {
    this._updateElements(document.querySelectorAll('iframe[data-src]'));
    this._updateElements(document.querySelectorAll('img[data-src]'));
  }

  _updateElements(elementsNodeList) {
    elementsNodeList.forEach((element) => {
      if (element.dataset && element.dataset.src) {
        element.src = element.dataset.src;
        element.style.opacity = '0';
        element.addEventListener('load', function(event) {
          event.target.style.opacity = 1;
          event.target.removeAttribute('data-src');
        });
      }
    });
  }
}

window.addEventListener('load', () => {
  const asyncSrcController = new AsyncSrcController();
  asyncSrcController.start();
});

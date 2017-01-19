/* eslint-env browser */

class AsyncIframeController {
  start() {
    const iframeElements = document.querySelectorAll('iframe[data-src]');
    iframeElements.forEach((iframeElement) => {
      if (iframeElement.dataset && iframeElement.dataset.src) {
        iframeElement.src = iframeElement.dataset.src;
      }
    });
  }
}

window.addEventListener('load', () => {
  const asyncStylesController = new AsyncIframeController();
  asyncStylesController.start();
});

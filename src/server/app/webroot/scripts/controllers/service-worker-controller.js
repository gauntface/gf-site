/* eslint-env browser */

/* eslint-disable */

class ServiceWorkerController {
  start() {
    return self.navigator.serviceWorker.register('/serviceworker.js');
  }
}

if (navigator.serviceWorker && false) {
  window.addEventListener('load', () => {
    const swController = new ServiceWorkerController();
    swController.start();
  });
}

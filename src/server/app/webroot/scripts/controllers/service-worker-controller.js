/* eslint-env browser */

class ServiceWorkerController {
  start() {
    return self.navigator.serviceWorker.register('/serviceworker.js');
  }
}

if (navigator.serviceWorker) {
  window.addEventListener('load', () => {
    const swController = new ServiceWorkerController();
    swController.start();
  });
}

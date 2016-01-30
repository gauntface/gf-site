import logger from './logger';

const BYPASS_SW_IN_DEV = false;

export function registerSW() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  if (window.location.hostname === 'localhost' && BYPASS_SW_IN_DEV) {
    logger('[sw.js] Disabling SW\'s due to localhost');
    navigator.serviceWorker.getRegistrations()
    .then(registrations => {
      return Promise.all(registrations.map(registration => {
        return registration.unregister();
      }));
    });
    return;
  }

  logger('[sw.js] Registering SW');

  navigator.serviceWorker.register('/sw.js')
  .catch(function(err) {
    logger('[sw.js] ServiceWorker registration failed: ', err);
  });
};

import logger from '../helpers/logger';
import ToggleComponent from '../components/toggle-component';

export default class PushController {

  constructor() {
    var success = this.prepareDomElements();
    if (!success) {
      logger('[push-controller.js] Unable to find push UI.');
      return;
    }

    logger('[push-controller.js] Initialising push UI.');

    this.STATE = {
      INITIALISING: 0,
      NOT_SUPPORTED: 1,
      PERMISSION_DENIED: 2,
      SUBSCRIBED: 3,
      UNSUBSCRIBED: 4,
      SUBSCRIBING: 5,
      UNSUBSCRIBING: 6
    };

    this._currentState = this.STATE.INITIALISING;

    this.initState();
  }

  prepareDomElements() {
    var toggleElement = document.querySelector('.js-push-notification-toggle');
    var messageElement =
      document.querySelector('.js-push-notification-message');

    if (!toggleElement || !messageElement) {
      // None or one of the elements is missing so do nothing
      return false;
    }

    this.pushContainer = document.querySelector('.footer__push-section');
    this.pushToggle = new ToggleComponent(toggleElement);
    this.pushMessageElement = messageElement;

    return true;
  }

  onNewUILoaded() {
    let success = this.prepareDomElements();
    if (!success) {
      return;
    }

    this.setState(this._currentState, true);
  }

  setState(newState, force) {
    if (this._currentState === newState && !force) {
      // Same state - nothing to do.
      return;
    }

    switch (newState) {
      case this.STATE.NOT_SUPPORTED:
        this.pushToggle.setDisabled(true);
        this.pushToggle.setChecked(false);
        this.pushContainer.style.display = 'none';
        break;
      case this.STATE.PERMISSION_DENIED:
        this.pushToggle.setDisabled(true);
        this.pushToggle.setChecked(false);
        this.pushMessageElement.textContent = 'Push notifications blocked';
        break;
      case this.STATE.UNSUBSCRIBED:
        this.pushToggle.setDisabled(false);
        this.pushToggle.setChecked(false);
        this.pushMessageElement.textContent = 'Enable push notifications';
        break;
      case this.STATE.SUBSCRIBED:
        this.pushToggle.setDisabled(false);
        this.pushToggle.setChecked(true);
        this.pushMessageElement.textContent = 'Disable push notifications';
        break;
      case this.STATE.SUBSCRIBING:
        this.pushToggle.setChecked(true);
        this.pushToggle.setDisabled(true);
        this.subscribeToPush();
        break;
      case this.STATE.UNSUBSCRIBING:
        this.pushToggle.setChecked(false);
        this.pushToggle.setDisabled(true);
        this.unsubscribeFromPush();
        break;
      case this.STATE.FAILED_SW_REGISTRATION:
        this.pushToggle.setDisabled(true);
        this.pushToggle.setChecked(false);
        this.pushMessageElement.textContent = 'Push notifications problem';
        break;
      default:
        throw new Error('Attempting to set state to unknown value: ', newState);
    }

    this._currentState = newState;
  }

  initState() {
    if (!('serviceWorker' in navigator)) {
      this.setState(this.STATE.NOT_SUPPORTED);
      return;
    }

    if (!('PushManager' in window)) {
      this.setState(this.STATE.NOT_SUPPORTED);
      return;
    }

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      this.setState(this.STATE.NOT_SUPPORTED);
      return;
    }

    if (Notification.permission === 'denied') {
      this.setState(this.STATE.PERMISSION_DENIED);
      return;
    }

    /** navigator.serviceWorker.register('/scripts/serviceworker/push.js')
    .then(pushRegistration => {
      this._registration = pushRegistration;
      return pushRegistration.pushManager.getSubscription()
      .then((subscription) => {
        this.pushToggle.addClickHandler(() => {
          if (this.pushToggle.isChecked()) {
            this.setState(this.STATE.UNSUBSCRIBING);
          } else {
            this.setState(this.STATE.SUBSCRIBING);
          }
        });

        if (!subscription) {
          this.setState(this.STATE.UNSUBSCRIBED);
          return;
        }

        // Keep your server in sync with the latest subscriptionId
        this.sendSubscriptionToServer(subscription);

        this.setState(this.STATE.SUBSCRIBED);
      });
    })
    .catch(() => {
      logger('[push-controller.js] Error when registering the push ' +
        'service worker');

      this.setState(this.STATE.FAILED_SW_REGISTRATION);
    });**/
  }

  subscribeToPush() {
    return this._registration.pushManager.subscribe({userVisibleOnly: true})
    .then((subscription) => {
      return this.sendSubscriptionToServer(subscription);
    })
    .catch((err) => {
      if (Notification.permission === 'denied') {
        this.setState(this.STATE.PERMISSION_DENIED);
        return;
      }

      // A problem occurred with the subscription; common reasons
      // include network errors, and lacking gcm_sender_id and/or
      // gcm_user_visible_only in the manifest.
      logger('[push-controller.js] Unable to subscribe to push.', err);
      this.setState(this.STATE.UNSUBSCRIBED);
    });
  }

  unsubscribeFromPush() {
    return this._registration.pushManager.getSubscription()
    .then((pushSubscription) => {
      if (!pushSubscription) {
        this.setState(this.STATE.UNSUBSCRIBED);
        return;
      }

      this.removeSubscriptionFromServer(pushSubscription);

      // We have a subscription, so call unsubscribe on it
      pushSubscription.unsubscribe()
      .then((successful) => {
        this.setState(this.STATE.UNSUBSCRIBED);
      })
      .catch((err) => {
        console.log('Unsubscription error: ', err);
        this.setState(this.STATE.UNSUBSCRIBED);
      });
    })
    .catch(function(err) {
      console.error('Error thrown while getSubscription() to unsubscribe.',
        err);
      this.setState(this.STATE.UNSUBSCRIBED);
    });
  }

  sendSubscriptionToServer(subscription) {
    logger('[push-controller.js] Subscribing with: ',
      JSON.stringify(subscription));
    return fetch('/api/push/subscribe', {
      'method': 'POST',
      'body': JSON.stringify(subscription)
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('Invalid response status');
      }

      return response.json();
    })
    .then((responseObj) => {
      if (!responseObj.data || !responseObj.data.success) {
        throw new Error('Response was not successful');
      }

      this.setState(this.STATE.SUBSCRIBED);
      // The subscription was successful
    })
    .catch((err) => {
      // The subscription was unsuccessful
      logger('Error when stashing the subscription on our server', err);
      this.setState(this.STATE.UNSUBSCRIBED);
    });
  }

  removeSubscriptionFromServer(subscription) {
    logger('Unsubscribing with: ', subscription.endpoint);
    return fetch('/api/push/unsubscribe', {
      'method': 'POST',
      'body': JSON.stringify(subscription)
    })
    .catch((err) => {
      // The unsubscription was unsuccessful
      console.log('Error when attempting to unsubscribe on our server', err);
    });
  }

}

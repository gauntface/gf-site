'use strict';

import logger from '../helpers/logger';
import whichTransition from '../helpers/which-transition-event';
import Routes from '../models/routes';

export default class AppShellController {
  constructor() {
    logger('[appshell-controller.js] Preparing app shell controller');

    this.routes_ = new Routes();
    this._currentId = this.routes_.getLayoutForPath(
      window.location.pathname
    );
  }

  getCurrentAppShellId() {
    return this._currentId;
  }

  manageHideTransition(toAppShellId) {
    // If they are the same, we have nothing else to do
    if (toAppShellId === this._currentId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        let timeoutId = null;
        const elementClassesToHide = this.getElementsToRemove(
          this._currentId, toAppShellId
        );

        if (!elementClassesToHide) {
          reject(new Error('Unable to handle transition between app shells'));
          return;
        }

        const transitionDetails = whichTransition();
        const promises = elementClassesToHide.map(elementClassToHide => {
          return new Promise(innerResolve => {
            const elementToHide =
              document.querySelector(`.${elementClassToHide}`);
            if (elementToHide.classList.contains('is-hidden')) {
              return innerResolve();
            }

            elementToHide.addEventListener(transitionDetails.eventName, () => {
              innerResolve();
            });
            elementToHide.classList.add('is-hidden');
          });
        });

        Promise.all(promises)
        .then(() => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        })
        .then(() => resolve());

        timeoutId = setTimeout(() => {
          logger('[appshell-controller.js] Timing out from animation');
          resolve();
        }, 800);
      });
    });
  }

  manageShowTransition(toAppShellId) {
    // If they are the same, we have nothing to do.
    if (toAppShellId === this._currentId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        const elementsToAdd = this.getElementsToAdd(this._currentId, toAppShellId);
        elementsToAdd.forEach(elementToAdd => {
          const element = document.querySelector(`.${elementToAdd}`);
          element.classList.remove('is-hidden');
        });
        this._currentId = toAppShellId;
        resolve();
      });
    });
  }

  manageRemovingElementsFor(toAppShellId) {
    // If they are the same, we have nothing to do.
    if (toAppShellId === this._currentId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        const elementClassesToHide = this.getElementsToRemove(
          this._currentId, toAppShellId
        );

        if (!elementClassesToHide) {
          reject(new Error('Unable to handle transition between app shells'));
          return;
        }

        elementClassesToHide.forEach(elementClassToHide => {
          const element = document.querySelector(`.${elementClassToHide}`);
          element.parentElement.removeChild(element);
        });

        resolve();
      });
    });
  }

  swapStyles(newStyles) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const newScriptElement = document.createElement('style');
        newScriptElement.classList.add('layout-inline-styles');
        newScriptElement.textContent = newStyles;

        const currentShellStyles = document.querySelector('.layout-inline-styles');
        currentShellStyles.parentElement
          .insertBefore(newScriptElement, currentShellStyles.nextSibling);
        currentShellStyles.parentElement.removeChild(currentShellStyles);

        resolve();
      });
    });
  }

  addNewElements(toAppShellId, htmlString) {
    // If they are the same, we have nothing to do.
    if (toAppShellId === this._currentId) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        const parser = new DOMParser();

        const appshellPartialDOM = parser.parseFromString(
          htmlString,
          'text/html'
        );
        const appshellPartialBody = appshellPartialDOM.querySelector('body');

        const elementsToAdd = this.getElementsToAdd(this._currentId, toAppShellId);
        elementsToAdd.forEach(elementToAdd => {
          const partialElement = appshellPartialBody.querySelector(`.${elementToAdd}`);
          partialElement.classList.add('is-hidden');
          document.body.appendChild(partialElement);
        });
        resolve();
      });
    });
  }

  getElementsToRemove(fromId, toId) {
    const values = {
      headerfooter: {
        keyart: ['js-page', 'js-footer']
      },
      keyart: {
        headerfooter: ['key_art-content__container']
      }
    };

    return values[fromId][toId];
  }

  getElementsToAdd(fromId, toId) {
    return this.getElementsToRemove(toId, fromId);
  }
}

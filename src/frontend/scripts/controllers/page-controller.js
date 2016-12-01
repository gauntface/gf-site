'use strict';

import logger from '../helpers/logger';
import whichTransition from '../helpers/which-transition-event';
import {loadCSS} from '../helpers/css';

export default class PageController {
  constructor() {
    logger('[page-controller.js] Preparing page controller');
  }

  manageHideTransition() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          const pageElement = document.querySelector('.js-page');
          pageElement.classList.add('is-hidden');
          pageElement.style.height = pageElement.offsetHeight + 'px';

          const transitionDetails = whichTransition();
          pageElement.addEventListener(transitionDetails.eventName, function() {
            resolve();
          });

          setTimeout(() => {
            resolve();
          }, 1000);
        } catch(e) {
          reject();
        }
      });
    });
  }

  manageShowTransition() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          const pageElement = document.querySelector('.js-page');
          pageElement.classList.remove('is-hidden');
          pageElement.style.height = null;

          const transitionDetails = whichTransition();
          pageElement.addEventListener(transitionDetails.eventName, function() {
            resolve();
          });

          setTimeout(() => {
            resolve();
          }, 1000);
        } catch (e) {
          reject(e);
        }

      });
    });
  }

  manageRemovingElements() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        try {
          const pageElement = document.querySelector('.js-page');
          if (!pageElement) {
            resolve();
            return;
          }

          while (pageElement.firstChild) {
            pageElement.removeChild(pageElement.firstChild);
          }

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  swapStyles(newStyles) {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          const newScriptElement = document.createElement('style');
          newScriptElement.classList.add('content-inline-styles');
          newScriptElement.textContent = newStyles;

          const currentPageStyles = document.querySelector('.content-inline-styles');
          currentPageStyles.parentElement
            .insertBefore(newScriptElement, currentPageStyles.nextSibling);
          currentPageStyles.parentElement.removeChild(currentPageStyles);

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  removeRemoteStylesheets() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        try {
          const currentStyles = document.querySelectorAll('.async-remote-styles');
          for(let i = 0; i < currentStyles.length; i++) {
            currentStyles[i].parentElement.removeChild(currentStyles[i]);
          }

          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  loadRemoteStyleets(newStylesUrl) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        try {
          loadCSS([newStylesUrl]);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  addNewElements(htmlString) {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          const parser = new DOMParser();

          const pagePartialDOM = parser.parseFromString(
            htmlString,
            'text/html'
          );
          const pageElement = document.querySelector('.js-page');
          const pagePartialBody = pagePartialDOM.querySelector('body');
          while (pagePartialBody.childNodes.length > 0) {
            pageElement.appendChild(pagePartialBody.childNodes[0]);
          }
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

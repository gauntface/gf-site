'use strict';

import logger from '../helpers/logger';
import whichTransition from '../helpers/which-transition-event';

export default class RouteController {
  constructor() {
    // Intercept all link clicks
    this._knownRoutes = [{
      regex: /\//,
      shellId: 'headerfooter'
    }, {
      regex: /\/about/,
      shellId: 'keyart'
    }, {
      regex: /\/contact/,
      shellId: 'headerfooter'
    }, {
      regex: /\/blog/,
      shellId: 'headerfooter'
    }, {
      regex: /\/blog\/\d\d\d\d\/\d\d?\/\d\d?\/\w*/,
      shellId: 'keyart'
    }];

    this._lastKnownPath = window.location.pathname;
    this._currentTransition = Promise.resolve();
    this._isTransitioning = false;

    this.interceptLinks();

    window.onpopstate = event => {
      if (
        !event.state ||
        !event.state.pathname ||
        !event.state.appshellId
      ) {
        window.location = document.location;
        return
      }

      event.preventDefault();
      this.loadPage(
        event.state.pathname,
        event.state.appshellId
      );
    };
  }

  loadPage(pathname, appshellId) {
    logger('[router-controller.js] Navigating to ' + pathname);

    this._lastKnownPath = pathname;
    this._isTransitioning = true;

    this._currentTransition = this._currentTransition
    .then(() => {
      const apiRequests = [
        this.getPartialAPIResponse(pathname)
      ];
      if (window.GauntFace.appshell.getCurrentAppShellId() !== appshellId) {
        apiRequests.push(this.getShellAPIResponse(appshellId));
      }
      return Promise.all([
          this.scrollToTop(),
          window.GauntFace.page.manageHideTransition()
        ])
        .then(() => window.GauntFace.appshell.manageHideTransition(appshellId))
        .then(() => {
          return Promise.all([
            window.GauntFace.appshell.manageRemovingElementsFor(appshellId),
            window.GauntFace.page.manageRemovingElements()
          ]);
        })
        .then(() => window.GauntFace.page.removeRemoteStylesheets())
        .then(() => this.displaySpinner())
        .then(() => Promise.all(apiRequests))
        .then(apiResponses => {
          return this.hideSpinner()
          .then(() => {
            return apiResponses;
          });
        });
    })
    .then(apiResponses => {
      const promises = [
        window.GauntFace.page.swapStyles(apiResponses[0].page.css.inline)
      ];
      if (apiResponses.length > 1) {
        promises.push(
          window.GauntFace.appshell.swapStyles(apiResponses[1].appshell.css.inline)
        );
      }
      return Promise.all(promises)
        .then(() => apiResponses);
    })
    .then(apiResponses => {
      document.title = apiResponses[0].page.title;
      let appshellPromise = Promise.resolve();
      if(apiResponses.length > 1) {
        appshellPromise = window.GauntFace.appshell.addNewElements(
          appshellId,
          apiResponses[1].appshell.html
        );
      }
      return appshellPromise
        .then(() => window.GauntFace.page.addNewElements(apiResponses[0].page.html))
        .then(() => apiResponses)
    })
    .then(apiResponses => {
      return window.GauntFace.appshell.manageShowTransition(appshellId)
      .then(() => window.GauntFace.page.manageShowTransition())
      .then(() => apiResponses);
    })
    .then(apiResponses => {
      this.interceptLinks();
      return window.GauntFace.page.loadRemoteStyleets(apiResponses[0].page.css.remote);
    })
    .catch(err => {
      logger('[route-controller.js] Error loading page', err);
      this._lastKnownPath = false;

      // This is a great last resort
      if (window.location.hostname !== 'localhost') {
        window.location = pathname;
      } else {
        logger('[route-controller.js] Avoiding forcing hard redirect to \'' +
          pathname + '\' due to localhost.');
      }
    })
    .then(() => {
      this._isTransitioning = false;
      window.GauntFace.application.pushController.onNewUILoaded();
    });
  }

  scrollToTop(passThrough) {
    return new Promise(resolve => {
      const scrollFunction = () => {
        const scrollAmount = Math.max(window.scrollY / 10, 15);
        if (document.documentElement.scrollTop === 0) {
          resolve(passThrough);
        } else {
          window.scrollBy(0, -scrollAmount);
          requestAnimationFrame(scrollFunction);
        }
      }
      requestAnimationFrame(scrollFunction);
    })
  }

  displaySpinner() {
    let spinner = document.querySelector('.page-loading-spinner');
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.classList.add('spinner');
      spinner.classList.add('page-loading-spinner');
      spinner.style.opacity = 0;

      const firstBounce = document.createElement('div');
      firstBounce.classList.add('spinner-bounce1');
      spinner.appendChild(firstBounce);

      const secondBounce = document.createElement('div');
      secondBounce.classList.add('spinner-bounce2');
      spinner.appendChild(secondBounce);

      document.body.appendChild(spinner);
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          spinner.style.opacity = 1;
          resolve();
        } catch (e) {
          reject(e);
        }
      })
    })
  }

  hideSpinner() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
            let spinner = document.querySelector('.page-loading-spinner');
            spinner.style.opacity = 0;
            resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  transitionPage(pageDom, pageCSS) {
    return new Promise((resolve, reject) => {
      // Add page styles
      const newScriptElement = document.createElement('style');
      newScriptElement.classList.add('page-inline-styles');
      newScriptElement.textContent = pageCSS;

      const currentWindowStyles = document.querySelector('.page-inline-styles');
      currentWindowStyles.parentElement
        .insertBefore(newScriptElement, currentWindowStyles.nextSibling);
      currentWindowStyles.parentElement.removeChild(currentWindowStyles);

      const transitionDetails = whichTransition();
      const pageElement = document.querySelector('.js-page');
      pageElement.classList.add('no-transition');
      pageElement.style.opacity = 0.001;

      requestAnimationFrame(() => {
        pageElement.classList.remove('no-transition');

        requestAnimationFrame(() => {
          const domChildCount = pageDom.children.length;
          for(var i = 0; i < domChildCount; i++) {
            pageElement.appendChild(pageDom.children[0]);
          }

          pageElement.style.opacity = 1;

          pageElement.addEventListener(transitionDetails.eventName, function() {
            resolve();
          });
        })
      });
    });
  }

  getShellAPIResponse(appshellId) {
    return fetch('/shell/' + appshellId + '?output=partial&section=shell')
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Invalid response status code: ' + response.status);
      }

      return response.json();
    });
  }

  getPartialAPIResponse(pathname) {
    return fetch(pathname+'?output=partial&section=page')
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Invalid response status code: ' + response.status);
      }

      return response.json();
    });
  }

  interceptLinks() {
    const anchorElements = document.querySelectorAll('a');

    const addClickHandler = anchorElement => {
      if (anchorElement.dataset.routed) {
        return;
      }

      anchorElement.addEventListener('click', (clickEvent) => {
        if (anchorElement.href.indexOf(window.location.origin) !== 0) {
          return;
        }

        // Check it's a known route
        let knownAppShellId = null;
        this._knownRoutes.forEach(route => {
          if (route.regex.test(anchorElement.href)) {
            knownAppShellId = route.shellId;
            return;
          }
        });
        if (knownAppShellId === null) {
          return;
        }

        clickEvent.preventDefault();

        if (anchorElement.pathname === this._lastKnownPath) {
          logger('[router-controller.js] Pathname matches');
          return;
        }

        if (this._isTransitioning) {
          logger('[router-controller.js] Currently transitioning');
          return;
        }

        history.pushState({
          pathname: anchorElement.pathname,
          appshellId: knownAppShellId
        }, undefined, anchorElement.pathname);

        this.loadPage(
          anchorElement.pathname,
          knownAppShellId
        );
      });
      anchorElement.dataset.routed = true;
    }

    for (var i = 0; i < anchorElements.length; i++) {
      if (!anchorElements[i].href) {
        continue;
      }

      addClickHandler(anchorElements[i]);
    }
  }
}

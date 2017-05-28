/* eslint-env browser */

'use strict';

class GridOverlayController {
  constructor() {
    this._currentGridVariant = null;
    this._gridVariants = ['dark', 'light'];

    this._debugOverlay = document.querySelector('.js-grid-overlay');
  }

  start() {
    // this.sendMessageToContainer();
    this._initMessageListener();
  }

  _initMessageListener() {
    window.addEventListener('message', (e) => {
      if(e.data.action !== 'toggle-grid') {
        return;
      }

      this.toggleGrid();
    });
  }

  toggleGrid() {
    let indexOfCurrentVariant =
      this._gridVariants.indexOf(this._currentGridVariant);
    if ((indexOfCurrentVariant + 1) >= this._gridVariants.length) {
      this.setGridClass(null);
      this.hideGrid(false);
      return;
    }

    indexOfCurrentVariant = indexOfCurrentVariant + 1;
    this.setGridClass(this._gridVariants[indexOfCurrentVariant]);
    this.showGrid();
  }

  showGrid() {
    this._debugOverlay.classList.add('is-enabled');
  }

  hideGrid() {
    this._debugOverlay.classList.remove('is-enabled');
  }

  setGridClass(newVariant) {
    if (this._currentGridVariant) {
      this._debugOverlay.classList.remove(this._currentGridVariant);
    }

    if (newVariant) {
      this._debugOverlay.classList.add(newVariant);
    }

    this._currentGridVariant = newVariant;
  }
}

window.addEventListener('load', () => {
  const controller = new GridOverlayController();
  controller.start();
});

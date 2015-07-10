'use strict';

class Debug {

  constructor() {
    this.debugElement = document.createElement('div');
    this.debugElement.classList.add('debug-element');
    document.body.appendChild(this.debugElement);

    this.currentVariant = null;
    this.variants = ['dark', 'light'];

    this.isBaselineGridEnable = function() {
      return this.debugElement.classList.contains('debug-enabled');
    };

    window.addEventListener('message', function(e) {
      console.log('Debug: Received message');
      if (e.data.action !== 'cmd') {
        return;
      }
      if (window.GauntFace.debug[e.data.functionName]) {
        window.GauntFace.debug[e.data.functionName](e.data.variable);
      } else {
        console.log('Debug received message, no method though to handle it',
          e.data);
      }
    }.bind(this));

    window.addEventListener('resize', function() {
      this.setBaselineGridHeight();
    }.bind(this));
  }

  setVariantClass (newVariant) {
    if (this.currentVariant) {
      this.debugElement.classList.remove(this.currentVariant);
    }
    this.debugElement.classList.add(newVariant);
    this.currentVariant = newVariant;
  }

  showBaselineGrid () {
    this.debugElement.classList.add('debug-enabled');
  }

  hideBaselineGrid () {
    this.debugElement.classList.remove('debug-enabled');
  }

  setEnableBaselineGrid (enable) {
    if (enable) {
      this.setBaselineGridHeight();
      this.showBaselineGrid();
    } else {
      this.hideBaselineGrid();
    }
  }


  setBaselineGridHeight () {
    this.debugElement.style.height = document.body.clientHeight + 'px';
  }

  toggleBaselineGrid () {
    var indexOfCurrentVariant = this.variants.indexOf(this.currentVariant);
    if ((indexOfCurrentVariant + 1) >= this.variants.length) {
      this.setVariantClass(null);
      this.setEnableBaselineGrid(false);
      return;
    }
    indexOfCurrentVariant = indexOfCurrentVariant + 1;
    this.setEnableBaselineGrid(true);
    this.setVariantClass(this.variants[indexOfCurrentVariant]);
  }

}

/**function initialiseDebug() {
  console.log('initialising Debug');
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.debug = window.GauntFace.debug || new Debug();
}

document.addEventListener('DOMContentLoaded', function() {
  initialiseDebug();
});

if (document.readyState !== 'loading') {
  initialiseDebug();
}**/

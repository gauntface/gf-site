'use strict';

function Debug() {
  this.debugElement = document.createElement('div');
  this.debugElement.classList.add('debug-element');
  document.body.appendChild(this.debugElement);

  this.currentVariant = null;
  this.variants = ['dark', 'light'];

  this.isBaselineGridEnable = function() {
    return this.debugElement.classList.contains('debug-enabled');
  };

  window.onmessage = function(e) {
    if (e.data.action !== 'cmd') {
      return;
    }
    if (window.GauntFace.debug[e.data.functionName]) {
      window.GauntFace.debug[e.data.functionName](e.data.variable);
    } else {
      console.log('Debug received message, no method though to handle it',
        e.data);
    }
  }.bind(this);
}

Debug.prototype.setVariantClass = function(newVariant) {
  if (this.currentVariant) {
    this.debugElement.classList.remove(this.currentVariant);
  }
  this.debugElement.classList.add(newVariant);
  this.currentVariant = newVariant;
};

Debug.prototype.showBaselineGrid = function() {
  this.debugElement.classList.add('debug-enabled');
};

Debug.prototype.hideBaselineGrid = function() {
  this.debugElement.classList.remove('debug-enabled');
};

Debug.prototype.setEnableBaselineGrid = function(enable) {
  if (enable) {
    this.setBaselineGridHeight();
    this.showBaselineGrid();
  } else {
    this.hideBaselineGrid();
  }
};


Debug.prototype.setBaselineGridHeight = function() {
  this.debugElement.style.height = document.body.clientHeight + 'px';
};

Debug.prototype.toggleBaselineGrid = function() {
  var indexOfCurrentVariant = this.variants.indexOf(this.currentVariant);
  if ((indexOfCurrentVariant + 1) >= this.variants.length) {
    this.setVariantClass(null);
    this.setEnableBaselineGrid(false);
    return;
  }
  indexOfCurrentVariant = indexOfCurrentVariant + 1;
  this.setEnableBaselineGrid(true);
  this.setVariantClass(this.variants[indexOfCurrentVariant]);
};

window.addEventListener('load', function() {
  window.GauntFace = window.GauntFace || {};
  window.GauntFace.debug = window.GauntFace.debug || new Debug();
});

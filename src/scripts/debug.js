'use strict';

export default class Debug {

  constructor() {
    this.enableRemoteStyles = true;
    this.currentVariant = null;
    this.variants = ['dark', 'light'];

    window.addEventListener('message', function(e) {
      if (e.data.action !== 'cmd') {
        return;
      }

      if (this[e.data.functionName]) {
        this[e.data.functionName](e.data.variable);
      } else {
        console.log('Debug received message, no method to handle it however.',
          e.data);
      }
    }.bind(this));
  }

  get debugElement () {
    if (typeof this.debugElement_ === 'undefined') {
      this.debugElement_ = document.createElement('div');
      this.debugElement_.classList.add('debug-element');
      document.body.appendChild(this.debugElement_);

      // Add Resize once the debug element exists
      window.addEventListener('resize', function() {
        this.setBaselineGridHeight();
      }.bind(this));
    }
    return this.debugElement_;
  }

  isBaselineGridEnabled () {
    return this.debugElement.classList.contains('debug-enabled');
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

  setBaselineGridHeight() {
    this.debugElement.style.height = document.body.clientHeight + 'px';
  }

  toggleBaselineGrid() {
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

  toggleRemoteStyles() {
    this.enableRemoteStyles = !this.enableRemoteStyles;
    var media = this.enableRemoteStyles ? 'all' : 'only x';
    var sheets = window.document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].href) {
        sheets[i].disabled = !this.enableRemoteStyles;
      }
    }
  }

}

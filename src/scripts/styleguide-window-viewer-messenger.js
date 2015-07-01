'use strict';

window.addEventListener('load', function() {
  var pathSections = window.location.pathname.split('/');
  var value = null;
  while (pathSections.length > 0 && value === null) {
    var popValue = pathSections.pop();
    if (popValue && popValue.length > 0) {
      value = popValue;
    }
  }

  if (value === null || value === 'view') {
    return;
  }

  window.top.postMessage(value, '*');
});

'use strict';

function setIframeClass(className) {
  var wrapperElement = document.querySelector('.js-styleguide-window-wrapper');
  var iframeElement = document.querySelector('.js-styleguide-contents-iframe');
  var containerElement = document.querySelector('.styleguide-window-container');
  for (var i = 0; i < iframeElement.classList.length; i++) {
    if (wrapperElement.classList.item(i).indexOf('is-') === 0) {
      wrapperElement.classList.remove(iframeElement.classList[i]);
    }
    if (iframeElement.classList.item(i).indexOf('is-') === 0) {
      iframeElement.classList.remove(iframeElement.classList[i]);
    }
  }

  if (!className) {
    containerElement.classList.remove('is-fixed-size');
    return;
  }
  containerElement.classList.add('is-fixed-size');
  wrapperElement.classList.add(className);
  iframeElement.classList.add(className);
}

function postMessageToIframe(message) {
  var iframeElement = document.querySelector('.js-styleguide-contents-iframe');
  iframeElement.contentWindow.postMessage(message, '*');
}

function updateIframeSrc() {
  var hash = window.location.hash;
  var backBtn = document.querySelector('.js-styleguide-viewoptions__backbtn');
  var iframeElement =
    document.querySelector('.js-styleguide-contents-iframe');
  if (hash) {
    backBtn.disabled = false;
    var viewName = hash.substr(1);
    iframeElement.src = window.location.origin + '/styleguide/view/' + viewName;
  } else {
    backBtn.disabled = true;
    iframeElement.src = window.location.origin + '/styleguide/view/';
  }
}

window.onmessage = function(e) {
  if (window.location.hash === '#' + e.data) {
    return;
  }

  history.pushState(null, null, '#' + e.data);
  var backBtn = document.querySelector('.js-styleguide-viewoptions__backbtn');
  backBtn.disabled = false;
};

window.addEventListener('load', function() {
  updateIframeSrc();
  var buttons = [
    {
      className: 'js-styleguide-viewoptions__backbtn',
      action: function() {
        history.back();
      }
    },
    {
      className: 'js-styleguide-viewoptions__circle-watch',
      action: function() {
        setIframeClass('is-circle-watch');
      }
    },
    {
      className: 'js-styleguide-viewoptions__square-watch',
      action: function() {
        setIframeClass('is-square-watch');
      }
    },
    {
      className: 'js-styleguide-viewoptions__phone',
      action: function() {
        setIframeClass('is-phone');
      }
    },
    {
      className: 'js-styleguide-viewoptions__desktop',
      action: function() {
        setIframeClass('is-desktop');
      }
    },
    {
      className: 'js-styleguide-viewoptions__none',
      action: function() {
        setIframeClass(null);
      }
    },
    {
      className: 'js-styleguide-viewoptions__debug',
      action: function() {
        postMessageToIframe({
          action: 'cmd',
          functionName: 'toggleBaselineGrid',
        });
      }
    }
  ];
  for (var i = 0; i < buttons.length; i++) {
    var element = document.querySelector('.' + buttons[i].className);
    element.addEventListener('click', buttons[i].action);
  }
});

window.onpopstate = function(event) {
  updateIframeSrc();
};

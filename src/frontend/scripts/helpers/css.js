import logger from './logger';

export function loadCSS(stylesheets) {
  logger('[css.js] Loading remote stylesheets.');
  var insertLinkBefore = document.getElementsByTagName('script')[0];
  for (var i = 0; i < stylesheets.length; i++) {
    var linkElement = document.createElement('link');
    linkElement.classList.add('async-remote-styles');
    linkElement.rel = 'stylesheet';
    linkElement.media = 'all';
    linkElement.href = stylesheets[i];

    insertLinkBefore.parentNode.insertBefore(linkElement,insertLinkBefore);
  }
}

function startCSSLoad() {
  logger('[css.js] Starting to load remote stylesheets.');
  if (!window.GauntFace || !window.GauntFace._remoteStylesheets) {
    logger('[css.js] No remote stylesheets to load.');
    return;
  }

  var startCSSHelper = () => {
    loadCSS(window.GauntFace._remoteStylesheets);
    delete window.GauntFace.events.onRemoteStylesheetsAvailable;
  };

  const timeoutFunction = requestIdleCallback || requestAnimationFrame ||
    function(cb) {
      setTimeout(cb, 100);
    };
  timeoutFunction(startCSSHelper);
}

export function asyncCSS() {
  window.GauntFace.events = window.GauntFace.events || {};
  window.GauntFace.events.onRemoteStylesheetsAvailable =
    window.GauntFace.events.onRemoteStylesheetsAvailable ||
    (() => {startCSSLoad();});

  startCSSLoad();
}

function startFontLoad() {
  var loadFontCSS = () => {
    const className = 'js-async-loaded-fonts';
    // Check the fonts aren't already loaded
    if (document.querySelector(`.${className}`)) {
      return;
    }

    if (!window.GauntFace || !window.GauntFace._fontStylesheet) {
      logger('[css.js] No font stylesheets to load.');
      return;
    }

    var linkElement = document.createElement('link');
    linkElement.classList.add(className);
    linkElement.rel = 'stylesheet';
    linkElement.media = 'all';
    linkElement.class = 'js-async-loaded-fonts';
    linkElement.href = window.GauntFace._fontStylesheet;

    document.head.appendChild(linkElement);
  };

  const timeoutFunction = requestIdleCallback || requestAnimationFrame ||
    function(cb) {
      setTimeout(cb, 100);
    };
  timeoutFunction(loadFontCSS);
};

export function asyncFontCSS() {
  window.GauntFace.events = window.GauntFace.events || {};
  window.GauntFace.events.onFontStylesheetAvailable =
    window.GauntFace.events.onFontStylesheetAvailable ||
    (() => {startFontLoad();});

  startFontLoad();
}

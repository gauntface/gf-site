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

  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(startCSSHelper);
  } else {
    window.addEventListener('load', startCSSHelper);
  }
}

export function asyncCSS() {
  window.GauntFace.events = window.GauntFace.events || {};
  window.GauntFace.events.onRemoteStylesheetsAvailable =
    window.GauntFace.events.onRemoteStylesheetsAvailable ||
    (() => {startCSSLoad();});

  startCSSLoad();
}

export function asyncFontCSS() {
  var startFontLoad = () => {
    const className = 'js-async-loaded-fonts';
    // Check the fonts aren't already loaded
    if (document.querySelector(`.${className}`)) {
      return;
    }

    var linkElement = document.createElement('link');
    linkElement.classList.add(className);
    linkElement.rel = 'stylesheet';
    linkElement.media = 'all';
    linkElement.class = 'js-async-loaded-fonts';
    linkElement.href = `/styles/elements/fonts.${Date.now()}.css`;

    document.head.append(linkElement);
  };

  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(startFontLoad);
  } else {
    window.addEventListener('load', startFontLoad);
  }
}

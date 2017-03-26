/* eslint-env browser */

class AsyncStylesController {
  start() {
    if (!window.GauntFace || !window.GauntFace._asyncStyles ||
      window.GauntFace._asyncStyles.length === 0) {
      return;
    }

    const asyncStyles = window.GauntFace._asyncStyles;
    asyncStyles.forEach((asyncStyle) => {
      const linkTag = document.createElement('link');
      linkTag.rel = 'stylesheet';
      linkTag.href = asyncStyle;
      document.head.appendChild(linkTag);
    });
  }
}

window.addEventListener('load', () => {
  const asyncStylesController = new AsyncStylesController();
  asyncStylesController.start();
});

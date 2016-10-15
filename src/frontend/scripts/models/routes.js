'use strict';

export default class Routes {

  constructor () {
    this._knownRoutes = [{
      regex: /\//,
      layout: 'headerfooter'
    }, {
      regex: /\/about/,
      layout: 'keyart'
    }, {
      regex: /\/contact/,
      layout: 'headerfooter'
    }, {
      regex: /\/blog/,
      layout: 'headerfooter'
    }, {
      regex: /\/blog\/\d\d\d\d\/\d\d?\/\d\d?\/\w*/,
      layout: 'keyart'
    }];

    this._routeMap = {
      '/': 'headerfooter',
      '/about': 'keyart',
      '/contact': 'headerfooter'
    };
  }

  getLayoutForPath(path) {
    let layoutId = null;
    this._knownRoutes.forEach(route => {
      if (route.regex.test(path)) {
        layoutId = route.layout;
        return;
      }
    });

    if (layoutId === null) {
      throw new Error('Unknown path for Route. ' + path);
    }

    return layoutId;
  }
}

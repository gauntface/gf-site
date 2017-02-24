const path = require('path');
const fs = require('mz/fs');

const parseUrl = require('../utils/parse-url');
const toTitleCase = require('../utils/title-case');

class Router {
  constructor({relativePath}) {
    this._relativePath = relativePath;
  }

  route(requestUrl, request) {
    const parsedUrl = parseUrl(requestUrl);
    const controller = parsedUrl.controller || 'Home';
    const action = parsedUrl.action || 'index';
    const type = parsedUrl.type || 'html';

    return this._findController(controller)
    .then((matchingController) => {
      if (!matchingController) {
        return this._findController('Error')
        .then((matchingController) => {
          if (!matchingController) {
            return Promise.reject();
          }

          return matchingController['index']({request, type});
        });
      }

      return matchingController[action]({request, type});
    });
  }

  _findController(controllerName) {
    const expectedController = `${toTitleCase(controllerName)}Controller.js`;
    const controllerPath = path.join(this._relativePath, expectedController);
    return fs.exists(controllerPath)
    .then((exists) => {
      if (!exists) {
        return null;
      }
      return require(controllerPath);
    });
  }
}

module.exports = Router;

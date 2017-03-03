const express = require('express');
const path = require('path');

const TemplateManager = require('./controllers/TemplateManager');
const Router = require('./controllers/Router');
const logHelper = require('./utils/log-helper');

class Hopin {
  constructor({relativePath}) {
    this._relativePath = relativePath;
    this._router = new Router({relativePath});

    const templatePath = path.join(relativePath, 'templates');
    this._templateManager = new TemplateManager({templatePath});

    this._app = express();
  }

  startServer(port) {
    this._app.get('*', (request, res) => {
      return this._router.route(request.url, request)
      .then((args) => {
        return this._templateManager.renderHTML(
          args.controllerResponse
        );
      })
      .then((renderedContent) => {
        res.send(renderedContent);
      })
      .catch((err) => {
        res.status(404).send(err.message);
      });
    });

    this._app.listen(port, () => {
      logHelper.log(`Example app listening on port ${port}!`);
    });
  }
}

module.exports = Hopin;

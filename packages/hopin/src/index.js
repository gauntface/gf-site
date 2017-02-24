const express = require('express');
const Router = require('./controllers/Router');
const logHelper = require('./utils/log-helper');

class Hopin {
  constructor({relativePath}) {
    this._router = new Router({relativePath});
    this._app = express();
  }

  startServer(port) {
    this._app.get('*', (request, res) => {
      return this._router.route(request.url, request)
      .then((args) => {
        res.send('Done.');
      })
      .catch((err) => {
        logHelper.error(err);
        res.send('Error.');
      });
    });

    this._app.listen(port, () => {
      logHelper.log(`Example app listening on port ${port}!`);
    });
  }
}

module.exports = Hopin;

const Hopin = require('hopin');

class SiteServer {
  constructor() {
    this._hop = new Hopin({
      relativePath: __dirname,
    });
  }

  start(portNumber) {
    return this._hop.startServer(3000);
  }
}

module.exports = new SiteServer();

const fs = require('fs');
const path = require('path');
const dockerHelper = require('../utils/docker-helper');
const localConfig = require('../utils/development.config');
const waitForServerOk = require('./utils/wait-for-server-ok');

describe('Test Gauntface Server', function() {
  before(function() {
    // This task *might* need to download Mysql and Ubuntu docker containers
    // as well as build this project.
    this.timeout(5 * 60 * 1000);

    global.__TEST_ENV = {
      url: `http://localhost:${localConfig.port}`,
    };

    return dockerHelper.run('development-prod')
    .then(() => {
      return waitForServerOk(global.__TEST_ENV.serverUrl, 10 * 1000);
    });
  });

  const nodeTests = fs.readdirSync(path.join(__dirname, 'node'));
  nodeTests.forEach((testFile) => {
    require(path.join(__dirname, 'node', testFile));
  });
});

const fs = require('fs');
const path = require('path');
const dockerHelper = require('../utils/docker-helper');
const localConfig = require('../utils/development.config');
const lighthouseWrapper = require('./utils/lighthouse-wrapper');
const waitForServerOk = require('./utils/wait-for-server-ok');

describe('Test Gauntface Server', function() {
  before(function() {
    // This task *might* need to download Mysql and Ubuntu docker containers
    // as well as build this project.
    this.timeout(5 * 60 * 1000);

    return Promise.all([
      dockerHelper.run('development-prod'),
      lighthouseWrapper.downloadChrome(),
    ])
    .then(() => {
      return waitForServerOk(localConfig.url, 10 * 1000);
    });
  });

  const nodeTests = fs.readdirSync(path.join(__dirname, 'node'));
  nodeTests.forEach((testFile) => {
    require(path.join(__dirname, 'node', testFile));
  });
});

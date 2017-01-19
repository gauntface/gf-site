const fs = require('fs');
const path = require('path');
const dockerHelper = require('../utils/docker-helper');
const localConfig = require('../utils/development.config');
const lighthouseWrapper = require('./utils/lighthouse-wrapper');
const waitForServerOk = require('./utils/wait-for-server-ok');
const getComponentList = require('./utils/get-styleguide-components');
const getSitemapUrls = require('./utils/get-sitemap-urls');

after(function() {
  this.timeout(60 * 1000);

  return Promise.all([
    lighthouseWrapper.killChrome(),
    dockerHelper.clean(),
  ]);
});

const initTestState = () => {
  return Promise.all([
    dockerHelper.run('development-prod'),
    lighthouseWrapper.downloadChrome()
    .then(() => {
      return lighthouseWrapper.startChrome();
    }),
  ])
  .then(() => {
    return waitForServerOk(localConfig.url, 10 * 1000);
  })
  .then(() => {
    return getComponentList();
  })
  .then((components) => {
    global.styleguide = {
      componentsList: components,
    };
  })
  .then(() => {
    return getSitemapUrls();
  })
  .then((urls) => {
    global.sitemap = {
      urls,
    };
  });
};

initTestState()
.then(() => {
  const nodeTests = fs.readdirSync(path.join(__dirname, 'node'));
  nodeTests.forEach((testFile) => {
    require(path.join(__dirname, 'node', testFile));
  });
})
.then(() => {
  run();
});

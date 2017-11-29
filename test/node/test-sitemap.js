const fetch = require('node-fetch');
const seleniumAssistant = require('selenium-assistant');
const logging = require('selenium-webdriver').logging;
const fs = require('fs-extra');
const path = require('path');

const dockerHelper = require('../../gulp-tasks/utils/docker-helper');
const getSitemapUrls = require('../utils/get-sitemap-urls');
const testingConfig = require('../../src/config/testing');
const dbHelper = require('../../src/utils/database-helper.js');

describe('Test Sitemap', function() {
  let sitemapUrls = null;
  let serverUrl = null;
  let globalDriver = null;

  before(function() {
    this.timeout(5 * 60 * 1000);

    // This env is set for the local db helper
    process.env.CONFIG_NAME = 'testing';

    return dockerHelper.runTesting()
    .then(() => {
      const localBrowser = seleniumAssistant.getLocalBrowser('chrome', 'stable');
      return localBrowser.getSeleniumDriver();
    })
    .then((driver) => {
      globalDriver = driver;
    })
    .then(() => {
      return dbHelper.__TEST_ONLY_DROP_TABLES();
    })
    .then(() => {
      const sqlFile = path.join(__dirname, '..', '..', 'src', 'sql-dumps', 'test-sql-dump');
      const buffer = fs.readFileSync(sqlFile);
      return dbHelper.executeQuery(buffer.toString());
    })
    .then(() => {
      serverUrl = testingConfig.url;
      // This is here to wait for the mysql container to be fully up and running
      return new Promise((resolve) => {
        setTimeout(resolve, 15 * 1000);
      });
    });
  });

  after(function() {
    this.timeout(30 * 1000);

    return seleniumAssistant.killWebDriver(globalDriver);
  });

  it('should be able to load the sitemap', function() {
    return getSitemapUrls(serverUrl)
    .then((urls) => {
      sitemapUrls = urls;
    });
  });

  it('should be able to fetch each page from the sitemap', function() {
    this.timeout(3 * 60 * 1000);
    if (!sitemapUrls) {
      throw new Error('The sitemap wasn\'t loaded so skipping this test.');
    }

    const networkErrRegexp = new RegExp(`(.*) - Failed to load resource:.*`);
    const corsErrRegexp = new RegExp(`(.*) - .*No 'Access-Control-Allow-Origin'.*`);

    let severeMessagesOnUrls = {};

    return sitemapUrls.reduce((promiseChain, partialUrl) => {
      return promiseChain.then(() => {
        const fullUrl = `${serverUrl}${partialUrl}`;
        return fetch(fullUrl)
        .then((response) => {
          if (!response.ok) {
            return response.text()
            .then((responseText) => {
              console.log(responseText);
              throw new Error(`Non 'OK' response from '${response.url}'`);
            });
          }
        })
        .then(() => {
          return globalDriver.get(fullUrl);
        })
        .then(() => {
          return globalDriver.manage().logs().get(logging.Type.BROWSER)
          .then((entries) => {
            const currentSevereMessages = entries.filter(function(entry) {
              if (entry.level === logging.Level.SEVERE) {
                if (entry.message.indexOf('chrome-extension://') === 0) {
                  // Skip the chrome extension
                  return false;
                }

                const networkResult = networkErrRegexp.exec(entry.message);
                if (networkResult && networkResult[1].indexOf(serverUrl) !== 0) {
                  console.log('External request being ignored: ', networkResult[0]);
                  return false;
                }

                const corsResult = corsErrRegexp.exec(entry.message);
                if (corsResult && corsResult[1].indexOf(serverUrl) !== 0) {
                  console.log('External CORs request being ignored: ', corsResult[0]);
                  return false;
                }

                return true;
              }
              return false;
            });

            if (currentSevereMessages.length > 0) {
              severeMessagesOnUrls[partialUrl] = currentSevereMessages;
            }
          });
        });
      });
    }, Promise.resolve())
    .then(() => {
      const urlKeys = Object.keys(severeMessagesOnUrls);
      if (urlKeys.length > 0) {
        urlKeys.forEach((urlKey) => {
          const urlMessages = severeMessagesOnUrls[urlKey];
          console.error('------------------------------------------');
          console.error(`    URL: ${urlKey}`);
          urlMessages.forEach((message) => {
            console.error(`        Message: ${message.message}`);
          });
        });
        throw new Error(`Severe message found.`);
      }
    });
  });
});

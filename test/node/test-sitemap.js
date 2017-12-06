const fetch = require('node-fetch');
const seleniumAssistant = require('selenium-assistant');
const logging = require('selenium-webdriver').logging;
const fs = require('fs-extra');
const path = require('path');
const expect = require('chai').expect;

const getSitemapUrls = require('../utils/get-sitemap-urls');
const dbHelper = require('../../src/utils/database-helper.js');

describe('Test Sitemap', function() {
  let sitemapUrls = null;
  let serverUrl = null;
  let globalDriver = null;

  before(async function() {
    this.timeout(5 * 60 * 1000);

    const localBrowser = seleniumAssistant.getLocalBrowser('chrome', 'stable');
    globalDriver = await localBrowser.getSeleniumDriver();

    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = 3306;
    process.env.DB_USER = 'testing-user';
    process.env.DB_PASSWORD = 'testing-password';
    process.env.DB_NAME = 'testing-db';

    await dbHelper.__TEST_ONLY_DROP_TABLES();

    const sqlFile = path.join(__dirname, '..', '..', '..', 'gf-deploy', 'sql-exports', 'test-sql-dump');
    const fileContents = fs.readFileSync(sqlFile).toString();
    const sqlCommands = fileContents.split('\n');
    for (const sqlCommand of sqlCommands) {
      if (!sqlCommand) {
        // Skip empty strings
        continue;
      }
      await dbHelper.executeQuery(sqlCommand);
    }

    serverUrl = `http://localhost:3000`;
  });

  after(function() {
    this.timeout(30 * 1000);

    return seleniumAssistant.killWebDriver(globalDriver);
  });

  it('should be able to load the sitemap', function() {
    return getSitemapUrls(serverUrl)
    .then((urls) => {
      sitemapUrls = urls;
      expect(sitemapUrls).to.exist;
      expect(sitemapUrls.length).to.equal(135);
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

    return sitemapUrls.reduce((promiseChain, sitemapUrl) => {
      return promiseChain.then(() => {
        return fetch(sitemapUrl)
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
          return globalDriver.get(sitemapUrl);
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

                if (entry.message.indexOf('https://s2-f.scribdassets.com') === 0) {
                  // Skip the scribd errors
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
              severeMessagesOnUrls[sitemapUrl] = currentSevereMessages;
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

const fetch = require('node-fetch');
const lighthouse = require('lighthouse');
const seleniumAssistant = require('selenium-assistant');
const path = require('path');
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;

const getComponentList = () => {
  return fetch(`${global.__TEST_ENV.url}/styleguide/list.json`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to retrieve list of styleguide components.');
    }

    return response.json();
  });
};

const unixTmpDir = () => {
  return execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim();
};

describe('Test Styleguide Components', function() {
  let componentsList;

  before(function() {
    return getComponentList()
    .then((components) => {
      componentsList = components;
    });
  });

  // This outer 'it' function delays execution until *after* the before()
  // task is complete.
  it('should configure Styleguide Lighthouse tests', function() {
    // Further 'it' unit tests must occur inside a describe.
    describe('Run Each Styleguide Component Through Lighthouse', function() {
      const tmpDir = unixTmpDir();
      let chromeProcess;

      before(function() {
        this.timeout(45 * 1000);
        console.log('Starting download.');
        return seleniumAssistant.downloadLocalBrowser('chrome', 'stable', 24 * 7)
        .then(() => {
          console.log('Download finished.');
          const args = [
            `--remote-debugging-port=${9222}`,
            '--disable-extensions',
            '--disable-translate',
            '--disable-default-apps',
            '--no-first-run',
            `--user-data-dir=${tmpDir}`,
          ];
          chromeProcess = spawn(
            path.join(seleniumAssistant.getBrowserInstallDir(), '/chrome/stable/usr/bin/google-chrome-stable'),
            args
          );
        })
        .then(() => {
          console.log('Chrome spawn started');
          return new Promise((resolve) => {
            setTimeout(resolve, 2000);
          });
        });
      });

      after(function() {
        return chromeProcess.kill('SIGHUP');
      });

      componentsList.forEach((componentDetails) => {
        // export LIGHTHOUSE_CHROMIUM_PATH=/usr/bin/google-chrome
        it(`should run Styleguide view '${componentDetails.name}' against Lighthouse`, function() {
          this.timeout(10 * 1000);
          this.retries(3);

          return lighthouse(`${global.__TEST_ENV.url}${componentDetails.url}`)
          .then((results) => {
            const booleanAudits = [
              'viewport',
              // TODO: Why does this fail for toolbar?
              // 'without-javascript',
              'critical-request-chains',
              'image-alt',
              'content-width',
              'external-anchors-use-rel-noopener',
              'link-blocking-first-paint',
              'no-console-time',
              'no-datenow',
              'no-document-write',
              'no-mutation-events',
              'no-old-flexbox',
              'script-blocking-first-paint',
            ];

            const intAudits = [
              'first-meaningful-paint',
              'speed-index-metric',
              'estimated-input-latency',
              'time-to-interactive',
            ];

            booleanAudits.forEach((auditKey) => {
              if (results.audits[auditKey].score !== true) {
                throw new Error(`Invalid score for: '${auditKey}' => '${results.audits[auditKey].score}`);
              }
            });

            intAudits.forEach((auditKey) => {
              if (results.audits[auditKey].score !== 100) {
                throw new Error(`Invalid score for: '${auditKey}' => '${results.audits[auditKey].score}`);
              }
            });
          });
        });
      });
    });
  });
});

const fetch = require('node-fetch');
const lighthouseWrapper = require('../utils/lighthouse-wrapper');
const localConfig = require('../../utils/development.config');

const getComponentList = () => {
  return fetch(`${localConfig.url}/styleguide/list.json`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to retrieve list of styleguide components.');
    }

    return response.json();
  });
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
      componentsList.forEach((componentDetails) => {
        // export LIGHTHOUSE_CHROMIUM_PATH=/usr/bin/google-chrome
        it(`should run Styleguide view '${componentDetails.name}' against Lighthouse`, function() {
          this.timeout(30 * 1000);
          this.retries(3);

          return lighthouseWrapper.run(`${localConfig.url}${componentDetails.url}`)
          .then((results) => {
            const booleanAudits = [
              'viewport',
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
              if (results.audits[auditKey].score === -1) {
                console.warn(`Lighthouse Error: '${auditKey}' => '${results.audits[auditKey].score}'`);
              } else if (results.audits[auditKey].score !== 100) {
                throw new Error(`Invalid score for: '${auditKey}' => '${results.audits[auditKey].score}'`);
              }
            });
          });
        });
      });
    });
  });
});

const lighthouseWrapper = require('../utils/lighthouse-wrapper');
const localConfig = require('../../utils/development.config');

describe('Test Styleguide Components', function() {
  global.styleguide.componentsList.forEach((componentDetails) => {
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

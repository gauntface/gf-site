const fetch = require('node-fetch');
const lighthouseWrapper = require('../utils/lighthouse-wrapper');

require('chai').should();

describe('Test Sitemap', function() {
  it('should be able to load a sitemap and fetch each page', function() {
    const urlChecks = global.sitemap.urls.map((url) => {
      return fetch(url);
    });

    return Promise.all(urlChecks)
    .then((urlResponses) => {
      urlResponses.forEach((urlResponse) => {
        if (!urlResponse.ok) {
          throw new Error(`Non 'OK' response from '${urlResponse.url}'`);
        }
      });
    });
  });
});

describe('Sitemap Pages + Lighthouse', function() {
  global.sitemap.urls.forEach((url) => {
    describe(`Run '${url}' through lighthouse`, function() {
      it(`should be able to pass '${url}' through lighthouse`, function() {
        this.timeout(45 * 1000);
        this.retries(3);

        return lighthouseWrapper.run(url)
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

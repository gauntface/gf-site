const fetch = require('node-fetch');
const getSitemapUrls = require('../utils/get-sitemap-urls');
const lighthouseWrapper = require('../utils/lighthouse-wrapper');
const localConfig = require('../../utils/development.config.js');

require('chai').should();

describe('Test Sitemap', function() {
  it('should be able to load a sitemap and fetch each page', function() {
    return getSitemapUrls()
    .then((allUrls) => {
      const urlChecks = allUrls.map((url) => {
        return fetch(url);
      });

      return Promise.all(urlChecks);
    })
    .then((urlResponses) => {
      urlResponses.forEach((urlResponse) => {
        if (!urlResponse.ok) {
          throw new Error(`Non 'OK' response from '${urlResponse.url}'`);
        }
      });
    });
  });

  it('should be able to pass each page through lighthouse', function() {
    this.timeout(30 * 1000);
    this.retries(3);

    return getSitemapUrls()
    .then((allUrls) => {
      allUrls.reduce((promiseChain, url) => {
        return promiseChain.then(() => {
          return lighthouseWrapper.run(`${localConfig.url}${url}`)
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
              if (results.audits[auditKey].score === -1) {
                console.warn(`Unexpected score for: '${auditKey}' => '${results.audits[auditKey].score}'`);
              } else if (results.audits[auditKey].score !== 100) {
                throw new Error(`Invalid score for: '${auditKey}' => '${results.audits[auditKey].score}'`);
              }
            });
          });
        });
      }, Promise.resolve());
    });
  });
});

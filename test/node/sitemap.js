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
        this.retries(2);

        return lighthouseWrapper.run(url)
        .then((results) => {
          const ignoreAudits = [
            // It's on Localhost
            'is-on-https',
            'redirects-http',
            'uses-http2',

            // Unable to use this due to poor debugging
            'unused-css-rules',

            // Unable to use - test doesn't have a tool that will generate
            // images that will pass the test
            'uses-optimized-images',

            // TODO: Add support
            'service-worker',
            'works-offline',

            // TODO: Test
            'without-javascript',
            'geolocation-on-start',
            'no-websql',
            'aria-allowed-attr',
            'aria-required-attr',
            'aria-valid-attr-value',
            'aria-valid-attr',
            'color-contrast',
            'label',
            'tabindex',
            'appcache-manifest',
            'uses-passive-event-listeners',

            // TODO: What is this?
            'user-timings',
            'screenshots',
            'notification-on-start',
          ];
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
            'manifest-exists',
            'manifest-display',
            'manifest-background-color',
            'manifest-theme-color',
            'manifest-icons-min-192',
            'manifest-icons-min-144',
            'manifest-short-name',
            'manifest-name',
            'manifest-short-name-length',
            'manifest-start-url',
            'theme-color-meta',
            'uses-responsive-images',
            'deprecations',
          ];

          const intAudits = [
            'first-meaningful-paint',
            'speed-index-metric',
            'estimated-input-latency',
            'time-to-interactive',
          ];

          Object.keys(results.audits).forEach((auditKey) => {
            if (booleanAudits.indexOf(auditKey) === -1 &&
            intAudits.indexOf(auditKey) === -1 &&
            ignoreAudits.indexOf(auditKey) === -1) {
              console.log(`Skipping result: ${auditKey}`);
            }
          });

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

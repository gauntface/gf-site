const siteServer = require('../../build/site-server');
const getSitemapUrls = require('../utils/get-sitemap-urls');
const lighthouseWrapper = require('../utils/lighthouse-wrapper');

function testUrlThroughLighthouse(urlToTest) {
  return lighthouseWrapper.run(urlToTest)
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
      'total-byte-weight',
      'dom-size',
    ];

    Object.keys(results.audits).forEach((auditKey) => {
      if (booleanAudits.indexOf(auditKey) === -1 &&
      intAudits.indexOf(auditKey) === -1 &&
      ignoreAudits.indexOf(auditKey) === -1) {
        console.log(`Skipping result: ${auditKey}: ${JSON.stringify(results.audits[auditKey])}`);
      }
    });

    booleanAudits.forEach((auditKey) => {
      if (results.audits[auditKey].score !== true) {
        const msg = `Invalid score for: '${auditKey}' => '${results.audits[auditKey].score}`;
        console.error(msg);
        throw new Error(msg);
      }
    });

    intAudits.forEach((auditKey) => {
      if (results.audits[auditKey].score === -1) {
        console.warn(`Lighthouse Error: '${auditKey}' => '${results.audits[auditKey].score}'`);
      } else if (results.audits[auditKey].score < 100) {
        const msg = `Invalid score for: '${auditKey}' => '${results.audits[auditKey].score}\n\n\n${JSON.stringify(results.audits[auditKey])}\n\n\n`;
        console.error(msg);
        throw new Error(msg);
      }
    });
  });
}

describe('Run Pages Against Lighthouse', function() {
  let serverUrl = null;

  before(function() {
    // 5 Minutes to download Chrome stable.
    this.timeout(5 * 60 * 1000);

    return siteServer.start(3000)
    .then(() => {
      serverUrl = 'http://localhost:3000';
    })
    .then(() => {
      return lighthouseWrapper.downloadChrome();
    })
    .then(() => {
      return lighthouseWrapper.startChrome();
    })
    .then(() => {
      return getSitemapUrls(serverUrl);
    })
    .then((sitemapUrls) => {
      describe(`Run sitemap pages through lighthouse.`, function() {
        after(function() {
          this.timeout(10 * 1000);

          return lighthouseWrapper.killChrome();
        });

        sitemapUrls.forEach((urlToTest) => {
          it(`should pass running '${urlToTest}' through lighthouse`, function() {
            this.timeout(45 * 1000);
            this.retries(3);

            return testUrlThroughLighthouse(urlToTest);
          });
        });
      });
    });
  });

  it('this is here to ensure before is run.....', function() {
  });
});

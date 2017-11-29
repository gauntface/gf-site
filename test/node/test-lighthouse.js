const fetch = require('node-fetch');
const URL = require('url');

const dockerHelper = require('../../gulp-tasks/utils/docker-helper');

const testingConfig = require('../../src/config/testing');
const getSitemapUrls = require('../utils/get-sitemap-urls');
const lighthouseWrapper = require('../utils/lighthouse-wrapper');

// For some URLs errors are to be expected and ignored
const lighthouseRuleIgnores = {
  '/styleguide/display/documents/html/': [
    'without-javascript',
  ],
  '/styleguide/display/shells/blank/': [
    'without-javascript',
  ],
  '/styleguide/display/shells/headerfooter/': [
    'bypass',
  ],
  '/styleguide/display/views/footer/': [
    'bypass',
    'without-javascript',
    'first-meaningful-paint',
    'speed-index-metric',
  ],
  '/styleguide/display/views/header/': [
    'bypass',
  ],
  '/styleguide/display/views/grid-overlay/': [
    'without-javascript',
  ],
};

const lighthouseAuditOptimalCorrection = {
  'speed-index-metric': 1250,
  'first-meaningful-paint': 1600,
  'time-to-interactive': 5000,
};

const lighthouseSoftenScores = [
  'speed-index-metric',
  'first-interactive',
  'consistently-interactive',
];

function testFailing(audit, testedUrl) {
  if (audit.score === null) {
    console.warn(`The audit '${audit.name}' has a score of 'null' and ` +
      `debugString '${audit.debugString}'`);
    return false;
  }

  let auditIsFailing = false;
  switch(audit.scoringMode) {
    case 'binary':
      if(audit.score !== true) {
        if (audit.score === 100) {
          // sometimes binary isn't a boolean.
          return;
        }
        auditIsFailing = true;
      }
      break;
    case 'numeric':
      if(audit.score !== 100) {
        auditIsFailing = true;
      }
      break;
    default:
      throw new Error(`Unknown lighthouse scoring mode ` +
        `'${audit.scoringMode}' for audit '${audit.name}'`);
  }

  if (auditIsFailing) {
    // This corrects for invalid score calculation
    const optimalValue = lighthouseAuditOptimalCorrection[audit.name];
    if (optimalValue) {
      if (audit.rawValue <= optimalValue) {
        // console.log(`Correcting the '${audit.name} value. Value was ${audit.rawValue}, the optimal value is ${audit.optimalValue} but the score was ${audit.score}`);
        return false;
      }
    }

    if (audit.name === 'first-meaningful-paint' && audit.rawValue <= 1600) {
      // console.log(`Correcting the first-meaningful-paint. Value was ${audit.rawValue}, the optimal value is ${audit.optimalValue} but the score was ${audit.score}`);
      return false;
    }

    if (lighthouseSoftenScores.indexOf(audit.name) !== -1 && audit.score >= 95) {
      // console.log(`Softening the '${audit.name}' value. Value was ${audit.rawValue}, the optimal value is ${audit.optimalValue} and the score was ${audit.score}`);
      return false;
    }

    if (audit.optimalValue) {
      console.log(`Failed audit '${audit.name}'. Value was ${audit.rawValue}, the optimal value is ${audit.optimalValue} but the score was ${audit.score}`);
    }

    const url = URL.parse(testedUrl);
    const ignoreList = lighthouseRuleIgnores[url.pathname];
    if (ignoreList) {
      if (ignoreList.indexOf(audit.name) !== -1) {
        return false;
      }
    }

    return {
      key: audit.name,
      score: audit.score,
      description: audit.description,
    };
  }
  return false;
}

function testUrlThroughLighthouse(lighthouseWrapper, urlToTest) {
  return lighthouseWrapper.run(urlToTest)
  .then((results) => {
    const ignoreAudits = [
      // Requires HTTPS - but on localhost
      'redirects-http',
      'uses-http2',

      // TODO List.
      'service-worker',
      'works-offline',
      'webapp-install-banner',
      'pwa-cross-browser',
      'pwa-page-transitions',
      'pwa-each-page-has-url',
      'uses-request-compression',
      'uses-webp-images',

      // Can't pass
      'html-has-lang',
    ];

    const failingTests = [];

    Object.keys(results.audits).forEach((auditKey) => {
      if (ignoreAudits.indexOf(auditKey) !== -1) {
        // Ignoring result.
        return;
      }

      const audit = results.audits[auditKey];
      const isFailing = testFailing(audit, urlToTest);
      if (isFailing) {
        failingTests.push(isFailing);
      }
    });

    if(failingTests.length > 0) {
      const auditStrings = failingTests.map((failingTest) => {
        return `'${failingTest.key}': '${failingTest.score}' -> '${failingTest.description}'`;
      });
      throw new Error(`Failing lighthouse audits:\n` +
            `${auditStrings.join('\n')}`);
    }
  });
}

function registerTests(allUrls) {
  describe('Run Pages Against Lighthouse', function() {
    before(function() {
      // 5 Minutes to download Chrome stable.
      this.timeout(5 * 60 * 1000);

      return lighthouseWrapper.downloadChrome()
      .then(() => {
        return lighthouseWrapper.startChrome();
      });
    });

    after(function() {
      this.timeout(10 * 1000);

      return lighthouseWrapper.killChrome();
    });

    allUrls.forEach((urlToTest) => {
      it(`should pass running '${urlToTest}' through lighthouse`, function() {
        this.timeout(45 * 1000);
        if (process.env.TRAVIS) {
          this.retries(3);
        } else {
          this.retries(1);
        }

        return testUrlThroughLighthouse(lighthouseWrapper, testingConfig.url + urlToTest);
      });
    });
  });
}

function getComponents(serverUrl) {
  return fetch(`${serverUrl}/styleguide/list.json`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Response from styleguide/list.json wasn\'t ok');
    }

    return response.json();
  })
  .then((response) => {
    return response.map((entry) => {
      return '/styleguide/display/' + entry + '/';
    });
  });
}

dockerHelper.runTesting()
.then(() => {
  return new Promise((resolve) => {
    setTimeout(resolve, 10 * 1000);
  });
})
.then(() => {
  return Promise.all([
    getSitemapUrls(testingConfig.url),
    getComponents(testingConfig.url),
  ]);
})
.then((results) => {
  let allUrls = [];
  results.forEach((result) => {
    allUrls = allUrls.concat(result);
  });
  return allUrls;
})
.then((allUrls) => {
  registerTests(allUrls);

  run();
})
.catch((err) => {
  console.error(err);
});

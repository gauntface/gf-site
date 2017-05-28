const fetch = require('node-fetch');

const siteServer = require('../../build/site-server');
const getSitemapUrls = require('../utils/get-sitemap-urls');

describe('Test Sitemap', function() {
  let sitemapUrls = null;
  let serverUrl = null;

  before(function() {
    this.timeout(30000);
    return siteServer.start(3001)
    .then(() => {
      serverUrl = 'http://localhost:3001';
    });
  });

  after(function() {
    return siteServer.stop();
  });

  it('should be able to load the sitemap', function() {
    return getSitemapUrls(serverUrl)
    .then((urls) => {
      sitemapUrls = urls;
    });
  });

  it('should be able to fetch each page from the sitemap', function() {
    if (!sitemapUrls) {
      throw new Error('The sitemap wasn\'t loaded so skipping this test.');
    }

    const urlChecks = sitemapUrls.map((url) => {
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

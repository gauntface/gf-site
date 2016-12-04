const fetch = require('node-fetch');
const getSitemapUrls = require('../utils/get-sitemap-urls');

require('chai').should();

describe('Test Sitemap', function() {
  it('should be able to load a sitemap', function() {
    return getSitemapUrls()
    .then((allUrls) => {
      const urlChecks = allUrls.map((url) => {
        return fetch(url);
      });

      return Promise.all(urlChecks);
    })
    .then((urlResponses) => {
      urlResponses.forEach((urlResponse) => {
        urlResponse.ok.should.equal(true);
      });
    });
  });
});

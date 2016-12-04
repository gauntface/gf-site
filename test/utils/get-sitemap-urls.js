const fetch = require('node-fetch');
const xml2js = require('xml2js');

module.exports = () => {
  return fetch(`${global.__TEST_ENV.url}/sitemap.xml`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Response for sitemap invalid. [Status Code: ${response.status}]`);
    }

    return response.text();
  })
  .then((responseBody) => {
    console.log(responseBody);
    return new Promise((resolve, reject) => {
      xml2js.parseString(responseBody, (err, data) => {
        if(err) {
          return reject(err);
        }

        resolve(data);
      });
    });
  })
  .then((parsedSitemap) => {
    if (!parsedSitemap.urlset || !parsedSitemap.urlset.url) {
      console.log(parsedSitemap);
      throw new Error('Invalid sitemap result from parsing.');
    }

    const allUrlLocs = parsedSitemap.urlset.url;
    return allUrlLocs.map((urlLoc) => {
      return urlLoc.loc[0];
    });
  });
};

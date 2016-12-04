const fetch = require('node-fetch');
const xml2js = require('xml2js');

const DEV_URL = 'http://localhost:5123';

module.exports = () => {
  return fetch(`${DEV_URL}/sitemap.xml`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Response for sitemap invalid. [Status Code: ${response.status}]`);
    }

    return response.text();
  })
  .then((responseBody) => {
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
      throw new Error('Invalid sitemap result from parsing.');
    }

    const allUrlLocs = parsedSitemap.urlset.url;
    return allUrlLocs.map((urlLoc) => {
      return urlLoc.loc[0];
    });
  });
};

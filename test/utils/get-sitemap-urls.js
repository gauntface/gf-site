const fetch = require('node-fetch');
const xml2js = require('xml2js');

module.exports = (siteUrl) => {
  let responseBody;
  let parsedSitemap;

  const printDebugLogs = () => {
    if (responseBody) {
      console.log('');
      console.log('---------------- FOR DEBUG PURPOSES ----------------');
      console.log('');
      console.log(responseBody);
      console.log('');
      console.log('----------------------------------------------------');
      console.log('');
    }
  };

  return fetch(`${siteUrl}/sitemap.xml`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Response for sitemap invalid. [Status Code: ${response.status}]`);
    }

    return response.text();
  })
  .then((rBody) => {
    responseBody = rBody;
    return new Promise((resolve, reject) => {
      xml2js.parseString(responseBody, (err, data) => {
        if(err) {
          printDebugLogs();
          return reject(err);
        }

        resolve(data);
      });
    });
  })
  .then((pSitemap) => {
    parsedSitemap = pSitemap;
    if (!parsedSitemap.urlset || !parsedSitemap.urlset.url) {
      printDebugLogs();
      throw new Error('Invalid sitemap result from parsing.');
    }

    const allUrlLocs = parsedSitemap.urlset.url;
    return allUrlLocs.map((urlLoc) => {
      return urlLoc.loc[0];
    });
  });
};

'use strict';

const fetch = require('node-fetch');

describe('Ensure Links Work', function() {
  const pagesToSearch = [];

  const externalLinks = {};
  const internalLinks = {};

  const invalidPages = [];

  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>[^<]*<\/a>/g;

  function searchForLinks() {
    const pageToSearch = pagesToSearch.pop();
    internalLinks[pageToSearch] = true;

    return fetch(pageToSearch)
    .then(response => {
      if (response.status !== 200) {
        invalidPages.push(pageToSearch);
      }

      return response.text();
    })
    .then(htmlString => {
      let result = null;
      while(result = linkRegex.exec(htmlString)) {
        const linkHref = result[1];
        if (linkHref.indexOf('http') === 0) {
          externalLinks[linkHref] = true;
        } else if (internalLinks[global.testUrl + linkHref] !== true) {
          if (linkHref.indexOf('mailto') === 0) {
            continue;
          }

          internalLinks[global.testUrl + linkHref] = true;
          pagesToSearch.push(global.testUrl + linkHref);
        }
      }
    })
    .then(() => {
      if (pagesToSearch.length > 0) {
        return searchForLinks();
      }
    });
  }

  it('should have valid links', function() {
    this.timeout(10000);
    pagesToSearch.push(global.testUrl);

    return searchForLinks()
    .then(() => {
      const internalLinkURLs = Object.keys(internalLinks);
      internalLinkURLs.forEach(link => {
        const endOfUrl = link.substring(global.testUrl.length);
        if (endOfUrl.length >= 1) {
          if (endOfUrl.indexOf('/') !== 0) {
            throw new Error('Expected local URL to start it\'s local path with \'/\': ' + link);
          }
        }
      });

      const externalLinkURLs = Object.keys(externalLinks);
      const promises = externalLinkURLs.map(link => {
        // check external links return 200
        return fetch(link)
        .then(response => {
          if (response.status !== 200) {
            throw new Error('Bad response from: ' + link);
          }
        })
      });

      return Promise.all(promises);
    });
  });
});

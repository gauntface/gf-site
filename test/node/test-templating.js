const fetch = require('node-fetch');

const localConfig = require('../../utils/development.config');

const expect = require('chai').expect;

describe('Test Server Template Parts', function() {
  it('should be able to fetch the document template', function() {
    return fetch(`${localConfig.url}/document.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Non-OK response.');
      }
      return response.json();
    })
    .then((response) => {
      expect(response.styles).to.be.defined;
      expect(response.styles.inline).to.be.defined;
      expect(response.styles.remote).to.be.defined;
      expect(response.styles.inline.length).to.be.gt(0);
      expect(response.styles.remote.length).to.equal(0);

      expect(response.metadata).to.be.defined;
      expect(response.metadata.theme_color).to.be.defined;
    });
  });

  it(`should be able to fetch '' shell`, function() {
    // TODO
  });

  global.sitemap.urls.forEach((url) => {
    it(`should be able to fetch template for '${url}'`, function() {
      const templateUrl = url === `${localConfig.url}/` ? `${localConfig.url}/home.json` : `${url}.json`;
      return fetch(templateUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Non-OK response.');
        }
        return response.json();
      })
      .then((response) => {
        expect(response.styles).to.be.defined;
        expect(response.styles.inline).to.be.defined;
        expect(response.styles.remote).to.be.defined;

        expect(response.metadata).to.be.defined;
        expect(response.metadata.title).to.be.defined;
        expect(response.metadata.shell).to.be.defined;
      });
    });
  });
});

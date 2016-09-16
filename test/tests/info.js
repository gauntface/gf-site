'use strict';

const fetch = require('node-fetch');

describe('Info Page', function() {

  const performTest = pathname => {
    return fetch(global.testUrl + pathname)
      .then(response => {
        response.status.should.equal(200);
      });
  }

  it('should be able to retrieve info page', function() {
    return performTest('/info');
  });
});

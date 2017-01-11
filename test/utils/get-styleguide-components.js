const fetch = require('node-fetch');
const localConfig = require('../../utils/development.config.js');

module.exports = () => {
  return fetch(`${localConfig.url}/styleguide/list.json`)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Unable to retrieve list of styleguide components.');
    }

    return response.json();
  });
};

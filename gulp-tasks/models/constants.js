const path = require('path');

module.exports = {
  DOCKER_BUILD_PATH: path.join(
    __dirname, '..', '..', '..', 'gf-deploy', 'docker-build'
  ),
  PROD_IMAGE_NAME: 'gauntface-site',
  ALL_SERVICES: [
    'base',
    'dev',
    'mysql_dev',
    'test',
    'mysql_test',
    'prod',
    'mysql_prod',
  ],
};

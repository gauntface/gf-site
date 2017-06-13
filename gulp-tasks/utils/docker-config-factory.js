const path = require('path');

const DOCKER_CONFIG_PATH = path.join(__dirname, '../../infra/docker');

const CONTAINER_NAMES = {
  MYSQL: 'gauntface-mysql',
  MYSQL_DATA_ONLY: 'gauntface-mysql-data-only',
  SRC: 'gauntface-src',
  BUILD: 'gauntface-build',
};

const getMysqlDataOnlyContainer = () => {
  return {
    id: 'mysql-data-only',
    name: CONTAINER_NAMES.MYSQL_DATA_ONLY,
    create: {
      customArgs: [
        'mysql',
      ],
    },
    persist: true,
  };
};

const getMysqlContainer = (config) => {
  const mysqlDataContainer = getMysqlDataOnlyContainer(config);
  return {
    id: 'mysql',
    tag: 'mysql',
    name: CONTAINER_NAMES.MYSQL,
    run: {
      detached: true,
      customArgs: [
        `-p`, `3306:3306`,
        '--env', `MYSQL_ROOT_PASSWORD=${config.database.rootPassword}`,
        '--env', `MYSQL_USER=${config.database.user}`,
        '--env', `MYSQL_PASSWORD=${config.database.password}`,
        '--env', `MYSQL_DATABASE=${config.database.database}`,
        '--volumes-from', mysqlDataContainer.name,
      ],
    },
    dependencies: [
      mysqlDataContainer,
    ],
  };
};

const getBaseConttainer = (config) => {
  return {
    id: 'base',
    dockerFile: path.join(DOCKER_CONFIG_PATH, 'base'),
    tag: 'gauntface/gf-site:base',
  };
};

const getSrcContainer = (config) => {
  const mysqlContainer = getMysqlContainer(config);

  return {
    id: 'development',
    dockerFile: path.join(DOCKER_CONFIG_PATH, 'development'),
    tag: 'gauntface/gf-site:src',
    name: CONTAINER_NAMES.SRC,
    run: {
      detached: false,
      customArgs: [
        '--link', mysqlContainer.name,
        '-p', `${config.port}:80`,
        '--env', `DEV_PORT=${config.port}`,
        '--env', `CONFIG_NAME=${config.name}`,
        '--env', `MYSQL_NAME=${CONTAINER_NAMES.MYSQL}`,
        '--volume', `${path.join(__dirname, '..', '..', 'src')}:/gauntface/site`,
        '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
          `/gauntface/site/node_modules`,
      ],
    },
    dependencies: [
      getMysqlDataOnlyContainer(config),
      mysqlContainer,
      getBaseConttainer(config),
    ],
  };
};

const getBuildContainer = (config) => {
  const mysqlContainer = getMysqlContainer(config);
  return {
    id: 'prod',
    dockerFile: path.join(DOCKER_CONFIG_PATH, 'prod'),
    tag: 'gauntface/gf-site:build',
    name: CONTAINER_NAMES.BUILD,
    run: {
      detached: true,
      customArgs: [
        '--link', mysqlContainer.name,
        '-p', `${config.port}:80`,
        '--volume', `${path.join(__dirname, '..', '..', 'build')}:` +
          `/gauntface/site`,
        '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
          `/gauntface/site/node_modules`,
        '--env', `CONFIG_NAME=${config.name}`,
        '--env', `MYSQL_NAME=${CONTAINER_NAMES.MYSQL}`,
      ],
    },
    dependencies: [
      getMysqlDataOnlyContainer(config),
      mysqlContainer,
      getBaseConttainer(config),
    ],
  };
};

module.exports = (buildType) => {
  const CONFIG_PATH = '../../src/config';
  switch(buildType) {
    case 'dev-mysql': {
      const config = require(path.join(CONFIG_PATH, 'development'));
      return getMysqlContainer(config);
    }
    case 'testing': {
      console.log(`Using testing docker config.`);
      const config = require(path.join(CONFIG_PATH, 'testing'));
      return getBuildContainer(config);
    }
    default: {
      console.log(`Using development docker config. Build type ` +
        `received: '${buildType}'.`);
      const config = require(path.join(CONFIG_PATH, 'development'));
      return getSrcContainer(config);
    }
  }
};

module.exports.CONTAINER_NAMES = CONTAINER_NAMES;

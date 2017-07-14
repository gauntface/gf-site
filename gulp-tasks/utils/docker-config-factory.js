const path = require('path');

const DOCKER_CONFIG_PATH = path.join(__dirname, '../../infra/docker');

const CONTAINER_NAMES = {
  MYSQL_DEVELOPMENT: 'gauntface-mysql-development',
  MYSQL_TESTING: 'gauntface-mysql-testing',
  MYSQL_DATA_DEVELOPMENT: 'gauntface-mysql-data-development',
  MYSQL_DATA_TESTING: 'gauntface-mysql-data-testing',
  SRC_DEVELOPMENT: 'gauntface-src-development',
  SRC_TESTING: 'gauntface-src-testing',
  BUILD_DEVELOPMENT: 'gauntface-build-development',
  BUILD_TESTING: 'gauntface-build-testing',
};

const getMysqlDataOnlyContainer = (config) => {
  if (!CONTAINER_NAMES[`MYSQL_DATA_${config.name.toUpperCase()}`]) {
    throw new Error('Can\'t find the Mysql container for config.');
  }

  return {
    id: 'mysql-data-only',
    name: CONTAINER_NAMES[`MYSQL_DATA_${config.name.toUpperCase()}`],
    create: {
      customArgs: [
        'mysql',
      ],
    },
    persist: true,
  };
};

const getMysqlContainer = (config) => {
  if (!CONTAINER_NAMES[`MYSQL_${config.name.toUpperCase()}`]) {
    throw new Error('Can\'t find the Mysql container for config.');
  }

  const mysqlDataContainer = getMysqlDataOnlyContainer(config);
  return {
    id: 'mysql',
    tag: 'mysql',
    name: CONTAINER_NAMES[`MYSQL_${config.name.toUpperCase()}`],
    run: {
      detached: true,
      customArgs: [
        `-p`, `${config.database.port}:3306`,
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
    id: 'src',
    dockerFile: path.join(DOCKER_CONFIG_PATH, 'development'),
    tag: 'gauntface/gf-site:src',
    name: CONTAINER_NAMES[`SRC_${config.name.toUpperCase()}`],
    run: {
      detached: false,
      customArgs: [
        '--link', mysqlContainer.name,
        '-p', `${config.port}:80`,
        '--env', `DEV_PORT=${config.port}`,
        '--env', `CONFIG_NAME=${config.name}`,
        '--env', `MYSQL_NAME=${mysqlContainer.name}`,
        '--volume', `${path.join(__dirname, '..', '..', 'src')}:/gauntface/site`,
        '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
          `/gauntface/site/node_modules`,
        '--volume', `${path.join(__dirname, '..', '..', '..', 'gf-uploads')}:` +
          `/gauntface/uploads`,
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
    id: 'build',
    dockerFile: path.join(DOCKER_CONFIG_PATH, 'prod'),
    tag: 'gauntface/gf-site:build',
    name: CONTAINER_NAMES[`BUILD_${config.name.toUpperCase()}`],
    run: {
      detached: true,
      customArgs: [
        '--link', mysqlContainer.name,
        '-p', `${config.port}:80`,
        '--env', `CONFIG_NAME=${config.name}`,
        '--env', `MYSQL_NAME=${mysqlContainer.name}`,
        '--volume', `${path.join(__dirname, '..', '..', 'build')}:` +
          `/gauntface/site`,
        '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
          `/gauntface/site/node_modules`,
        '--volume', `${path.join(__dirname, '..', '..', '..', 'gf-uploads')}:` +
          `/gauntface/uploads`,
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

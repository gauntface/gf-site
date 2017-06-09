const path = require('path');
const chalk = require('chalk');
const localConfig = require('./development.config.js');
const dockerCLIWrapper = require('./docker-cli-wrapper');

const DB_FILES = path.join(__dirname, '../../test/database-files/');
const MYSQL_DATA_ONLY_CONTAINER = {
  id: 'mysql-data-only',
  name: 'gauntface-mysql-data-only',
  create: {
    customArgs: [
      '-v', DB_FILES,
      'mysql',
    ],
  },
  persist: true,
};

const MYSQL_CONTAINER = {
  id: 'mysql',
  tag: 'mysql',
  name: 'gauntface-local-mysql',
  run: {
    detached: true,
    customArgs: [
      `-p`, `3306:3306`,
      '--env', `MYSQL_ROOT_PASSWORD=${localConfig.database.rootPassword}`,
      '--env', `MYSQL_USER=${localConfig.database.user}`,
      '--env', `MYSQL_PASSWORD=${localConfig.database.password}`,
      '--env', `MYSQL_DATABASE=${localConfig.database.dbName}`,
      '--volumes-from', MYSQL_DATA_ONLY_CONTAINER.name,
    ],
  },
  dependencies: [
    MYSQL_DATA_ONLY_CONTAINER,
  ],
};

const INFRA_BASE = path.join(__dirname, '../../infra');

const BASE_CONTAINER = {
  dockerFile: path.join(INFRA_BASE, 'docker/base'),
  tag: 'gauntface/gf-site:base',
};

const DEVELOPMENT_CONTAINER = {
  id: 'development',
  dockerFile: path.join(INFRA_BASE, 'docker/development'),
  tag: 'gauntface/gf-site:development',
  name: 'gauntface-local-docker',
  run: {
    detached: false,
    customArgs: [
      '--link', MYSQL_CONTAINER.name,
      '-p', `${localConfig.port}:80`,
      '--volume', `${path.join(__dirname, '..', '..', 'src')}:/gauntface/site`,
      '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
        `/gauntface/site/node_modules`,
    ],
  },
  dependencies: [
    MYSQL_DATA_ONLY_CONTAINER,
    MYSQL_CONTAINER,
  ],
};

const PROD_CONTAINER = {
  id: 'prod',
  dockerFile: path.join(INFRA_BASE, 'docker/prod'),
  tag: 'gauntface/gf-site:development-prod',
  name: 'gauntface-local-docker',
  run: {
    detached: true,
    customArgs: [
      '--link', MYSQL_CONTAINER.name,
      '-p', `${localConfig.port}:80`,
      '--volume', `${path.join(__dirname, '..', '..', 'build')}:` +
        `/gauntface/site`,
      '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
        `/gauntface/site/node_modules`,
      '-e', `BUILDTYPE=production`,
    ],
  },
  dependencies: [
    MYSQL_DATA_ONLY_CONTAINER,
    MYSQL_CONTAINER,
  ],
};

const CONTAINERS = [
  MYSQL_DATA_ONLY_CONTAINER,
  MYSQL_CONTAINER,
  BASE_CONTAINER,
  DEVELOPMENT_CONTAINER,
  PROD_CONTAINER,
];

/**
 * This class does the orchestrating of docker processes (build, running,
 * stopping etc.).
 *
 * Can be used by tests and gulp.
 */
class DockerHelper {
  /* eslint-disable no-console */
  /**
   * @param {Object} message to print
   */
  log(message) {
    console.log(chalk.green('[DockerHelper]:'), message);
  }

  /**
   * @param {Object} message to print
   */
  warn(message) {
    console.log(chalk.yellow('[DockerHelper]:'), message);
  }
  /* eslint-enable no-console */

  /**
   * @return {Promise} Resolves once all docker containers are removed.
   */
  remove() {
    this.log('Removing containers');
    return CONTAINERS.reduce((promiseChain, containerInfo) => {
      return promiseChain.then(() => {
        if (!containerInfo.name || containerInfo.persist === true) {
          // No name - nothing to stop.
          return promiseChain;
        }

        return dockerCLIWrapper.removeContainer(
          containerInfo.name
        );
      });
    }, Promise.resolve());
  }

  /**
   * @return {Promise} Resolves once all docker containers are stopped.
   */
  stop() {
    this.log('Stopping containers');
    return CONTAINERS.reduce((promiseChain, containerInfo) => {
      return promiseChain.then(() => {
        if (!containerInfo.name) {
          // No name - nothing to stop.
          return promiseChain;
        }

        return dockerCLIWrapper.stopContainer(
          containerInfo.name
        );
      });
    }, Promise.resolve());
  }

  /**
   * @return {Promise} Resolves once all docker containers are stopped &
   * removed.
   */
  clean() {
    this.log('Cleaning containers');
    return this.stop()
    .then(() => this.remove());
  }

  /**
   * @return {Promise} Resolves once all docker containers are built.
   */
  build() {
    this.log('Building containers');
    return CONTAINERS.reduce((promiseChain, containerInfo) => {
      return promiseChain.then(() => {
        if (!containerInfo.dockerFile) {
          // No file - nothing to build.
          return promiseChain;
        }

        console.log('Building: ', containerInfo);

        return dockerCLIWrapper.buildContainer(
          containerInfo.dockerFile,
          containerInfo.tag
        );
      });
    }, Promise.resolve());
  }

  /**
   * @param {string} environment The environment of the container to run.
   * @param {Object} options Options for running.
   * @return {Promise} Resolves once all docker containers are running.
   */
  run(environment, options) {
    this.log(``);
    this.log(``);
    this.log(`     Running container: '${environment}'`, options);
    this.log(``);
    this.log(``);
    let forceDetached = false;
    if (options) {
      forceDetached = options.forceDetached === true;
    }

    return this.clean()
    .then(() => this.build())
    .then(() => {
      const primaryContainer = CONTAINERS.filter((container) => {
        return container.id === environment;
      })[0];
      const dependencyContainers = primaryContainer.dependencies || [];
      return dependencyContainers.reduce((promiseChain, containerInfo) => {
        return promiseChain.then(() => {
          if (!containerInfo.name) {
            // No name - nothing to run.
            return promiseChain;
          }

          if (containerInfo.run) {
            return dockerCLIWrapper.runContainer(
              containerInfo.tag,
              containerInfo.name,
              containerInfo.run.customArgs,
              forceDetached || containerInfo.run.detached
            );
          } else {
            return dockerCLIWrapper.createContainer(
              containerInfo.name,
              containerInfo.create.customArgs
            )
            .catch((err) => {
              if (containerInfo.persist === true) {
                return;
              }
              throw err;
            });
          }
        });
      }, Promise.resolve())
      .then(() => {
        let customArgs = primaryContainer.run.customArgs || [];
        if (options && options.customArgs) {
          customArgs = customArgs.concat(options.customArgs);
        }

        return dockerCLIWrapper.runContainer(
          primaryContainer.tag,
          primaryContainer.name,
          customArgs,
          primaryContainer.run.detached
        );
      });
    });
  }

  /**
   * @param {string} containerId The ID of the container to access.
   * @return {Promise} Resolves once access to CLI has ended.
   */
  accessCLI(containerId) {
    let matchingContainer = null;
    CONTAINERS.forEach((containerInfo) => {
      if (containerId === containerInfo.id) {
        matchingContainer = containerInfo;
        return;
      }
    });

    if (!matchingContainer) {
      return Promise.reject(new Error(`Unable to find container with ID ` +
        `'${containerId}'.`));
    }
    return dockerCLIWrapper.accessContainerCLI(matchingContainer.name);
  }
}

module.exports = new DockerHelper();

const path = require('path');
const chalk = require('chalk');
const localConfig = require('./development.config.js');
const dockerCLIWrapper = require('./docker-cli-wrapper');

const MYSQL_CONTAINER = {
  id: 'mysql',
  tag: 'mysql/mysql-server:latest',
  name: 'gauntface-local-mysql',
  run: {
    detached: true,
    customArgs: [
      '--env', `MYSQL_ROOT_PASSWORD=${localConfig.database.rootPassword}`,
      '--env', `MYSQL_USER=${localConfig.database.user}`,
      '--env', `MYSQL_PASSWORD=${localConfig.database.password}`,
      '--env', `MYSQL_DATABASE=${localConfig.database.dbName}`,
    ],
  },
};

const BASE_CONTAINER = {
  dockerFile: path.join(__dirname, '../src/infra/docker/base'),
  tag: 'gauntface/gf-site:base',
};

const DEVELOPMENT_CONTAINER = {
  id: 'development',
  dockerFile: path.join(__dirname, '../src/infra/docker/development'),
  tag: 'gauntface/gf-site:development',
  name: 'gauntface-local-docker',
  run: {
    detached: false,
    customArgs: [
      '--link', MYSQL_CONTAINER.name,
      '-p', `${localConfig.port}:80`,
      '--volume', `${path.join(__dirname, '..', 'src')}:/gauntface/site`,
    ],
  },
};

const CONTAINERS = [
  MYSQL_CONTAINER,
  BASE_CONTAINER,
  DEVELOPMENT_CONTAINER,
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
        if (!containerInfo.name) {
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

        return dockerCLIWrapper.buildContainer(
          containerInfo.dockerFile,
          containerInfo.tag
        );
      });
    }, Promise.resolve());
  }

  /**
   * @param {Object} options Options for running.
   * @return {Promise} Resolves once all docker containers are running.
   */
  run(options) {
    this.log('Running containers');
    return this.clean()
    .then(() => this.build())
    .then(() => {
      return CONTAINERS.reduce((promiseChain, containerInfo) => {
        return promiseChain.then(() => {
          if (!containerInfo.name) {
            // No name - nothing to run.
            return promiseChain;
          }

          return dockerCLIWrapper.runContainer(
            containerInfo.tag,
            containerInfo.name,
            containerInfo.run.customArgs,
            options.forceDetached || containerInfo.run.detached
          );
        });
      }, Promise.resolve());
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
        matchingContainer = containerId;
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

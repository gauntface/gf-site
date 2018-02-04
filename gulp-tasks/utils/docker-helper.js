const path = require('path');
const fs = require('fs-extra');

const dockerCLIWrapper = require('./docker-cli-wrapper');
const DockerComposeWrapper = require('./docker-compose-wrapper');
const Logger = require('./logger');

const PROD_IMAGE_NAME = 'gauntface-site';
const ALL_SERVICES = [
  'dev',
  'mysql_dev',
  'test',
  'mysql_test',
  'prod',
  'mysql_prod',
];

/**
 * This class does the orchestrating of docker processes (build, running,
 * stopping etc.).
 *
 * Can be used by tests and gulp.
 */
class DockerHelper {
  constructor() {
    this._dockerCompose = new DockerComposeWrapper([
      './docker-compose.yml',
      '../gf-deploy/docker-compose.prod.yml',
    ]);
    this._logger = new Logger('🐳 [DockerHelper]:');
  }

  /**
   * @return {Promise} Resolves once all docker containers are removed.
   */
  remove() {
    return ALL_SERVICES.reduce((promiseChain, serviceName) => {
      return promiseChain.then(() => {
        this._logger.log(`        Removing service: ${serviceName}`);
        return this._dockerCompose.remove(
          serviceName
        )
        .catch(() => {});
      });
    }, Promise.resolve());
  }

  /**
   * @return {Promise} Resolves once all docker containers are stopped.
   */
  stop() {
    return ALL_SERVICES.reduce((promiseChain, serviceName) => {
      return promiseChain.then(() => {
        this._logger.log(`        Stopping service: ${serviceName}`);

        return this._dockerCompose.stop(
          serviceName
        )
        .catch(() => {});
      });
    }, Promise.resolve());
  }

  /**
   * @return {Promise} Resolves once all docker containers are stopped &
   * removed.
   */
  clean() {
    this._logger.log(``);
    this._logger.log(``);
    this._logger.log('    Cleaning containers');
    this._logger.log(``);
    this._logger.log(``);
    return this.stop()
    .then(() => this.remove());
  }

  /**
   * @param {string} containerId The ID of the container to access.
   * @return {Promise} Resolves once access to CLI has ended.
   */
  accessCLI() {
    return dockerCLIWrapper.accessContainerCLI('gfsite_dev');
  }

  async buildDev() {
    this._logger.log(``);
    this._logger.log(``);
    this._logger.log(`    Building dev container`);
    this._logger.log(``);
    this._logger.log(``);

    await this._dockerCompose.build('dev');
  }

  async buildTest() {
    this._logger.log(``);
    this._logger.log(``);
    this._logger.log(`    Building test container`);
    this._logger.log(``);
    this._logger.log(``);

    await this._dockerCompose.build('test');
  }

  async buildProd() {
    this._logger.log(``);
    this._logger.log(``);
    this._logger.log(`    Building prod container`);
    this._logger.log(``);
    this._logger.log(``);

    await this._dockerCompose.build('prod');
  }

  async runDev(detach = false) {
    await this._dockerCompose.up('dev', {
      detach,
    });
  }

  async runTesting(detach = false) {
    await this._dockerCompose.up('test', {
      detach,
    });
  }

  async runProd(detach = false) {
    await this._dockerCompose.up('prod', {
      detach,
    });
  }

  saveProd() {
    return fs.ensureDir(global.__buildConfig.DOCKER_BUILD_PATH)
    .then(() => {
      return dockerCLIWrapper.saveContainer(
        PROD_IMAGE_NAME,
        [
          '-o', path.join(global.__buildConfig.DOCKER_BUILD_PATH, `prod.tar`),
        ]
      );
    });
  }
}

module.exports = new DockerHelper();

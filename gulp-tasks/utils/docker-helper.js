const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const dockerCLIWrapper = require('./docker-cli-wrapper');
const DockerComposeWrapper = require('./docker-compose-wrapper');

const PROD_IMAGE_NAME = 'gauntface-site';

const DOCKER_BUILD_PATH = path.join(__dirname, '..', '..', '..',
  'gf-deploy', 'docker-build');

const ALL_SERVICES = [
  'base',
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
      '../gf-deploy/docker-compose.yml',
    ]);
  }

  /* eslint-disable no-console */
  /**
   * @param {Object} message to print
   */
  log(message) {
    console.log(chalk.green('🐳 [DockerHelper]:'), message);
  }

  /**
   * @param {Object} message to print
   */
  warn(message) {
    console.log(chalk.yellow('🐳 [DockerHelper]:'), message);
  }

  error(message) {
    console.log(chalk.red('🐳 [DockerHelper]:'), message);
  }
  /* eslint-enable no-console */

  /**
   * @return {Promise} Resolves once all docker containers are removed.
   */
  remove() {
    return ALL_SERVICES.reduce((promiseChain, serviceName) => {
      return promiseChain.then(() => {
        this.log(`        Removing service: ${serviceName}`);
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
        this.log(`        Stopping service: ${serviceName}`);

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
    this.log(``);
    this.log(``);
    this.log('    Cleaning containers');
    this.log(``);
    this.log(``);
    return this.stop()
    .then(() => this.remove());
  }

  /**
   * @param {string} containerId The ID of the container to access.
   * @return {Promise} Resolves once access to CLI has ended.
   */
  accessCLI() {
    return dockerCLIWrapper.accessContainerCLI(PROD_IMAGE_NAME);
  }

  async buildBase() {
    this.log(``);
    this.log(``);
    this.log(`    Building base container`);
    this.log(``);
    this.log(``);

    await this._dockerCompose.build('base');
  }

  async buildDev() {
    this.log(``);
    this.log(``);
    this.log(`    Building dev container`);
    this.log(``);
    this.log(``);

    await this._dockerCompose.build('dev');
  }

  async buildTest() {
    this.log(``);
    this.log(``);
    this.log(`    Building test container`);
    this.log(``);
    this.log(``);

    await this._dockerCompose.build('test');
  }

  async buildProd() {
    this.log(``);
    this.log(``);
    this.log(`    Building prod container`);
    this.log(``);
    this.log(``);

    await this._dockerCompose.build('prod');
  }

  async runDev() {
    await this._dockerCompose.up('dev');
  }

  async runTesting() {
    await this._dockerCompose.up('test');
  }

  async runProd() {
    await this._dockerCompose.up('prod');
  }

  saveProd() {
    return fs.ensureDir(DOCKER_BUILD_PATH)
    .then(() => {
      return dockerCLIWrapper.saveContainer(
        PROD_IMAGE_NAME,
        [
          '-o', path.join(DOCKER_BUILD_PATH, `prod.tar`),
        ]
      );
    });
  }
}

module.exports = new DockerHelper();

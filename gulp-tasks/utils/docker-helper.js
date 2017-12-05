const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const dockerCLIWrapper = require('./docker-cli-wrapper');
const dockerConfigFactory = require('./docker-config-factory');

const BASE_TAG = 'gauntface-base'
const PRIMARY_TAG = 'gauntface-site';
const DB_EXAMPLE_TAG = 'gauntface-mysql-example';
const DB_EXAMPLE_DATA_TAG = 'gauntface-mysql-data-example';
const DB_TEST_TAG = 'gauntface-mysql-test';
const DB_TEST_DATA_TAG = 'gauntface-mysql-test';

const DOCKER_CONFIG_PATH = path.join(__dirname, '../../infra/docker');
const BASE_DOCKER_FILE = path.join(DOCKER_CONFIG_PATH, 'base');

const DEV_DOCKER_FILE = path.join(DOCKER_CONFIG_PATH, 'dev');

const PROD_DOCKER_FILE = path.join(DOCKER_CONFIG_PATH, 'prod');
const PROD_PORT = 3008;

const DOCKER_BUILD_PATH = path.join(__dirname, '..', '..', '..',
  'gf-deploy', 'docker-build');

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
  remove(factoryId) {
    const containersToStop = [
      BASE_TAG,
      PRIMARY_TAG,
      DB_EXAMPLE_TAG,
      DB_TEST_TAG,
      DB_TEST_DATA_TAG,
    ];

    return containersToStop.reduce((promiseChain, containerName) => {
      return promiseChain.then(() => {
        this.log(`        Removing container: ${containerName}`);
        return dockerCLIWrapper.removeContainer(
          containerName
        )
        .catch(() => {});
      });
    }, Promise.resolve());
  }

  /**
   * @return {Promise} Resolves once all docker containers are stopped.
   */
  stop() {
    const containersToStop = [
      BASE_TAG,
      PRIMARY_TAG,
      DB_EXAMPLE_TAG,
      DB_EXAMPLE_DATA_TAG,
      DB_TEST_TAG,
      DB_TEST_DATA_TAG,
    ];

    return containersToStop.reduce((promiseChain, containerName) => {
      return promiseChain.then(() => {
        this.log(`        Stopping container: ${containerName}`);

        return dockerCLIWrapper.stopContainer(
          containerName
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
    return dockerCLIWrapper.accessContainerCLI(PRIMARY_TAG);
  }

  buildBase() {
    this.log(``);
    this.log(``);
    this.log(`    Building base container`);
    this.log(``);
    this.log(``);

    return dockerCLIWrapper.buildContainer(
      BASE_DOCKER_FILE,
      BASE_TAG
    );
  }

  runDevMysql() {
    const config = require('../../src/config/development');

    return dockerCLIWrapper.runContainer(
      'mysql',
      DB_EXAMPLE_TAG,
      [
        // Ensure that the external port matches the expected config
        `-p`, `${config.database.port}:3306`,

        // Define the MYSQL variables
        '--env', `MYSQL_ROOT_PASSWORD=${config.database.rootPassword}`,
        '--env', `MYSQL_USER=${config.database.user}`,
        '--env', `MYSQL_PASSWORD=${config.database.password}`,
        '--env', `MYSQL_DATABASE=${config.database.database}`,

        // Initialise the database with sql
        '--volume', `${path.join(__dirname, '..', '..', '..', 'gf-deploy', 'sql-exports')}:` +
          `/docker-entrypoint-initdb.d`,
      ],
      true
    );
  }

  runTestingMysql() {
    const config = require('../../src/config/testing');

    return dockerCLIWrapper.runContainer(
      'mysql',
      DB_TEST_TAG,
      [
        // Ensure that the external port matches the expected config
        `-p`, `${config.database.port}:3306`,

        // Define the MYSQL variables
        '--env', `MYSQL_ROOT_PASSWORD=${config.database.rootPassword}`,
        '--env', `MYSQL_USER=${config.database.user}`,
        '--env', `MYSQL_PASSWORD=${config.database.password}`,
        '--env', `MYSQL_DATABASE=${config.database.database}`,

        // Initialise the database with sql
        '--volume', `${path.join(__dirname, '..', '..', '..', 'gf-deploy', 'sql-exports')}:` +
          `/docker-entrypoint-initdb.d`,
      ],
      true
    );
  }

  runProdMysql() {
    const config = require(path.join(__dirname, '..', '..', '..', 'gf-deploy', 'src', 'config', 'production'));

    return dockerCLIWrapper.runContainer(
      'mysql',
      DB_EXAMPLE_TAG,
      [
        // Ensure that the external port matches the expected config
        `-p`, `${config.database.port}:3306`,

        // Define the MYSQL variables
        '--env', `MYSQL_ROOT_PASSWORD=${config.database.rootPassword}`,
        '--env', `MYSQL_USER=${config.database.user}`,
        '--env', `MYSQL_PASSWORD=${config.database.password}`,
        '--env', `MYSQL_DATABASE=${config.database.database}`,

        // Initialise the database with sql
        '--volume', `${path.join(__dirname, '..', '..', '..', 'gf-deploy', 'sql-exports')}:` +
          `/docker-entrypoint-initdb.d`,
      ],
      true
    );
  }

  buildDev() {
    this.log(``);
    this.log(``);
    this.log(`    Building dev container`);
    this.log(``);
    this.log(``);

    return dockerCLIWrapper.buildContainer(
      DEV_DOCKER_FILE,
      PRIMARY_TAG
    );
  }

  runDev() {
    return dockerCLIWrapper.runContainer(
      PRIMARY_TAG,
      PRIMARY_TAG,
      [
        '-p', `3006:80`,

        // Link the mysql container to this instance
        // TODO: Link via docker compose
        // '--link', DB_EXAMPLE_TAG,

        // Make Docker see the src index
        '--volume', `${path.join(__dirname, '..', '..', 'src')}:` +
          `/gauntface/site`,

        // Make node_modules be in the expected place (they are outside of src)
        '--volume', `${path.join(__dirname, '..', '..', 'node_modules')}:` +
          `/gauntface/site/node_modules`,

        // Make container aware of MySQL name
        // '--env', `MYSQL_NAME=${DB_EXAMPLE_TAG}`,
      ],
      false
    )
    .then(() => {
      this.log(``);
      this.log(``);
      this.log(`    Running Dev`);
      this.log(`    http://localhost/3006`);
      this.log(``);
      this.log(``);
    });
  }

  runTesting() {
    const config = require('../../src/config/testing');

    this.log(``);
    this.log(``);
    this.log(`    Building testing container`);
    this.log(``);
    this.log(``);

    return dockerCLIWrapper.runContainer(
      PRIMARY_TAG,
      PRIMARY_TAG,
      [
        '-p', `${config.port}:80`,

        // Link the mysql container to this instance
        '--link', DB_TEST_TAG,

        // Make container aware of MySQL name
        '--env', `MYSQL_NAME=${DB_TEST_TAG}`,
      ],
      true
    )
    .then(() => {
      this.log(``);
      this.log(``);
      this.log(`    Running Testing`);
      this.log(`    http://localhost:${config.port}`);
      this.log(``);
      this.log(``);
    });
  }

  /**
   * @return {Promise} Resolves once all docker containers are built.
   */
  buildProd() {
    this.log(``);
    this.log(``);
    this.log(`    Building prod container`);
    this.log(``);
    this.log(``);

    return dockerCLIWrapper.buildContainer(
      PROD_DOCKER_FILE,
      PRIMARY_TAG
    );
  }

  runProd() {
    return dockerCLIWrapper.runContainer(
      PRIMARY_TAG,
      PRIMARY_TAG,
      [
        '-p', `${PROD_PORT}:80`,

        // Link the mysql container to this instance
        '--link', DB_EXAMPLE_TAG,

        // Make container aware of MySQL name
        '--env', `MYSQL_NAME=${DB_EXAMPLE_TAG}`,
      ],
      true
    )
    .then(() => {
      this.log(``);
      this.log(``);
      this.log(`    Running Prod`);
      this.log(`    http://localhost/${PROD_PORT}`);
      this.log(``);
      this.log(``);
    });
  }

  saveProd() {
    return fs.ensureDir(DOCKER_BUILD_PATH)
    .then(() => {
      return dockerCLIWrapper.saveContainer(
        PRIMARY_TAG,
        [
          '-o', path.join(DOCKER_BUILD_PATH, `prod.tar`)
        ]
      );
    })
    .then(() => {
      this.log(``);
      this.log(``);
      this.log(`    Running Prod`);
      this.log(`    http://localhost/${PROD_PORT}`);
      this.log(``);
      this.log(``);
    });
  }

  /**
   * @param {string} environment The environment of the container to run.
   * @param {Object} options Options for running.
   * @return {Promise} Resolves once all docker containers are running.
   */
  /** run(factoryId, options) {
    this.log(``);
    this.log(``);
    this.log(`     Running Factory ID: '${factoryId}'`, options);
    this.log(``);
    this.log(``);
    let forceDetached = false;
    if (options) {
      forceDetached = options.forceDetached === true;
    }

    const primaryContainer = dockerConfigFactory(factoryId);

    return this.clean(factoryId)
    .then(() => {
      const dependencyContainers = primaryContainer.dependencies || [];
      return dependencyContainers.reduce((promiseChain, containerInfo) => {
        return promiseChain.then(() => this.build(containerInfo))
        .then(() => {
          if (!containerInfo.name) {
            // No name - nothing to run.
            return promiseChain;
          }

          if (containerInfo.run) {
            this.log(`Running dependency '${containerInfo.name}'`);
            return promiseChain.then(() => {
              return dockerCLIWrapper.runContainer(
                containerInfo.tag,
                containerInfo.name,
                containerInfo.run.customArgs,
                forceDetached || containerInfo.run.detached
              );
            });
          } else {
            return promiseChain.then(() => {
              return dockerCLIWrapper.createContainer(
                containerInfo.name,
                containerInfo.create.customArgs,
              )
              .catch((err) => {
                if (containerInfo.persist === true) {
                  return;
                }

                this.error(err);
                throw err;
              });
            });
          }
        });
      }, Promise.resolve())
      .then(() => this.build(primaryContainer))
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
  }**/

  /**
   * @param {string} environment The environment of the container to run.
   * @param {Object} options Options for running.
   * @return {Promise} Resolves once all docker containers are running.
   */
  /** save(factoryId, options) {
    this.log(``);
    this.log(``);
    this.log(`     Saving Factory ID: '${factoryId}'`, options);
    this.log(``);
    this.log(``);
    let forceDetached = false;
    if (options) {
      forceDetached = options.forceDetached === true;
    }

    const primaryContainer = dockerConfigFactory(factoryId);

    return this.clean(factoryId)
    .then(() => {
      const dependencyContainers = primaryContainer.dependencies || [];
      return dependencyContainers.reduce((promiseChain, containerInfo) => {
        return promiseChain.then(() => this.build(containerInfo))
        .then(() => {
          if (!containerInfo.name) {
            // No name - nothing to run.
            return promiseChain;
          }

          if (containerInfo.run) {
            this.log(`Running dependency '${containerInfo.name}'`);
            return promiseChain.then(() => {
              return dockerCLIWrapper.runContainer(
                containerInfo.tag,
                containerInfo.name,
                containerInfo.run.customArgs,
                forceDetached || containerInfo.run.detached
              );
            });
          } else {
            return promiseChain.then(() => {
              return dockerCLIWrapper.createContainer(
                containerInfo.name,
                containerInfo.create.customArgs,
              )
              .catch((err) => {
                if (containerInfo.persist === true) {
                  return;
                }

                this.error(err);
                throw err;
              });
            });
          }
        });
      }, Promise.resolve())
      .then(() => this.build(primaryContainer))
      .then(() => {
        let customArgs = primaryContainer.run.customArgs || [];
        if (options && options.customArgs) {
          customArgs = customArgs.concat(options.customArgs);
        }

        return dockerCLIWrapper.saveContainer(
          primaryContainer.tag,
          primaryContainer.name,
          [
            '-o',
            'docker-container.tar'
          ],
          primaryContainer.run.detached
        );
      });
    });
  }**/
}

module.exports = new DockerHelper();

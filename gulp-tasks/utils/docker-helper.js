const path = require('path');
const chalk = require('chalk');
const dockerCLIWrapper = require('./docker-cli-wrapper');
const dockerConfigFactory = require('./docker-config-factory');

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
    let containersToStop = [];

    switch (factoryId) {
      case 'dev-mysql':
        containersToStop = [
          `gauntface-mysql-development`,
          `gauntface-mysql-data-development`,
        ];
        break;
      default:
        containersToStop = [
          `gauntface-mysql-${factoryId}`,
          `gauntface-mysql-data-${factoryId}`,
          `gauntface-src-${factoryId}`,
          `gauntface-build-${factoryId}`,
        ];
        break;
    }

    return containersToStop.reduce((promiseChain, containerName) => {
      // Do not touch the mysql data container.
      if (containerName.indexOf('gauntface-mysql-data-') !== -1) {
        return promiseChain;
      }

      return promiseChain.then(() => {
        this.log(`    Removing container: ${containerName}`);
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
  stop(factoryId) {
    let containersToStop = [];

    switch (factoryId) {
      case 'dev-mysql':
        containersToStop = [
          `gauntface-mysql-development`,
          `gauntface-mysql-data-development`,
        ];
        break;
      default:
        containersToStop = [
          `gauntface-mysql-${factoryId}`,
          `gauntface-mysql-data-${factoryId}`,
          `gauntface-src-${factoryId}`,
          `gauntface-build-${factoryId}`,
        ];
        break;
    }

    return containersToStop.reduce((promiseChain, containerName) => {
      return promiseChain.then(() => {
        this.log(`    Stopping container: ${containerName}`);

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
  clean(factoryId) {
    this.log('Cleaning containers');
    return this.stop(factoryId)
    .then(() => this.remove(factoryId));
  }

  /**
   * @return {Promise} Resolves once all docker containers are built.
   */
  build(containerInfo) {
    if (!containerInfo.dockerFile) {
      // No file - nothing to build.
      return Promise.resolve();
    }

    this.log(`Building container: '${containerInfo.id}'`);

    return dockerCLIWrapper.buildContainer(
      containerInfo.dockerFile,
      containerInfo.tag
    );
  }

  /**
   * @param {string} environment The environment of the container to run.
   * @param {Object} options Options for running.
   * @return {Promise} Resolves once all docker containers are running.
   */
  run(factoryId, options) {
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
            return dockerCLIWrapper.runContainer(
              containerInfo.tag,
              containerInfo.name,
              containerInfo.run.customArgs,
              forceDetached || containerInfo.run.detached
            );
          } else {
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
  }

  /**
   * @param {string} containerId The ID of the container to access.
   * @return {Promise} Resolves once access to CLI has ended.
   */
  accessCLI(containerKey) {
    let matchingContainer = dockerConfigFactory.CONTAINER_NAMES[containerKey];
    if (!matchingContainer) {
      return Promise.reject(new Error(`Unable to find container with ID ` +
        `'${containerId}'.`));
    }
    return dockerCLIWrapper.accessContainerCLI(matchingContainer);
  }
}

module.exports = new DockerHelper();

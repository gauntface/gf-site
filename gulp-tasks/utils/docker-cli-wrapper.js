const path = require('path');
const spawn = require('child_process').spawn;
const chalk = require('chalk');

/**
 * Helper for docker methods.
 */
class DockerCLIWrapper {
  constructor() {
    global.config = global.config || {};
  }

  /**
   * Spawns a process for the docker command.
   * @param {Array<string>} args The arguments passed into the docker process.
   * @return {Promise} Resolves when the command ends.
   */
  _executeDockerCommand(args, log, options) {
    if (typeof log === 'undefined') {
      log = false;
    }

    if (global.config.showDockerLogs) {
      log = true;
    }

    return new Promise((resolve, reject) => {
      let errString = '';
      const dockerProcess = spawn('docker', args, options);

      dockerProcess.stdout.on('data', (data) => {
        if (!log) {
          return;
        }

        process.stdout.write(data.toString());
      });

      dockerProcess.stderr.on('data', (data) => {
        errString += data.toString();
      });

      dockerProcess.on('exit', (code) => {
        if (code !== 0) {
          return reject(errString);
        }

        setTimeout(resolve, 2000);
      });
    });
  }

  createContainer(name, customArgs) {
    let args = [
      'create',
      '--name', name,
    ];

    args = args.concat(customArgs);

    return this._executeDockerCommand(args);
  }

  /**
   * @param {string} dockerfilePath
   * @param {string} tag The tag for the container.
   * @return {Promise} Promise resolves once the container has been built.
   */
  buildContainer(dockerfilePath, tag) {
    const args = [
      'build',
      // '--no-cache',
      '--tag', tag,
      // Name of the Dockerfile
      '--file', dockerfilePath,
      // Want it to be from the root of the project.
      path.join(__dirname, '..', '..'),
    ];

    if (global.config.noDockerCache) {
      args.push('--no-cache');
    }

    return this._executeDockerCommand(args);
  }

  /**
   * @param {string} containerTag This the the tag of the build docker
   * container.
   * @param {string} containerName This is a custom name you give to this docker
   * container.
   * @param {Array<string>} customArgs These are custom args you wish to
   * pass to the run command (i.e. -p, -v, --link etc).
   * @param {boolean} detached If set to tru, the detach flag will be added.
   * @return {Promise} Promise resolves once running has ended.
   */
  runContainer(containerTag, containerName, customArgs, detached) {
    let args = [
      'run',
      '--name', containerName,
    ];

    args = args.concat(customArgs);

    if (detached === true) {
      args.push('--detach');
    }

    args.push(containerTag);

    return this._executeDockerCommand(args, true);
  }

  /**
   * @param {string} containerName This is a custom name you give to this docker
   * container.
   * @param {Array<string>} customArgs These are custom args you wish to
   * pass to the run command (i.e. -p, -v, --link etc).
   * @return {Promise} Promise resolves once running has ended.
   */
  saveContainer(containerName, customArgs) {
    let args = [
      'save',
    ];

    args = args.concat(customArgs);

    args.push(containerName);

    return this._executeDockerCommand(args, true);
  }

  /**
   * @param {string} containerName Name of container used for accessing CLI.
   * @return {Promise} That resolves once the CLI is complete.
   */
  accessContainerCLI(containerName) {
    const args = [
      'exec',
      '-it', containerName,
      'bash',
    ];

    return this._executeDockerCommand(args, true, {
      stdio: 'inherit',
    });
  }

  /**
   * @param {string} containerName Name of container to stop.
   * @return {Promise} That resolves once the CLI is complete.
   */
  stopContainer(containerName) {
    const args = [
      'stop',
      containerName,
    ];

    return this._executeDockerCommand(args);
  }

  /**
   * @param {string} containerName Name of container to remove.
   * @return {Promise} That resolves once the CLI is complete.
   */
  removeContainer(containerName) {
    const args = [
      'rm',
      containerName,
    ];

    return this._executeDockerCommand(args);
  }
}

module.exports = new DockerCLIWrapper();

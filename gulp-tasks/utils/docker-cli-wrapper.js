const path = require('path');
const spawn = require('child_process').spawn;

/**
 * Helper for docker methods.
 */
class DockerCLIWrapper {
  /**
   * Spawns a process for the docker command.
   * @param {Array<string>} args The arguments passed into the docker process.
   * @return {Promise} Resolves when the command ends.
   */
  _executeDockerCommand(args) {
    return new Promise((resolve, reject) => {
      const dockerProcess = spawn('docker', args, {
        stdio: 'inherit',
      });

      dockerProcess.on('exit', (code) => {
        if (code !== 0) {
          return reject(`Unexpected exit code: ${code}`);
        }

        resolve();
      });
    });
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

    return this._executeDockerCommand(args);
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

    return this._executeDockerCommand(args);
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

    return this._executeDockerCommand(args)
    .catch(() => {
      /* eslint-disable no-console */
      console.log(`    Docker could not stop '${containerName}'. This is ` +
        `probably due to the container already being stopped.`);
      /* eslint-enable no-console */
    });
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

    return this._executeDockerCommand(args)
    .catch(() => {
      /* eslint-disable no-console */
      console.log(`    Docker could not remove '${containerName}'. This is ` +
        `probably due to the container already being removed.`);
      /* eslint-enable no-console */
    });
  }
}

module.exports = new DockerCLIWrapper();

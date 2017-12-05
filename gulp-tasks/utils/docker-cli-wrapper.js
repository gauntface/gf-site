const spawn = require('./spawn');

/**
 * Helper for docker methods.
 */
class DockerCLIWrapper {
  constructor() {
    global.config = global.config || {};
  }

  _executeDockerCommand(args, options) {
    return spawn('docker', args, options);
  }

  saveContainer(containerName, customArgs) {
    let args = [
      'save',
    ];

    args = args.concat(customArgs);

    args.push(containerName);

    return this._executeDockerCommand(args);
  }

  accessContainerCLI(containerName) {
    const args = [
      'exec',
      '-it', containerName,
      'bash',
    ];

    return this._executeDockerCommand(args, {
      stdio: 'inherit',
    });
  }
}

module.exports = new DockerCLIWrapper();

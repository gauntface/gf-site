const fs = require('fs-extra');
const spawn = require('./spawn');

class DockerComposeWrapper {
  constructor(dockerComposeFiles = []) {
    this._cmdFlags = [];
    dockerComposeFiles.forEach((composeFile) => {
      // This is required for travis to work.
      if (fs.existsSync(composeFile)) {
        this._cmdFlags.push('-f');
        this._cmdFlags.push(composeFile);
      }
    });
  }

  _getFlagsCopy() {
    return this._cmdFlags.slice(0);
  }

  stop(serviceName) {
    const cmdFlags = this._getFlagsCopy();
    cmdFlags.push('stop');
    cmdFlags.push(serviceName);

    return spawn('docker-compose', cmdFlags);
  }

  remove(serviceName) {
    const cmdFlags = this._getFlagsCopy();
    cmdFlags.push('rm');
    cmdFlags.push('-f');
    cmdFlags.push(serviceName);

    return spawn('docker-compose', cmdFlags);
  }

  up(serviceName, options = {}) {
    const cmdFlags = this._getFlagsCopy();
    cmdFlags.push('up');
    cmdFlags.push('--force-recreate');
    cmdFlags.push('--build');
    if (options.detach) {
      cmdFlags.push('-d');
    }
    cmdFlags.push(serviceName);

    return spawn('docker-compose', cmdFlags);
  }

  build(serviceName) {
    const cmdFlags = this._getFlagsCopy();
    cmdFlags.push('build');
    cmdFlags.push('--no-cache');
    cmdFlags.push(serviceName);

    return spawn('docker-compose', cmdFlags);
  }
}

module.exports = DockerComposeWrapper;

const path = require('path');
const spawn = require('child_process').spawn;

/**
 * Helper for docker methods.
 */
class DockerHelper {
  /**
   * @param {string} dockerfilePath
   * @return {Promise} Promise resolves once the container has been built.
   */
  buildContainer(dockerfilePath) {
    const args = [
      'build',
      '--tag', `gauntface/gf-site:${path.parse(dockerfilePath).name}`,
      // Name of the Dockerfile
      '--file', dockerfilePath,
      // Want it to be from the root of the project.
      path.join(__dirname, '..'),
    ];

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

  startContainer() {

  }

  accessContainerCLI() {

  }

  /**
   * Names of containers to be used.
   */
  get CONTAINER_NAMES() {
    return {
      PRIMARY: 'gauntface-local-docker',
      MYSQL: 'gauntface-local-mysql',
    };
  }
}

module.exports = new DockerHelper();

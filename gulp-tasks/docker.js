const gulp = require('gulp');
const path = require('path');
const dockerHelper = require('../utils/docker-helper');
const localConfig = require('../utils/development.config.js');

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
  }
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
    ]
  }
};

const CONTAINERS = [
  MYSQL_CONTAINER,
  BASE_CONTAINER,
  DEVELOPMENT_CONTAINER,
];

gulp.task('docker-rm', () => {
  return CONTAINERS.reduce((promiseChain, containerInfo) => {
    return promiseChain.then(() => {
      if (!containerInfo.name) {
        // No name - nothing to stop.
        return promiseChain;
      }

      return dockerHelper.removeContainer(
        containerInfo.name
      );
    });
  }, Promise.resolve());
});

gulp.task('docker-stop', () => {
  return CONTAINERS.reduce((promiseChain, containerInfo) => {
    return promiseChain.then(() => {
      if (!containerInfo.name) {
        // No name - nothing to stop.
        return promiseChain;
      }

      return dockerHelper.stopContainer(
        containerInfo.name
      );
    });
  }, Promise.resolve());
});

gulp.task('docker-clean', gulp.series('docker-stop', 'docker-rm'));

gulp.task('docker-build', () => {
  return CONTAINERS.reduce((promiseChain, containerInfo) => {
    return promiseChain.then(() => {
      if (!containerInfo.dockerFile) {
        // No file - nothing to build.
        return promiseChain;
      }

      return dockerHelper.buildContainer(
        containerInfo.dockerFile,
        containerInfo.tag
      );
    });
  }, Promise.resolve());
});

gulp.task('docker-run',
  gulp.series(
    'docker-clean',
    'docker-build',
    () => {
      return CONTAINERS.reduce((promiseChain, containerInfo) => {
        return promiseChain.then(() => {
          if (!containerInfo.name) {
            // No name - nothing to run.
            return promiseChain;
          }

          return dockerHelper.runContainer(
            containerInfo.tag,
            containerInfo.name,
            containerInfo.run.customArgs,
            containerInfo.run.detached
          );
        });
      }, Promise.resolve());
    }
  )
);

CONTAINERS.forEach((containerInfo) => {
  if(!containerInfo.id) {
    // No ID - can't register gulp task
    return;
  }

  gulp.task(`docker-cli:${containerInfo.id}`, () => {
    return dockerHelper.accessContainerCLI(containerInfo.name);
  });
})

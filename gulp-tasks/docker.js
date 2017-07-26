const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const dockerHelper = require('./utils/docker-helper');

/**

gulp.task(`docker-cli:build`, () => {
  return dockerHelper.accessCLI('BUILD')
  .catch(() => {
    // NOOP for errors.
  });
});

const runDocker = (buildName) => {
  let customArgs = [];
  try {
    const envBuffer = fs.readFileSync(
      path.join(__dirname, '..', global.config.private, 'env.json')
    );
    const envJson = JSON.parse(envBuffer.toString());
    Object.keys(envJson).forEach((key) => {
      customArgs.push('--env', `${key}=${envJson[key]}`);
    });
  } catch (err) {
    throw new Error('Unable to read env.json file');
  }

  return dockerHelper.run(buildName, {
    customArgs,
  });
};

const saveDocker = (buildName) => {
  let customArgs = [];
  try {
    const envBuffer = fs.readFileSync(
      path.join(__dirname, '..', global.config.private, 'env.json')
    );
    const envJson = JSON.parse(envBuffer.toString());
    Object.keys(envJson).forEach((key) => {
      customArgs.push('--env', `${key}=${envJson[key]}`);
    });
  } catch (err) {
    throw new Error('Unable to read env.json file');
  }

  return dockerHelper.save(buildName, {
    customArgs,
  });
};

gulp.task('docker-run:mysql', () => runDocker('dev-mysql'));
gulp.task('docker-run:dev', () => runDocker('development'));
gulp.task('docker-run:testing', () => runDocker('testing'));
gulp.task('docker-run:prod', () => runDocker('prod'));
gulp.task('docker-save:prod', () => saveDocker('prod'));
**/

gulp.task('docker:remove', () => dockerHelper.remove());

gulp.task('docker:stop', () => dockerHelper.stop());

gulp.task('docker:clean', () => dockerHelper.clean());

gulp.task(`docker:cli`, () => {
  return dockerHelper.accessCLI()
  .catch(() => {
    // NOOP for errors.
  });
});

gulp.task('docker:build:base', () => dockerHelper.buildBase());

gulp.task('docker:build:dev', () => {

});

gulp.task('docker:build:testing', () => {

});

gulp.task('docker:build:prod', () => dockerHelper.buildProd());
gulp.task('docker:run:prod', gulp.series([
  'docker:clean',
  'docker:build:base',
  'docker:build:prod',
  () => dockerHelper.runProd(),
]));
gulp.task('docker:save:prod', gulp.series([
  'docker:clean',
  'docker:build:base',
  'docker:build:prod',
  () => dockerHelper.saveProd(),
]));

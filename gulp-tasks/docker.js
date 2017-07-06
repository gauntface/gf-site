const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const dockerHelper = require('./utils/docker-helper');

gulp.task('docker-rm', () => dockerHelper.remove());

gulp.task('docker-stop', () => dockerHelper.stop());

gulp.task('docker-clean', () => dockerHelper.clean());

gulp.task('docker-build', () => dockerHelper.build());

gulp.task(`docker-cli`, () => {
  return dockerHelper.accessCLI('SRC')
  .catch(() => {
    // NOOP for errors.
  });
});

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

gulp.task('docker-run:mysql', () => runDocker('dev-mysql'));
gulp.task('docker-run:dev', () => runDocker('development'));
gulp.task('docker-run:testing', () => runDocker('testing'));
gulp.task('docker-run:prod', () => runDocker('prod'));

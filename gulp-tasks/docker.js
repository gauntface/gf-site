const gulp = require('gulp');
const fetch = require('node-fetch');
const dockerHelper = require('./utils/docker-helper');

function getHealth() {
  return fetch('http://localhost:3000/.health-check')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Response not ok.');
    }
  })
  .catch(() => getHealth());
}

function waitForHealth() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Timeout threw while waiting for health.'));
    }, 10 * 1000);

    getHealth().then(resolve, reject);
  });
}

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
gulp.task('docker:build:dev', gulp.series([
  () => dockerHelper.buildDev(),
]));
gulp.task('docker:build:test', gulp.series([
  () => dockerHelper.buildTest(),
]));
gulp.task('docker:build:prod', gulp.series([
  () => dockerHelper.buildProd(),
]));

gulp.task('docker:run:dev', gulp.series([
  'docker:clean',
  'docker:build:dev',
  () => dockerHelper.runDev(),
  () => waitForHealth(),
]));

gulp.task('docker:run:testing', gulp.series([
  'docker:clean',
  'docker:build:test',
  () => dockerHelper.runTesting(),
  () => waitForHealth(),
]));

gulp.task('docker:run:prod', gulp.series([
  'docker:clean',
  'docker:build:prod',
  () => dockerHelper.runProd(),
  () => waitForHealth(),
]));

gulp.task('docker:save:prod', gulp.series([
  'docker:clean',
  'docker:build:prod',
  () => dockerHelper.saveProd(),
]));

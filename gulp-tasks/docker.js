const gulp = require('gulp');
const dockerHelper = require('./utils/docker-helper');

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
  () => dockerHelper.buildBase(),
  () => dockerHelper.buildDev(),
]));
gulp.task('docker:build:test', gulp.series([
  () => dockerHelper.buildBase(),
  () => dockerHelper.buildTest(),
]));
gulp.task('docker:build:prod', gulp.series([
  () => dockerHelper.buildBase(),
  () => dockerHelper.buildProd(),
]));

gulp.task('docker:run:dev', gulp.series([
  'docker:clean',
  () => dockerHelper.runDev(),
]));

gulp.task('docker:run:testing', gulp.series([
  'docker:clean',
  () => dockerHelper.runTesting(),
]));

gulp.task('docker:run:prod', gulp.series([
  'docker:clean',
  () => dockerHelper.runProd(),
]));

gulp.task('docker:save:prod', gulp.series([
  'docker:clean',
  'docker:build:prod',
  () => dockerHelper.saveProd(),
]));

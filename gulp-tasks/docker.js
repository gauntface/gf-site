const gulp = require('gulp');
const dockerHelper = require('../utils/docker-helper');

const CONTAINER_ID = 'development';

gulp.task('docker-rm', () => dockerHelper.remove());

gulp.task('docker-stop', () => dockerHelper.stop());

gulp.task('docker-clean', () => dockerHelper.clean());

gulp.task('docker-build', () => dockerHelper.build());

gulp.task('docker-run', () => dockerHelper.run(CONTAINER_ID));

gulp.task(`docker-cli`, () => {
  return dockerHelper.accessCLI(CONTAINER_ID)
  .catch(() => {
    // NOOP for errors.
  });
});

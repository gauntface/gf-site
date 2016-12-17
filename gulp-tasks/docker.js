const gulp = require('gulp');
const dockerHelper = require('../utils/docker-helper');

gulp.task('docker-rm', () => dockerHelper.remove());

gulp.task('docker-stop', () => dockerHelper.stop());

gulp.task('docker-clean', () => dockerHelper.clean());

gulp.task('docker-build', () => dockerHelper.build());

gulp.task('docker-run', () => dockerHelper.run());

gulp.task(`docker-cli`, () => {
  const containerID = 'development';
  return dockerHelper.accessCLI(containerID)
  .catch(() => {
    // NOOP for errors.
  });
});

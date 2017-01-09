const gulp = require('gulp');
const dockerHelper = require('../utils/docker-helper');

gulp.task('docker-rm', () => dockerHelper.remove());

gulp.task('docker-stop', () => dockerHelper.stop());

gulp.task('docker-clean', () => dockerHelper.clean());

gulp.task('docker-build', () => dockerHelper.build());

gulp.task('docker-run', () => dockerHelper.run('development'));

gulp.task(`docker-cli`, () => {
  return dockerHelper.accessCLI('development')
  .catch(() => {
    // NOOP for errors.
  });
});

gulp.task('docker-run:prod', () => dockerHelper.run('development-prod'));

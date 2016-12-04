const gulp = require('gulp');
const dockerHelper = require('../utils/docker-helper');

gulp.task('docker-rm', () => dockerHelper.remove());

gulp.task('docker-stop', () => dockerHelper.stop());

gulp.task('docker-clean', () => dockerHelper.clean());

gulp.task('docker-build', () => dockerHelper.build());

gulp.task('docker-run', () => dockerHelper.run());

const cliEnabledContainerIDs = ['development'];
cliEnabledContainerIDs.forEach((containerID) => {
  gulp.task(`docker-cli:${containerID}`, () => {
    return dockerHelper.accessCLI(containerID);
  });
});

const gulp = require('gulp');
const path = require('path');
const dockerHelper = require('../utils/docker-helper');

gulp.task('docker-build:base', () => {
  return dockerHelper.buildContainer(
    path.join(__dirname, '../src/infra/docker/base')
  );
});

gulp.task('docker-build:development', () => {
  return dockerHelper.buildContainer(
    path.join(__dirname, '../src/infra/docker/development')
  );
});

// docker build -t gauntface/gf-site:base -f src/infra/docker/base . && docker build -t gauntface/gf-site:development -f src/infra/docker/development .
gulp.task('docker-build',
  gulp.series(
    'docker-build:base',
    'docker-build:development'
  )
);

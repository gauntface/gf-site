'use strict';

const path = require('path');
const gulp = require('gulp');

/**
 * Note this copying from private to public and public to build
 * means watching will be tricky to do. This maybe should be seperate
 * tasks.
 */

const privateThirdParty = () => {
  return gulp.src([
    path.join(global.__buildConfig.private, 'src', 'public', '**', '*.*'),
  ])
  .pipe(gulp.dest(
    path.join(
      global.__buildConfig.src,
      'public',
    )
  ));
};

const buildThirdParty = () => {
  return gulp.src([
    path.join(global.__buildConfig.src, 'public', 'third_party', '**', '*.*'),
  ])
  .pipe(gulp.dest(
    path.join(
      global.__buildConfig.dest,
      'public',
      'third_party'
    )
  ));
};

const thirdparty = (done) => {
  return gulp.series([
    privateThirdParty,
    buildThirdParty,
  ])(done);
};

module.exports = {
  task: thirdparty,
};

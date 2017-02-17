'use strict';

/* eslint-env node */

const path = require('path');
const gulp = require('gulp');

// We copy all files here rather than with php as
// the twitter library has pem and other files that
// aren't handled anywhere else.
gulp.task('thirdparty:composer', () => {
  return gulp.src(`${global.config.src}/server/libraries/**/*`)
  .pipe(gulp.dest(`${global.config.dest}/server/libraries/`));
});

gulp.task('thirdparty:swlib', () => {
  return gulp.src([
    './node_modules/sw-lib/build/sw-lib.min.js',
  ])
  .pipe(gulp.dest(
    path.join(
      global.config.src,
      'server',
      'app',
      'webroot',
      'third_party'
    )
  ));
});

gulp.task('thirdparty',
  gulp.parallel('thirdparty:composer', 'thirdparty:swlib'));

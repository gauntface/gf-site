'use strict';

/* eslint-env node */

const path = require('path');
const gulp = require('gulp');

gulp.task('thirdparty:swlib', () => {
  return gulp.src([
    './node_modules/sw-lib/build/*.*',
  ])
  .pipe(gulp.dest(
    path.join(
      global.config.src,
      'static',
      'third_party',
      'sw-lib'
    )
  ));
});

gulp.task('thirdparty',
  gulp.parallel('thirdparty:swlib'));

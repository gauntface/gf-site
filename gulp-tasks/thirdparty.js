'use strict';

/* eslint-env node */

const path = require('path');
const gulp = require('gulp');

gulp.task('thirdparty', () => {
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

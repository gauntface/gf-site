'use strict';

/* eslint-env node */

const gulp = require('gulp');

gulp.task('scripts', () => {
  // TODO Minification
  return gulp.src(global.config.src + '/**/*.js')
  .pipe(gulp.dest(global.config.dest));
});

'use strict';

/* eslint-env node */

const gulp = require('gulp');

gulp.task('extras', () => {
  return gulp.src([
    global.config.src + '/package.json',
    global.config.src + '/**/*.json',
  ])
  .pipe(gulp.dest(global.config.dest));
});

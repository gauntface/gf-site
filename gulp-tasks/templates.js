'use strict';

/* eslint-env node */

const gulp = require('gulp');

gulp.task('templates', () => {
  return gulp.src([
    global.config.src + '/**/*.tmpl',
  ])
  .pipe(gulp.dest(global.config.dest));
});

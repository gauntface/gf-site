'use strict';

/* eslint-env node */

const gulp = require('gulp');

gulp.task('images', () => {
  return gulp.src(global.config.src + '/**/*.{jpg,png,svg,ico}')
  .pipe(gulp.dest(global.config.dest));
});

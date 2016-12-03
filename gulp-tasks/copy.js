'use strict';

const gulp = require('gulp');

gulp.task('copy', () => {
  return gulp.src(`${global.config.src}/server/**/*.{php,config,css}`)
  .pipe(gulp.dest(`${global.config.dest}/server/`));
});

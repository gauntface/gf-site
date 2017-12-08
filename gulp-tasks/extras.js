'use strict';

/* eslint-env node */

const path = require('path');
const gulp = require('gulp');

gulp.task('extras', () => {
  return gulp.src([
    './package.json',
    global.config.src + '/**/*.json',
    path.join(__dirname, '..', '..', 'gf-deploy', 'src', '**/*'),
  ])
  .pipe(gulp.dest(global.config.dest));
});

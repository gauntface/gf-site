'use strict';

/* eslint-env node */

const path = require('path');
const gulp = require('gulp');

gulp.task('thirdparty:workbox', () => {
  return gulp.src([
    './node_modules/workbox-sw/build/importScripts/*.*',
  ])
  .pipe(gulp.dest(
    path.join(
      global.config.src,
      'public',
      'third_party',
      'workbox-sw'
    )
  ));
});

gulp.task('thirdparty:private', () => {
  return gulp.src([
    path.join(global.config.private, 'public', '**/*.*'),
  ])
  .pipe(gulp.dest(
    path.join(
      global.config.src,
      'public',
      'third_party'
    )
  ));
});

gulp.task('thirdparty',
  gulp.parallel('thirdparty:workbox', 'thirdparty:private'));

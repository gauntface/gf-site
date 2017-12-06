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
    path.join(global.config.private, 'src', 'public', '**', '*.*'),
  ])
  .pipe(gulp.dest(
    path.join(
      global.config.src,
      'public',
    )
  ));
});

gulp.task('thirdparty:build', () => {
  return gulp.src([
    path.join(global.config.src, 'public', 'third_party', '**', '*.*'),
  ])
  .pipe(gulp.dest(
    path.join(
      global.config.dest,
      'public',
      'third_party'
    )
  ));
});

gulp.task('thirdparty', gulp.series([
  gulp.parallel('thirdparty:workbox', 'thirdparty:private'),
  'thirdparty:build',
]));

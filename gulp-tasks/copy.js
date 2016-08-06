'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('copy:deploy-keys', () => {
  return gulp.src([
      global.config.private + '/keys/**/*'
    ])
    .pipe(gulp.dest(global.config.dest + '/keys/'));
});

gulp.task('copy:root', () => {
  return gulp.src([
      global.config.src + '/frontend/*.{json,txt,ico}'
    ])
    .pipe(gulp.dest(global.config.dest));
});

gulp.task('copy', (cb) => {
  runSequence(
    [
      'copy:root',
      'copy:deploy-keys'
    ],
  cb);
});

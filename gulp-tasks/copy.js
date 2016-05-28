'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

gulp.task('copy:deploy-keys', () => {
  return gulp.src([
      GLOBAL.config.private + '/keys/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.dest + '/keys/'));
});

gulp.task('copy:root', () => {
  return gulp.src([
      GLOBAL.config.src + '/frontend/*.{json,txt,ico}'
    ])
    .pipe(gulp.dest(GLOBAL.config.dest));
});

gulp.task('copy', (cb) => {
  runSequence(
    [
      'copy:root',
      'copy:deploy-keys'
    ],
  cb);
});

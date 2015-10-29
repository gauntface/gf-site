'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('copy:deploy-assets', [], function() {
  return gulp.src([
      GLOBAL.config.deploy.assets + '/*.*',
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root));
});

gulp.task('copy:root', function() {
  return gulp.src([
      GLOBAL.config.src.root + '/*.{json,txt,ico}'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/'));
});

gulp.task('copy', [], function(cb) {
  runSequence(
    [
      'copy:root',
      'copy:deploy-assets'
    ],
  cb);
});

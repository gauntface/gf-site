'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('copy-deploy-assets', [], function() {
  return gulp.src([
      GLOBAL.config.deploy.assets + '/*.*',
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root));
});

gulp.task('copy', [], function(cb) {
  runSequence(
    [
      'copy-deploy-assets'
    ],
  cb);
});

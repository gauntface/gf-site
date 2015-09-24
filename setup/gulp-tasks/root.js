'use strict';

var gulp = require('gulp');

gulp.task('root', function() {
  return gulp.src([
      GLOBAL.config.src.root + '/*.json'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/'));
});

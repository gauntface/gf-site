'use strict';

var gulp = require('gulp');
var del = require('del');

gulp.task('static:clean', del.bind(null, [
    GLOBAL.config.build.static + '/**/*'
  ], {dot: true}));

gulp.task('static', ['static:clean'],
  function() {
    return gulp.src([
      GLOBAL.config.src.static + '/**/*'
      ])
      .pipe(gulp.dest(GLOBAL.config.build.static));
  });

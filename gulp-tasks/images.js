'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');

// Clean output directory
gulp.task('images:clean', del.bind(null, [
    GLOBAL.config.build.images + '/**/*'
  ], {dot: true}));

gulp.task('images', ['images:clean'], function() {
  return gulp.src(GLOBAL.config.src.images + '/**/*')
    .pipe(plugins.if(GLOBAL.Gulp.prod, plugins.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(GLOBAL.config.build.images));
});

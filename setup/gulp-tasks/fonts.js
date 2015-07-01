'use strict';

var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();

gulp.task('fonts:clean', del.bind(null, [
    GLOBAL.config.build.fonts + '/**/*'
  ], {dot: true}));

gulp.task('copy-fonts', ['fonts:clean'], function() {
  return gulp.src([
    GLOBAL.config.src.fonts + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.fonts))
    .pipe(plugins.size({title: 'copy-fonts'}));
});

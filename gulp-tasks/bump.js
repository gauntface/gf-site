'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var bump = require('gulp-bump');

gulp.task('bump', function() {
  return gulp.src('./package.json')
    .pipe(plugins.if(!GLOBAL.Gulp.prod, bump({type: 'patch'})))
    .pipe(gulp.dest('./'));
});

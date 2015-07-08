'use strict';

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();

gulp.task('fonts:clean', del.bind(null, [
    GLOBAL.config.build.fonts + '/**/*'
  ], {dot: true}));

gulp.task('copy-included-fonts', ['fonts:clean'], function() {
  return gulp.src([
    GLOBAL.config.src.fonts + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.fonts))
    .pipe(plugins.size({title: 'copy-included-fonts'}));
});

gulp.task('copy-deploy-fonts', ['fonts:clean'], function() {
  return gulp.src([
    GLOBAL.config.deploy.fonts + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.fonts))
    .pipe(plugins.size({title: 'copy-deploy-fonts'}));
});

gulp.task('copy-fonts', ['fonts:clean'], function(cb) {
  runSequence([
    'copy-deploy-fonts',
    'copy-included-fonts'
  ], cb);
});

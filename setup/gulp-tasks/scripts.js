'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');

gulp.task('scripts:clean', del.bind(null, [
    GLOBAL.config.build.scripts + '/**/*.{js}'
  ], {dot: true}));

gulp.task('scripts', ['scripts:clean'], function() {
  return gulp.src([
      '!' + GLOBAL.config.src.scripts + '/**/_*.js',
      GLOBAL.config.src.scripts + '/**/*.js'
    ])
    .pipe(plugins.uglify({preserveComments: 'some'}))
    // Output files
    .pipe(gulp.dest(GLOBAL.config.build.scripts))
    .pipe(plugins.size({title: 'scripts'}));
});

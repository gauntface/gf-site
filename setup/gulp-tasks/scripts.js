'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('scripts:clean', del.bind(null, [
    GLOBAL.config.build.scripts + '/**/*.{js}'
  ], {dot: true}));

  gulp.task('scripts-deploy', function() {
    return gulp.src([
        '!' + GLOBAL.config.deploy.scripts + '/**/_*.js',
        GLOBAL.config.deploy.scripts + '/**/*.js'
      ])
      .pipe(plugins.uglify({preserveComments: 'some'}))
      // Output files
      .pipe(gulp.dest(GLOBAL.config.build.scripts))
      .pipe(plugins.size({title: 'scripts'}));
  });

gulp.task('scripts-src', function() {
  return gulp.src([
      '!' + GLOBAL.config.src.scripts + '/**/_*.js',
      GLOBAL.config.src.scripts + '/**/*.js'
    ])
    .pipe(plugins.uglify({preserveComments: 'some'}))
    // Output files
    .pipe(gulp.dest(GLOBAL.config.build.scripts))
    .pipe(plugins.size({title: 'scripts'}));
});

gulp.task('scripts', ['scripts:clean'], function(cb) {
  runSequence(
    [
      'scripts-src',
      'scripts-deploy',
    ],
  cb);
});

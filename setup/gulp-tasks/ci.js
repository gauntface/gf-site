'use strict';

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');

// Copy over the CI files
gulp.task('copy-ci', function() {
  return gulp.src([
      GLOBAL.config.src.codeigniter + '/**/*.{php,html}'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root));
});

gulp.task('ci-custom-configs', function() {
  return gulp.src([
      GLOBAL.config.src.configs.codeigniter + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/application/config/'));
});

gulp.task('set-ci-file-permissions', function(cb) {
  // TODO This needs fixing to a more secure permission
  fs.chmodSync(GLOBAL.config.build.root + '/application/logs/', '777');
  cb();
});

// Copy over media into the correct path
//gulp.task('copy-ci-images', function() {
//  return gulp.src([
//    GLOBAL.config.src.images + '/**/*.{jpg,jpeg,png}'
//  ], {
//    dot: true
//  }).pipe(gulp.dest(GLOBAL.config.build.images));
//});

// Clean output directory
gulp.task('ci:clean', del.bind(null, [
  GLOBAL.config.build.root + '/application/**/*',
  GLOBAL.config.build.root + '/system/**/*',
  GLOBAL.config.build.root + '/*.php'
  ], {dot: true}));

// Perform all the tasks to build the CI files
gulp.task('build-ci', ['ci:clean'], function(cb) {
  runSequence(
    ['copy-ci', 'ci-custom-configs'],
    'set-ci-file-permissions',
  cb);
});

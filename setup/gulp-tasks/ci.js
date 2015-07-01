'use strict';

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');

// Copy over the CI files
gulp.task('copy-ci', function() {
  return gulp.src([
      GLOBAL.config.src.codeigniter + '/**/*.php'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root));
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
    ['copy-ci'],
  cb);
});

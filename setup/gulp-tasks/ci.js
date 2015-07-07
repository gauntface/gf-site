'use strict';

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var fs = require('fs');

// Copy over the CI files
gulp.task('copy-ci', function() {
  return gulp.src([
      GLOBAL.config.src.codeigniter + '/**/*.{php,html}',
      '!' + GLOBAL.config.src.codeigniter +
        '/application/{third_party,third_party/**}'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root));
});

// Copy over all CI third_party files
gulp.task('copy-ci-third-party', function() {
  return gulp.src([
      GLOBAL.config.src.codeigniter + '/application/third_party/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/application/third_party'));
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
    ['copy-ci', 'copy-ci-third-party', 'ci-custom-configs'],
    'set-ci-file-permissions',
  cb);
});

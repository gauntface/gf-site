'use strict';

var gulp = require('gulp');
var replace = require('gulp-replace');
var del = require('del');
var mkdirp = require('mkdirp');
var runSequence = require('run-sequence');
var fs = require('fs');

// Copy over the CI files
gulp.task('codeigniter:copy', function() {
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

gulp.task('copy-ci-uploads', function() {
  return gulp.src([
      GLOBAL.config.src.codeigniter + '/uploads/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/uploads/'));
});

gulp.task('ci-deploy-configs', function() {
  return gulp.src([
      GLOBAL.config.deploy.codeigniter.configs + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/application/config/'));
});

gulp.task('ci-deploy-controllers', function() {
  return gulp.src([
      GLOBAL.config.deploy.codeigniter.controllers + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/application/controllers/'));
});

gulp.task('ci-deploy-models', function() {
  return gulp.src([
      GLOBAL.config.deploy.codeigniter.models + '/**/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/application/models/'));
});

gulp.task('ci-deploy-views', function() {
  var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  return gulp.src([
      GLOBAL.config.deploy.codeigniter.views + '/**/*'
    ])
    .pipe(replace(/@GF_COMMIT_HASH@/g, version))
    .pipe(gulp.dest(GLOBAL.config.build.root + '/application/views/'));
});

gulp.task('ci-deploy-files', function(cb) {
  runSequence(
    [
      'ci-deploy-configs',
      'ci-deploy-controllers',
      'ci-deploy-models',
      'ci-deploy-views'
    ],
  cb);
});

gulp.task('codeigniter:file-permissions', function(cb) {
  // TODO This needs fixing to a more secure permission
  mkdirp(GLOBAL.config.build.root + '/application/cache/');
  mkdirp(GLOBAL.config.build.root + '/uploads/');
  mkdirp(GLOBAL.config.build.root + '/generated/');
  mkdirp(GLOBAL.config.build.root + '/sessions/');
  mkdirp(GLOBAL.config.build.root + '/logs/');
  fs.chmodSync(GLOBAL.config.build.root + '/uploads/', '777');
  fs.chmodSync(GLOBAL.config.build.root + '/generated/', '777');
  fs.chmodSync(GLOBAL.config.build.root + '/sessions/', '777');
  fs.chmodSync(GLOBAL.config.build.root + '/application/cache/', '777');
  fs.chmodSync(GLOBAL.config.build.root + '/logs/', '777');
  cb();
});

// Clean output directory
gulp.task('codeigniter:clean', del.bind(null, [
  GLOBAL.config.build.root + '/application/**/*',
  GLOBAL.config.build.root + '/system/**/*',
  GLOBAL.config.build.root + '/*.php',
  GLOBAL.config.build.root + '/generated/**/*',
  ], {dot: true}));

// Perform all the tasks to build the CI files
gulp.task('codeigniter', ['codeigniter:clean'], function(cb) {
  runSequence(
    [
      'codeigniter:copy',
      'copy-ci-third-party',
      'copy-ci-uploads',
      'ci-deploy-files'
    ],
    'codeigniter:file-permissions',
  cb);
});

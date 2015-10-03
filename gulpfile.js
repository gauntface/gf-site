'use strict';

GLOBAL.config = {
  deploy: {
    assets: 'deploy/assets',
    fonts: 'deploy/assets/fonts',
    scripts: 'deploy/assets/scripts',
    codeigniter: {
      root: 'deploy/assets/codeigniter',
      controllers: 'deploy/assets/codeigniter/controllers',
      models: 'deploy/assets/codeigniter/models',
      views: 'deploy/assets/codeigniter/views',
      configs: 'deploy/assets/codeigniter/configs',
    }
  },
  src: {
    root: 'src',
    codeigniter: 'src/codeigniter',
    images: 'src/images',
    styles: {
      root: 'src/styles',
      sass: 'src/styles/pages'
    },
    components: 'src/styles/pages',
    fonts: 'src/fonts',
    scripts: 'src/scripts',
    static: 'src/static'
  },
  build: {
    root: 'build',
    images: 'build/images',
    styles: 'build/styles',
    fonts: 'build/fonts',
    scripts: 'build/scripts',
    static: 'build/static'
  }
};

// Include Gulp & tools we'll use
var gulp = require('gulp');
var runSequence = require('run-sequence');

GLOBAL.Gulp = GLOBAL.Gulp || {
  prod: false,
  watch: false
};

var commonBuildTasks = [
  'copy',
  'fonts',
  'codeigniter',
  'static',
  'styles',
  'images',
  'scripts'
];

gulp.task('build:dev', [], function(cb) {
  GLOBAL.Gulp.prod = false;

  // Load custom tasks from the `tasks` directory
  require('require-dir')('gulp-tasks');

  runSequence(
    commonBuildTasks,
    'bump',
    'watch',
    cb);
});

gulp.task('build', [], function(cb) {
  GLOBAL.Gulp.prod = true;

  // Load custom tasks from the `tasks` directory
  require('require-dir')('gulp-tasks');

  runSequence(
    commonBuildTasks,
    'watch',
    cb);
});

// Build production files, the default task
gulp.task('default', [], function(cb) {
  GLOBAL.Gulp.watch = true;
  runSequence(
    ['build:dev'],
    cb);
});

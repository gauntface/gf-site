'use strict';

GLOBAL.config = {
  deploy: {
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
    styles: 'src/styles/scss',
    fonts: 'src/fonts',
    scripts: 'src/scripts',
  },
  build: {
    root: 'build',
    images: 'build/images',
    styles: 'build/styles',
    fonts: 'build/fonts',
    scripts: 'build/scripts'
  }
};

// Include Gulp & tools we'll use
var gulp = require('gulp');
var runSequence = require('run-sequence');

// Load custom tasks from the `tasks` directory
require('require-dir')('setup/gulp-tasks');

gulp.task('build', [], function(cb) {
  runSequence(
    ['copy-fonts', 'generate-dev-css', 'build-ci', 'scripts', 'images'],
    cb);
});

// Build production files, the default task
gulp.task('default', [], function(cb) {
  runSequence(
    ['build'],
    'start-watching',
    cb);
});

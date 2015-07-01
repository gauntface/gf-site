'use strict';

GLOBAL.config = {
  src: {
    root: 'src',
    codeigniter: 'src/codeigniter',
    images: 'src/images',
    styles: 'src/styles',
    fonts: 'src/fonts',
    scripts: 'src/scripts',
    configs: {
      root: 'src/configs',
      codeigniter: 'src/configs/codeigniter'
    }
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

// Build production files, the default task
gulp.task('default', [], function(cb) {
  runSequence(
    ['copy-fonts', 'generate-dev-css', 'build-ci', 'scripts', 'images'],
    'start-watching',
    cb);
});

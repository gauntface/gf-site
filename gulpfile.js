'use strict';

GLOBAL.config = {
  src: './src',
  private: './../gf-deploy',
  dest: './build',
  env: 'prod',
  dockerport: 5123
};

const gulp = require('gulp');
const runSequence = require('run-sequence');

// Load custom tasks from the `tasks` directory
require('require-dir')('gulp-tasks');

var commonBuildTasks = [
  'copy',
  'codeigniter',
  'styles',
  'images',
  'scripts',
];

gulp.task('dev', (cb) => {
  GLOBAL.config.env = 'dev';
  runSequence(
    commonBuildTasks,
    'docker:start',
    'watch',
    cb);
});

gulp.task('staging', (cb) => {
  GLOBAL.config.env = 'dev';
  runSequence(
    commonBuildTasks,
    'docker:build:staging',
    cb);
});

gulp.task('production', (cb) => {
  runSequence(
    commonBuildTasks,
    'docker:build:prod',
    cb);
});

gulp.task('default', (cb) => {
  runSequence(
    commonBuildTasks,
    cb);
});

'use strict';

global.config = {
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
  global.config.env = 'development';
  runSequence(
    commonBuildTasks,
    'docker:start:development',
    'watch',
    cb);
});

gulp.task('test', (cb) => {
  global.config.env = 'dev';
  runSequence(
    commonBuildTasks,
    'docker:start:test',
    cb);
});

gulp.task('staging', (cb) => {
  global.config.env = 'dev';
  runSequence(
    commonBuildTasks,
    'docker:build:staging',
    cb);
});

gulp.task('production', (cb) => {
  runSequence(
    commonBuildTasks,
    'docker:build:production',
    cb);
});

gulp.task('default', (cb) => {
  runSequence(
    commonBuildTasks,
    cb);
});

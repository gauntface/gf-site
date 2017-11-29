'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

global.config = {
  src: './src',
  dest: './build',
  env: 'dev',
  port: 5123,
  private: './../gf-deploy',
  noDockerCache: false,
  showDockerLogs: false,
};

if (argv['docker-cache'] === false) {
  global.config.noDockerCache = true;
}

if (argv['docker-logs'] === true) {
  global.config.showDockerLogs = true;
}

const gulpTaskFiles = fs.readdirSync(path.join(__dirname, 'gulp-tasks'));
gulpTaskFiles.forEach((taskFile) => {
  const completePath = path.join(__dirname, 'gulp-tasks', taskFile);
  if (fs.lstatSync(completePath).isFile() && taskFile.indexOf('.') !== 0) {
    require(completePath);
  }
});

gulp.task('build', gulp.series([
  'clean',
  'thirdparty',
  gulp.parallel([
    'styles',
    'templates',
    'images',
    'scripts',
    'extras',
  ]),
]));

gulp.task('dev', gulp.series([
  'build',
  'docker:run:dev',
]));

gulp.task('testing', gulp.series([
  'build',
  'docker:run:testing',
]));

gulp.task('prod', gulp.series([
  'build',
  'docker:run:prod',
]));

gulp.task('prod:save', gulp.series([
  'build',
  'docker:save:prod',
]));

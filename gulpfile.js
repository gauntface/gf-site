'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

global.config = {
  src: './src',
  dest: './build',
  env: 'prod',
  port: 5123,
  private: './../gf-deploy',
};

const gulpTaskFiles = fs.readdirSync(path.join(__dirname, 'gulp-tasks'));
gulpTaskFiles.forEach((taskFile) => {
  const completePath = path.join(__dirname, 'gulp-tasks', taskFile);
  if (fs.lstatSync(completePath).isFile()) {
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

gulp.task('prod', gulp.series([
  'build',
  'docker-run:prod',
]));

gulp.task('default', gulp.parallel(['thirdparty', 'docker-run:dev']));

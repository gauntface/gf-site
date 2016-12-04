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
  require(path.join(__dirname, 'gulp-tasks', taskFile));
});

gulp.task('default', gulp.parallel(['docker-build']));

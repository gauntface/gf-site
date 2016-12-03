'use strict';

global.config = {
  src: './src',
  dest: './build',
  env: 'prod',
  port: 5123,
  private: './../gf-deploy',
};

const gulp = require('gulp');

require('./gulp-tasks/copy');

gulp.task('default', gulp.parallel(['copy']));

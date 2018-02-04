'use strict';

/* eslint-env node */

const path = require('path');
const gulp = require('gulp');

const extras = () => {
  return gulp.src([
    './package.json',
    global.__buildConfig.src + '/**/*.json',
    path.join(__dirname, '..', '..', 'gf-deploy', 'src', '**/*'),
  ])
  .pipe(gulp.dest(global.__buildConfig.dest));
};

module.exports = {
  task: extras,
  build: extras,
  watchGlobs: [
    global.__buildConfig.src + '/**/*.json',
    path.join(__dirname, '..', '..', 'gf-deploy', 'src', '**/*')
  ],
}

'use strict';

const gulp = require('gulp');
const fs = require('fs');
const path = require('path');

global.config = {
  src: './src',
  dest: './build',
  env: 'dev',
  port: 5123,
  private: './../gf-deploy',
};

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

gulp.task('prod:run', gulp.series([
  gulp.series([
    'build',
    'docker:run:prod',
  ]),
]));

gulp.task('prod:save', gulp.series([
  gulp.series([
    'build',
    'docker:save:prod',
  ]),
]));

gulp.task('testing', gulp.series([
  gulp.parallel([
    'build',
    'build',
    // 'docker-run:testing',
  ]),
]));

gulp.task('dev', gulp.parallel([
  'build',
  // 'docker-run:dev',
]));

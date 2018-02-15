'use strict';

// Testing out DASH

const gulp = require('gulp');
const fs = require('fs-extra');
const path = require('path');
const constants = require('./gulp-tasks/models/constants');

global.config = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'build'),
  private: path.join(__dirname, '..', 'gf-deploy'),
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
  async () => {
    await fs.remove(constants.DOCKER_BUILD_PATH);
  },
  'build',
  'docker:save:prod',
  async () => {
    return Promise.all([
      fs.copy(
        path.join(__dirname, 'docker-compose.yml'),
        path.join(constants.DOCKER_BUILD_PATH, 'docker-compose.yml'),
      ),
      fs.copy(
        path.join(__dirname, '..', 'gf-deploy', 'docker-compose.yml'),
        path.join(constants.DOCKER_BUILD_PATH, 'docker-compose.prod.yml'),
      ),
    ]);
  },
]));

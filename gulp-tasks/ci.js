'use strict';

const gulp = require('gulp');
const replace = require('gulp-replace');
const git = require('git-rev')
const del = require('del');
const mkdirp = require('mkdirp');
const runSequence = require('run-sequence');
const fs = require('fs');

gulp.task('codeigniter:deploy', cb => {
  return gulp.src([
      global.config.private + '/src/**/*.*'
    ])
    .pipe(gulp.dest(GLOBAL.config.dest));
});

// Copy over the CI files
gulp.task('codeigniter:copy', cb => {
  git.short(function (str) {
    gulp.src([
        GLOBAL.config.src + '/server/**/*.{php,html,pem}'
      ])
      .pipe(replace(/@GF_COMMIT_HASH@/g, str))
      .pipe(gulp.dest(GLOBAL.config.dest))
      .on('end', cb);
  });
});

gulp.task('codeigniter:file-permissions', (cb) => {
  // TODO This needs fixing to a more secure permission
  mkdirp.sync(GLOBAL.config.dest + '/application/cache/');
  mkdirp.sync(GLOBAL.config.dest + '/application/dbcache/');
  mkdirp.sync(GLOBAL.config.dest + '/uploads/');
  mkdirp.sync(GLOBAL.config.dest + '/imageproducer/');
  mkdirp.sync(GLOBAL.config.dest + '/sessions/');
  mkdirp.sync(GLOBAL.config.dest + '/logs/');

  fs.chmodSync(GLOBAL.config.dest + '/application/cache/', '777');
  fs.chmodSync(GLOBAL.config.dest + '/application/dbcache/', '777');
  fs.chmodSync(GLOBAL.config.dest + '/uploads/', '777');
  fs.chmodSync(GLOBAL.config.dest + '/imageproducer/', '777');
  fs.chmodSync(GLOBAL.config.dest + '/sessions/', '777');
  fs.chmodSync(GLOBAL.config.dest + '/logs/', '777');

  cb();
});

gulp.task('codeigniter:clean:logs', del.bind(null, [
  GLOBAL.config.dest + '/logs/**/*',
], {dot: true}));

// Clean output directory
gulp.task('codeigniter:clean', del.bind(null, [
  GLOBAL.config.dest + '/application/**/*',
  GLOBAL.config.dest + '/system/**/*',
  GLOBAL.config.dest + '/*.php',
  GLOBAL.config.dest + '/generated/**/*',
  ], {dot: true}));

// Perform all the tasks to build the CI files
gulp.task('codeigniter', ['codeigniter:clean'], (cb) => {
  runSequence(
    [
      'codeigniter:copy',
      'codeigniter:deploy'
    ],
    'codeigniter:file-permissions',
  cb);
});

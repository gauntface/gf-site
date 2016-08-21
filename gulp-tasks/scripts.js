'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const rollup = require('gulp-rollup');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const path = require('path');

gulp.task('scripts:src', () => {
  let stream = gulp.src([
      '!**/third_party/**/*',
      '!' + global.config.src + '/frontend/**/*.tmpl.js',
      global.config.src + '/frontend/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [
        nodeResolve({ jsnext: true }),
        commonjs()
      ]
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .on('error', util.log);

  if (global.config.env === 'prod') {
    stream = stream.pipe(uglify());
  }

  return stream.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.config.dest));
});

gulp.task('scripts:tmpl', () => {
  let stream = gulp.src([
    '!**/third_party/**/*',
    global.config.src + '/frontend/**/*.tmpl.js'
  ])
  .pipe(sourcemaps.init())
  .pipe(rollup())
  .pipe(babel({
    presets: ['es2015']
  }));

  return stream.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.config.dest));
});

gulp.task('scripts:third_party', () => {
  return gulp.src([
      global.config.src + '/frontend/**/third_party/**/*.js',
    ])
    .pipe(gulp.dest(global.config.dest));
});

gulp.task('scripts:node_modules', () => {
  let stream = gulp.src([
    './node_modules/sw-toolbox/sw-toolbox.js',
  ]);

  if (global.config.env === 'prod') {
    stream = stream.pipe(uglify());
  }

  return stream.pipe(
    gulp.dest(
      path.join(global.config.dest, 'scripts', 'third_party')
    )
  );
});

gulp.task('scripts', (cb) => {
  runSequence(
    [
      'scripts:src',
      'scripts:tmpl',
      'scripts:third_party',
      'scripts:node_modules'
    ],
  cb);
});

'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var streamify = require('gulp-streamify');

var glob = require('glob');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('scripts:clean', del.bind(null, [
    GLOBAL.config.build.scripts + '/**/*.{js}'
  ], {dot: true}));

function compileES6Classes(browserifyFileEntries, minimise) {
  browserifyFileEntries.forEach(function(fileEntry) {
    var browserifyBundle = browserify({
        entries: [fileEntry.srcPath]
      })
      .transform(babelify);

    var bundleStream = browserifyBundle.bundle()
      .on('log', plugins.util.log.bind(plugins.util, 'Browserify Log'))
      .on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
      .pipe(source(fileEntry.outputFilename));

    var finalStream = bundleStream;
    if (minimise) {
      finalStream = bundleStream.pipe(streamify(plugins.uglify()));
    }

    return finalStream.pipe(gulp.dest(fileEntry.dest));
  });
}

function handleES6Scripts(srcPath, minimise) {
  var es6Filepaths = glob.sync(srcPath + '/**/*.es6.js');

  var browserifyFileEntries = [];
  es6Filepaths.forEach(function(filepath) {
    var filename = path.basename(filepath);
    var directoryOfFile = path.dirname(filepath);
    var relativeDirectory = path.relative(
      srcPath,
      directoryOfFile);

    browserifyFileEntries.push({
      srcPath: filepath,
      outputFilename: filename,
      dest: path.join(GLOBAL.config.build.scripts, relativeDirectory)
    });
  });

  compileES6Classes(browserifyFileEntries, minimise);
}

gulp.task('scripts-deploy:prod', function(cb) {
  handleES6Scripts(GLOBAL.config.deploy.scripts, true);
  cb();
});

gulp.task('scripts-src:prod', function(cb) {
  handleES6Scripts(GLOBAL.config.src.scripts, true);
  cb();
});

gulp.task('scripts-deploy:dev', function(cb) {
  handleES6Scripts(GLOBAL.config.deploy.scripts, false);
  cb();
});

gulp.task('scripts-src:dev', function(cb) {
  handleES6Scripts(GLOBAL.config.src.scripts, false);
  cb();
});

gulp.task('scripts:dev', ['scripts:clean'], function(cb) {
  runSequence(
    [
      'scripts-src:dev',
      'scripts-deploy:dev',
    ],
  cb);
});

gulp.task('scripts:prod', ['scripts:clean'], function(cb) {
  runSequence(
    [
      'scripts-src:prod',
      'scripts-deploy:prod',
    ],
  cb);
});

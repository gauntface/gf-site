'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var streamify = require('gulp-streamify');
var stylish = require('jshint-stylish');

var glob = require('glob');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

function compileES6Classes(browserifyFileEntries) {
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
    if (GLOBAL.Gulp.prod) {
      finalStream = bundleStream.pipe(streamify(plugins.uglify()));
    }

    return finalStream
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter(stylish))
      .pipe(gulp.dest(fileEntry.dest));
  });
}

function handleES6Scripts(srcPath) {
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

  compileES6Classes(browserifyFileEntries);
}

gulp.task('scripts:deploy', function(cb) {
  handleES6Scripts(GLOBAL.config.deploy.scripts);
  cb();
});

gulp.task('scripts:src', function(cb) {
  handleES6Scripts(GLOBAL.config.src.scripts);
  cb();
});

gulp.task('scripts:sw', function() {
  return gulp.src([
      GLOBAL.config.src.scripts + '/serviceworker/*'
    ])
    .pipe(gulp.dest(GLOBAL.config.build.root + '/'));
});

gulp.task('scripts:clean', del.bind(null, [
    GLOBAL.config.build.scripts + '/**/*.{js}'
  ], {dot: true}));

gulp.task('scripts', ['scripts:clean'], function(cb) {
  runSequence(
    [
      'scripts:sw',
      'scripts:src',
      'scripts:deploy',
    ],
  cb);
});
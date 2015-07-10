'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');

var glob = require('glob');
var path = require('path');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('scripts:clean', del.bind(null, [
    GLOBAL.config.build.scripts + '/**/*.{js}'
  ], {dot: true}));

//  gulp.task('scripts-deploy', function() {
//    return gulp.src([
//        '!' + GLOBAL.config.deploy.scripts + '/**/_*.js',
//        GLOBAL.config.deploy.scripts + '/**/*.js'
//      ])
//      .pipe(plugins.uglify({preserveComments: 'some'}))
//      // Output files
//      .pipe(gulp.dest(GLOBAL.config.build.scripts))
//      .pipe(plugins.size({title: 'scripts'}));
//  });
//
//gulp.task('scripts-src', function() {
//  return gulp.src([
//      '!' + GLOBAL.config.src.scripts + '/**/_*.js',
//      GLOBAL.config.src.scripts + '/**/*.js'
//    ])
//    .pipe(plugins.uglify({preserveComments: 'some'}))
//    // Output files
//    .pipe(gulp.dest(GLOBAL.config.build.scripts))
//    .pipe(plugins.size({title: 'scripts'}));
//});
//
//gulp.task('scripts', ['scripts:clean'], function(cb) {
//  runSequence(
//    [
//      'scripts-src',
//      'scripts-deploy',
//    ],
//  cb);
//});

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

    return bundleStream.pipe(gulp.dest(fileEntry.dest))
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

gulp.task('scripts-deploy', function(cb) {
  handleES6Scripts(GLOBAL.config.deploy.scripts);

  cb();
});

gulp.task('scripts-src', function(cb) {
  handleES6Scripts(GLOBAL.config.src.scripts);

  cb();
});

gulp.task('scripts', ['scripts:clean'], function(cb) {
  runSequence(
    [
      'scripts-src',
      'scripts-deploy',
    ],
  cb);
});

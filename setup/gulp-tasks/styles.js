'use strict';

var gulp = require('gulp');
var del = require('del');
var streamify = require('gulp-streamify');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');
var runSequence = require('run-sequence');

var components = require('./components-gen');

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// Clean output directory
gulp.task('styles:clean', del.bind(null, [
    GLOBAL.config.build.styles + '/**/*'
  ], {dot: true}));

gulp.task('compile-sass', function() {
  gulp.src('src/styles/**/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass()
      .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(GLOBAL.config.build.styles));
});

function compileSassAutoprefix(genSourceMaps, stream) {
  return stream
    .pipe(streamify(plugins.if(genSourceMaps, plugins.sourcemaps.init())))
    .pipe(
      streamify(
        plugins.sass()
          .on('error', plugins.sass.logError)
      )
    )
    .pipe(streamify(plugins.autoprefixer(AUTOPREFIXER_BROWSERS)));
}

function handleEachStream(index, streams, cb) {
  if (index >= streams.length) {
    return cb();
  }

  var sassStream = compileSassAutoprefix(false, streams[index].stream);

  var finalStream = sassStream;
  if (streams[index].urlsToTest && streams[index].urlsToTest.length > 0) {
    // Disabled for travis and docker
    //finalStream = sassStream.pipe(streamify(plugins.uncss({
    //    html: streams[index].urlsToTest
    //  })));
  }

  finalStream.pipe(streamify(plugins.if('*.css', plugins.csso())))
    .pipe(gulp.dest(GLOBAL.config.build.styles))
    .on('finish', function() {
      handleEachStream(index + 1, streams, cb);
    });
}

gulp.task('generate-page-css:prod', function(cb) {
  var streams = components.generateComponentSass(GLOBAL.config.src.components);
  handleEachStream(0, streams, cb);
});

gulp.task('generate-page-css:dev', function() {
  var streams = components.generateComponentSass(GLOBAL.config.src.components);

  var mergedStreams = merge();
  for (var i = 0; i < streams.length; i++) {
    mergedStreams.add(
      compileSassAutoprefix(true, streams[i].stream)
        .pipe(streamify(plugins.sourcemaps.write()))
        .pipe(gulp.dest(GLOBAL.config.build.styles))
    );
  }
});

gulp.task('styles:dev', ['styles:clean'],
  function() {
    runSequence(
      [
        'generate-page-css:dev',
        'compile-sass'
      ]);
  });

gulp.task('styles:prod', ['styles:clean'],
  function() {
    runSequence(
      [
        'generate-page-css:prod',
        'compile-sass'
      ]);
  });

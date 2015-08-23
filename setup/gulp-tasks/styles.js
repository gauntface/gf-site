'use strict';

var gulp = require('gulp');
var del = require('del');
var streamify = require('gulp-streamify');
var plugins = require('gulp-load-plugins')();
var merge = require('merge-stream');

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

// Clean output directory
gulp.task('styles:clean', del.bind(null, [
    GLOBAL.config.build.styles + '/**/*'
  ], {dot: true}));

gulp.task('generate-partials-css', function() {
  gulp.src('src/styles/partials/**/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass()
      .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(streamify(plugins.sourcemaps.write()))
    .pipe(gulp.dest(GLOBAL.config.build.styles + '/partials/'));
});

gulp.task('generate-component-css', function() {
  gulp.src('src/styles/components/**/*.scss')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass()
      .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(streamify(plugins.sourcemaps.write()))
    .pipe(gulp.dest(GLOBAL.config.build.styles + '/components/'));
});

gulp.task('generate-dev-css', ['styles:clean', 'generate-component-css', 'generate-partials-css'],
function() {
  var streams = components.generateComponentSass(GLOBAL.config.src.components);

  var mergedStreams = merge();
  for (var i = 0; i < streams.length; i++) {
    mergedStreams.add(
      compileSassAutoprefix(true, streams[i].stream)
        .pipe(streamify(plugins.sourcemaps.write()))
        .pipe(gulp.dest(GLOBAL.config.build.styles))
    );
  }

  return mergedStreams;
});

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
    })
}

gulp.task('generate-prod-css', ['styles:clean', 'generate-component-css', 'generate-partials-css'],
function(cb) {
  var streams = components.generateComponentSass(GLOBAL.config.src.components);
  handleEachStream(0, streams, cb);
});

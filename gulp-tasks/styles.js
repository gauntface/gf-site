'use strict';

var gulp = require('gulp');
var del = require('del');
var streamify = require('gulp-streamify');
var plugins = require('gulp-load-plugins')();
var minifyCss = require('gulp-minify-css');
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

function compileSassStream(stream) {
  return stream
    // Sourcemap if not prod
    .pipe(streamify(plugins.if(!GLOBAL.Gulp.prod, plugins.sourcemaps.init())))
    .pipe(
      streamify(
        plugins.sass().on('error', plugins.sass.logError)
      )
    )
    // Autoprefix
    .pipe(streamify(plugins.autoprefixer(AUTOPREFIXER_BROWSERS)))
    // Minify if prod
    // .pipe(streamify(plugins.if(GLOBAL.Gulp.prod, plugins.csso())))
    .pipe(streamify(plugins.if(GLOBAL.Gulp.prod, minifyCss())))
    // Write sourcemap if not prod
    .pipe(streamify(plugins.if(!GLOBAL.Gulp.prod, plugins.sourcemaps.write())))
    // write to styles
    .pipe(gulp.dest(GLOBAL.config.build.styles));
}

function compileSassStreamArray(index, streams, cb) {
  if (index >= streams.length) {
    return cb();
  }

  // Compile and continue to next stream
  compileSassStream(streams[index].stream)
    .on('finish', function() {
      compileSassStreamArray(index + 1, streams, cb);
    });
}

gulp.task('styles:pages-gen', function(cb) {
  var streams = components.generateComponentSass(GLOBAL.config.src.components);
  compileSassStreamArray(0, streams, cb);
});

gulp.task('styles:sass', function() {
  // TODO: We only want to disable source maps here for templates/
  // Styleguide can and should have source maps.
  return compileSassStream(gulp.src('src/styles/**/*.scss'));
});

// Clean output directory
gulp.task('styles:clean', del.bind(null, [
    GLOBAL.config.build.styles + '/**/*'
  ], {dot: true}));

gulp.task('styles', ['styles:clean'], function() {
  runSequence(
    [
      'styles:pages-gen',
      'styles:sass'
    ]);
});

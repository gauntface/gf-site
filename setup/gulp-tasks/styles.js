'use strict';

var gulp = require('gulp');
var del = require('del');
var plugins = require('gulp-load-plugins')();

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

function compileSassAutoprefix(genSourceMaps) {
  return gulp.src([
      GLOBAL.config.src.styles + '/*.scss'
    ])
    .pipe(plugins.if(genSourceMaps, plugins.sourcemaps.init()))
    .pipe(plugins.sass({
      precision: 10,
      errLogToConsole: true
    })
    .on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(AUTOPREFIXER_BROWSERS));
}

// Clean output directory
gulp.task('styles:clean', del.bind(null, [
    GLOBAL.config.build.styles + '/**/*'
  ], {dot: true}));

gulp.task('generate-dev-css', ['styles:clean'], function() {
  return compileSassAutoprefix(true)
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(GLOBAL.config.build.styles))
    .pipe(plugins.size({title: 'generate-dev-css'}));
});

gulp.task('generate-prod-css', ['styles:clean'], function() {
  return compileSassAutoprefix(false)
    .pipe(plugins.if('*.css', plugins.csso()))
    .pipe(gulp.dest(GLOBAL.config.build.styles))
    .pipe(plugins.size({title: 'generate-prod-css'}));
});

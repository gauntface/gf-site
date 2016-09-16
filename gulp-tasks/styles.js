'use strict';

const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const runSequence = require('run-sequence');

const AUTOPREFIXER_BROWSERS = [
  'ie >= 11',
  'ie_mob >= 10',
  'last 2 ff versions',
  'last 2 chrome versions',
  'last 2 edge versions',
  'last 2 safari versions',
  'last 2 opera versions',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('styles:sass', () => {
  var sassStream = gulp.src(global.config.src + '/frontend/**/*.scss')
    .pipe(gulpSass().on('error', gulpSass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS));

  // We only want to minify for production builds
  if (global.config.env === 'prod') {
    sassStream = sassStream.pipe(cssnano());
  }

  return sassStream.pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.config.dest));
});

gulp.task('styles', () => {
  runSequence(
    [
      'styles:sass'
    ]);
});

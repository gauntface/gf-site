'use strict';

/* eslint-env node */

const gulp = require('gulp');
const glob = require('glob');
const imgGenerator = require('../src/utils/img-generator');

gulp.task('images:copy', () => {
  return gulp.src([
    global.config.src + '/public/**/*.{svg,ico,gif}',
  ])
  .pipe(gulp.dest(global.config.dest));
});

gulp.task('images:minified', () => {
  const imgFiles = glob.sync(`${global.config.src}/../assets/+(uploads|images)/**/*.+(jpg|jpeg|png)`, {
    absolute: true,
  });
  return imgGenerator.optimiseImageFiles(imgFiles);
});

gulp.task('images', gulp.parallel(
  'images:copy',
  'images:minified'
));

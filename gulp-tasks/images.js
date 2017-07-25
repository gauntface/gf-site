'use strict';

/* eslint-env node */

const gulp = require('gulp');
const glob = require('glob');
const path = require('path');
const imgGenerator = require('../src/utils/img-generator');

gulp.task('images:copy', () => {
  return gulp.src([
    global.config.src + '/public/**/*.{svg,ico,gif}',
  ])
  .pipe(gulp.dest(
    path.join(global.config.dest, 'public')
  ));
});

gulp.task('images:minified', () => {
  const imgFiles = glob.sync(`${global.config.src}/../assets/+(uploads|images)/**/*.+(jpg|jpeg|png|gif)`, {
    absolute: true,
  });
  return imgGenerator.optimiseImageFiles(imgFiles)
  .catch((err) => {
    console.error('Unable able to optimise images.');
    console.error(err);
  });
});

gulp.task('images', gulp.parallel(
  'images:copy',
  'images:minified'
));

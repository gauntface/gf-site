'use strict';

/* eslint-env node */

const gulp = require('gulp');
const glob = require('glob');
const path = require('path');
const imgGenerator = require('../src/utils/img-generator');

gulp.task('images:copy', () => {
  return gulp.src([
    global.config.src + '/public/**/*.{jpg,jpeg,png,webp,svg,ico,gif}',
  ])
  .pipe(gulp.dest(
    path.join(global.config.dest, 'public')
  ));
});

gulp.task('images:minified', () => {
  const backupPath = path.join(__dirname, '..', '..', 'gf-backup');
  return imgGenerator.optimiseImageFiles(
    path.join(backupPath, 'raw'),
    path.join(backupPath, 'generated'),
  )
  .catch((err) => {
    console.error('Unable able to optimise images.');
    console.error(err);
  });
});

gulp.task('images', gulp.series([
  'images:minified',
  'images:copy',
]));

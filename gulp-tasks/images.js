'use strict';

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

gulp.task('images', () => {
  let imageStream = gulp.src(global.config.src + '/frontend/**/*.{png,jpg,jpeg,svg,gif}');
  if (global.config.env === 'prod') {
    imageStream = imageStream.pipe(imagemin({
      progressive: true,
      interlaced: true
    }));
  }
  return imageStream.pipe(gulp.dest(global.config.dest));
});

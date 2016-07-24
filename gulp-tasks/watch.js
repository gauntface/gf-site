'use strict';

const gulp = require('gulp');

gulp.task('watch', () => {
  // Codeigniter
  gulp.watch([GLOBAL.config.src + '/server/**/*'],
    ['codeigniter']);
  gulp.watch([GLOBAL.config.private + '/src/**/*'],
    ['codeigniter:deploy']);

  // Sass / CSS
  gulp.watch([GLOBAL.config.src + '/frontend/**/*.scss'],
    ['styles']);

  // Scripts
  gulp.watch([GLOBAL.config.src + '/frontend/**/*.js'],
    ['scripts']);

  // Images
  gulp.watch([GLOBAL.config.src + '/frontend/**/*.{png,jpg,jpeg,svg,gif}'],
    ['images']);

  // Docker
  gulp.watch([
    GLOBAL.config.src + '/docker/**/*',
    GLOBAL.config.src + '/nginx/**/*'
  ], ['docker:start']);
});

'use strict';

const gulp = require('gulp');

gulp.task('watch', () => {
  // Codeigniter
  gulp.watch([global.config.src + '/server/**/*'],
    ['codeigniter']);
  gulp.watch([global.config.private + '/src/**/*'],
    ['codeigniter:deploy']);

  // Sass / CSS
  gulp.watch([global.config.src + '/frontend/**/*.scss'],
    ['styles']);

  // Scripts
  gulp.watch([global.config.src + '/frontend/**/*.js'],
    ['scripts']);

  // Images
  gulp.watch([global.config.src + '/frontend/**/*.{png,jpg,jpeg,svg,gif}'],
    ['images']);

  // Docker
  gulp.watch([
    global.config.src + '/docker/**/*',
    global.config.src + '/nginx/**/*'
  ], ['docker:start:development']);
});

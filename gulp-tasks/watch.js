'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');

gulp.task('watch', () => {
  browserSync.init({
    proxy: `localhost:${GLOBAL.config.dockerport}/`,
    logPrefix: 'GF',
    // Prevent browser sync from display in page notifications
    notify: false,
    open: false
  });

  // Codeigniter
  gulp.watch([GLOBAL.config.src + '/server/**/*'],
    ['codeigniter'], browserSync.reload);
  gulp.watch([GLOBAL.config.private + '/src/**/*'],
    ['codeigniter:private'], browserSync.reload);

  // Sass / CSS
  gulp.watch([GLOBAL.config.src + '/frontend/**/*.scss'],
    ['styles'], browserSync.reload);

  // Scripts
  gulp.watch([GLOBAL.config.src + '/frontend/**/*.js'],
    ['scripts'], browserSync.reload);

  // Images
  gulp.watch([GLOBAL.config.src + '/frontend/**/*.{png,jpg,jpeg,svg,gif}'],
    ['images'], browserSync.reload);

  // Docker
  gulp.watch([
    GLOBAL.config.src + '/docker/**/*',
    GLOBAL.config.src + '/nginx/**/*'
  ],
    ['docker:start'], browserSync.reload);
});

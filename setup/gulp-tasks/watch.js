'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('start-watching', function() {
  browserSync.init({
    proxy: 'localhost',
    logPrefix: 'GF',
    // Prevent browser sync from display in page notifications
    notify: false
  });

  gulp.watch([GLOBAL.config.src.codeigniter + '/**/*'],
    ['build-ci', browserSync.reload]);
  gulp.watch([GLOBAL.config.src.configs.root + '/**/*'],
    ['build-ci', browserSync.reload]);
  gulp.watch([GLOBAL.config.src.styles + '/**/*'],
    ['generate-dev-css', browserSync.reload]);
  gulp.watch([GLOBAL.config.src.fonts + '/**/*'],
    ['copy-fonts', browserSync.reload]);
  gulp.watch([GLOBAL.config.src.scripts + '/**/*'],
    ['scripts', browserSync.reload]);
  gulp.watch([GLOBAL.config.src.images + '/**/*'],
    ['images', browserSync.reload]);
});

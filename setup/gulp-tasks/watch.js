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

  // Codeigniter
  gulp.watch([GLOBAL.config.src.codeigniter + '/**/*'],
    ['build-ci', browserSync.reload]);
  gulp.watch([GLOBAL.config.deploy.codeigniter.root + '/**/*'],
    ['ci-deploy-files', browserSync.reload]);

  // Fonts
  gulp.watch([GLOBAL.config.deploy.fonts + '/**/*'],
    ['copy-deploy-fonts', browserSync.reload]);
  gulp.watch([GLOBAL.config.src.fonts + '/**/*'],
    ['copy-included-fonts', browserSync.reload]);

  // Sass / CSS
  gulp.watch([GLOBAL.config.src.styles + '/**/*'],
    ['generate-dev-css', browserSync.reload]);

  // Scripts
  gulp.watch([GLOBAL.config.src.scripts + '/**/*'],
    ['scripts', browserSync.reload]);
  gulp.watch([GLOBAL.config.deploy.scripts + '/**/*'],
    ['scripts', browserSync.reload]);

  // Images
  gulp.watch([GLOBAL.config.src.images + '/**/*'],
    ['images', browserSync.reload]);
});

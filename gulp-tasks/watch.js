'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', function() {
  browserSync.init({
    proxy: 'localhost',
    logPrefix: 'GF',
    // Prevent browser sync from display in page notifications
    notify: false,
    open: false
  });

  // Codeigniter
  gulp.watch([GLOBAL.config.src.codeigniter + '/**/*'],
    ['build-ci'], browserSync.reload);
  gulp.watch([GLOBAL.config.deploy.codeigniter.root + '/**/*'],
    ['ci-deploy-files'], browserSync.reload);

  // Fonts
  gulp.watch([GLOBAL.config.deploy.fonts + '/**/*'],
    ['copy-deploy-fonts'], browserSync.reload);
  gulp.watch([GLOBAL.config.src.fonts + '/**/*'],
    ['copy-included-fonts'], browserSync.reload);

  // Sass / CSS
  gulp.watch([GLOBAL.config.src.styles.root + '/**/*'],
    ['styles:dev'], browserSync.reload);

  // Scripts
  gulp.watch([GLOBAL.config.src.scripts + '/**/*'],
    ['scripts:dev'], browserSync.reload);
  gulp.watch([GLOBAL.config.deploy.scripts + '/**/*'],
    ['scripts:dev'], browserSync.reload);

  // Images
  gulp.watch([GLOBAL.config.src.images + '/**/*'],
    ['images:dev'], browserSync.reload);
});

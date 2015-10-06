'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('watch', function() {
  if (!GLOBAL.Gulp.watch) {
    return;
  }

  browserSync.init({
    proxy: 'localhost',
    logPrefix: 'GF',
    // Prevent browser sync from display in page notifications
    notify: false,
    open: false
  });

  // Codeigniter
  gulp.watch([GLOBAL.config.src.codeigniter + '/**/*'],
    ['codeigniter'], browserSync.reload);
  gulp.watch([GLOBAL.config.deploy.codeigniter.root + '/**/*'],
    ['codeigniter:deploy'], browserSync.reload);

  // Fonts
  gulp.watch([GLOBAL.config.deploy.fonts + '/**/*'],
    ['copy-deploy-fonts'], browserSync.reload);
  gulp.watch([GLOBAL.config.src.fonts + '/**/*'],
    ['copy-included-fonts'], browserSync.reload);

  // Sass / CSS
  gulp.watch([GLOBAL.config.src.styles.root + '/**/*'],
    ['styles'], browserSync.reload);

  // Scripts
  gulp.watch([GLOBAL.config.src.scripts + '/**/*'],
    ['scripts'], browserSync.reload);
  gulp.watch([GLOBAL.config.deploy.scripts + '/**/*'],
    ['scripts'], browserSync.reload);

  // Images
  gulp.watch([GLOBAL.config.src.images + '/**/*'],
    ['images'], browserSync.reload);
});

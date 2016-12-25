'use strict';

/* eslint-env node */

const gulp = require('gulp');
const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const path = require('path');

gulp.task('styles', () => {
  const browserSupport = ['last 2 versions'];
  const processors = [
    atImport({
      resolve: (id, basedir, importOptions) => {
        if (path.isAbsolute(id)) {
          return path.join(__dirname, '..',
            'src', 'server', 'app', 'webroot', id);
        }
      },
    }),
    cssnext({browsers: browserSupport, warnForDuplicates: false}),
    cssnano(),
  ];

  return gulp.src(global.config.src + '/**/*.css')
  .pipe(postcss(processors))
  .pipe(gulp.dest(global.config.dest));
});

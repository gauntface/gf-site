const path = require('path');
const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');

module.exports = () => {
  return postcss([
    cssimport({
      resolve: (id, basedir, importOptions) => {
        if (path.isAbsolute(id)) {
          return path.join(__dirname, '..', '..',
            'src', 'public', id);
        }
      },
    }),
    cssnext({
      features: {
        customProperties: {
          // Allows both fallback and CSS variables to be used
          preserve: true,
        },
      },
    }),
    cssnano({
      autoprefixer: false,
      discardUnused: false,
    }),
  ]);
};

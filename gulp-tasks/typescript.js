const gulp = require('gulp');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('rollup');
const rollupStream = require('rollup-stream');
const replacePlugin = require('rollup-plugin-replace');
const uglifyPlugin = require('rollup-plugin-uglify');
const esMinify = require('uglify-es').minify;
const typescriptPlugin = require('rollup-plugin-typescript');
const rename = require('gulp-rename');

const glob = require('./utils/glob-promise');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const processScript = (scriptPath, relativePath) => {
  // const tsProject = ts.createProject('tsconfig.json');
  // const outFile = path.join(global.__buildConfig.dest, relativePath);
  return rollupStream({
    rollup,
    input: scriptPath,
    output: {
      format: 'iife',
      sourcemap: true,
    },
    plugins: [
      typescriptPlugin({
        typescript: require('typescript'),
      }),
      replacePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      uglifyPlugin({}, esMinify),
    ],
  })
  .pipe(source(relativePath))
  // buffer the output. most gulp plugins, including gulp-sourcemaps,
  // don't support streams.
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(rename({
    extname: '.js',
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(global.__buildConfig.dest));
};

const typescript = (done) => {
  // If you want to restrict which javascript files are built with rollup you
  // can alter this regex to match specific file(s) or directories of files.
  return glob('**/*.ts', {
    cwd: global.__buildConfig.src,
    absolute: true,
  })
  .then((scriptFiles) => {
    if (scriptFiles.length === 0) {
      done();
      return;
    }

    const scriptFunctions = scriptFiles.map((filePath) => {
      const relativePath = path.relative(
        path.normalize(global.__buildConfig.src),
        filePath
      );

      const cb = () => processScript(filePath, relativePath);
      cb.displayName = `typescript: ${relativePath}`;
      return cb;
    });

    // This seems to be the only way to use gulp.parallel to wait for the
    // streams to finish.
    return gulp.parallel(scriptFunctions)(done);
  });
};

/** const typescript = () => {
 * // TODO: Remove spaced
  const tsResult = gulp.src(global.__buildConfig.src + '/ * * /*.ts')
  /**  .pipe(sourcemaps.init())
    .pipe(tsProject());

    return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.__buildConfig.dest));
};**/

module.exports = {
  task: typescript,
  build: typescript,
  watchGlobs: global.__buildConfig.src + '/**/*.ts',
};

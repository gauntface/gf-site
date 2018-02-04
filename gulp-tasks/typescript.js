const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.json');

const typescript = () => {
  const tsResult = gulp.src(global.__buildConfig.src + '/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject());

    return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.__buildConfig.dest));
};

module.exports = {
  task: typescript,
  build: typescript,
  watchGlobs: global.__buildConfig.src + '/**/*.ts',
};

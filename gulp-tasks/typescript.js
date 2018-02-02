const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.json');

const typescript = () => {
  const tsResult = gulp.src(global.config.src + '/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject());

    return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.config.dest));
};

gulp.task(typescript);

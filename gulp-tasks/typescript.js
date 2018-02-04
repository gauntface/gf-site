const gulp = require('gulp');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.json');

const typescript = () => {
  const tsResult = gulp.src(global.config.src + '/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject());

    return tsResult.js
    .pipe(rename({extname: '.ts.js'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(global.config.src));
};

gulp.task(typescript);

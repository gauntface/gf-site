const gulp = require('gulp');
const path = require('path');
const imgGenerator = require('../src/utils/img-generator');

const extensions = [
  'jpeg',
  'jpg',
  'png',
  'webp',
  'gif',
  'svg',
  'ico',
];

const copyImages = () => {
  return gulp.src([
    global.__buildConfig.src + '/public/**/*.{jpg,jpeg,png,webp,svg,ico,gif}',
  ])
  .pipe(gulp.dest(
    path.join(global.__buildConfig.dest, 'public')
  ));
};

const minifiedImages = () => {
  const backupPath = path.join(__dirname, '..', '..', 'gf-backup');
  return imgGenerator.optimiseImageFiles(
    path.join(backupPath, 'raw'),
    path.join(backupPath, 'generated'),
  )
  .catch((err) => {
    console.error('Unable able to optimise images.');
    console.error(err);
  });
};

const images = (done) => {
  return gulp.parallel([
    copyImages,
    minifiedImages,
  ])(done);
};

module.exports = {
  task: images,
  build: images,
  watchGlobs: `${global.__buildConfig.src}/**/*.{${extensions.join(',')}}`,
};

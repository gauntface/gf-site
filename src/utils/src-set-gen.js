const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

module.exports = (imagePath, text) => {
  const generatedPath = path.join(
    __dirname, '..', 'public', 'generated', imagePath);
  return fs.stat(generatedPath)
  .then((stats) => {
    if (!stats.isDirectory()) {
      throw new Error(`Src-set image doesn't have a generated folder ` +
        `${generatedPath}`);
    }

    return new Promise((resolve, reject) => {
      glob(path.join(generatedPath, '*.*'), (err, globs) => {
        if (err) {
          return reject(err);
        }
        resolve(globs);
      });
    });
  })
  .then((availableImages) => {
    let largestSrc = null;
    let largestWidth = 0;

    const nonWebPImages = availableImages.filter((availableImage) => {
      return !(path.extname(availableImage) === '.webp');
    });

    const srcSet = nonWebPImages.map((imagePath) => {
      const imgUrl = path.relative(
        path.join(__dirname, '..', 'public'),
        imagePath
      );
      const imgWidth = parseInt(
        path.basename(imagePath, path.extname(imagePath)), 10);

      if (!largestSrc || largestWidth < imgWidth) {
        largestSrc = imgUrl;
        largestWidth = imgWidth;
      }

      return `/${imgUrl} ${imgWidth}w`;
    }).join(', ');
    return `<img src="${largestSrc}" srcset="${srcSet}" alt="${text}">`;
  });
};

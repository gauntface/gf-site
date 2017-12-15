const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const BACKUP_PATH = path.join(path.sep, 'gauntface', 'backup');
const GENERATED_PATH = path.join(BACKUP_PATH, 'generated');

module.exports = (imagePath, text) => {
  try {
  const generatedPath = path.join(GENERATED_PATH, imagePath);
  const stats = fs.statSync(generatedPath);
  if (!stats.isDirectory()) {
    throw new Error(`Src-set image doesn't have a generated folder ` +
      `${generatedPath}`);
  }

  const availableImages = glob.sync(path.join(generatedPath, '*.*'));
  if (availableImages.length === 1) {
    const imgUrl = path.relative(
      GENERATED_PATH,
      availableImages[0]
    );
    return `<img src="/${imgUrl}" alt="${text}" />`;
  }

  let largestSrc = null;
  let largestWidth = 0;

  const nonWebPImages = availableImages.filter((availableImage) => {
    return !(path.extname(availableImage) === '.webp');
  });
  const webPImages = availableImages.filter((availableImage) => {
    return (path.extname(availableImage) === '.webp');
  });

  const srcSet = nonWebPImages.map((imagePath) => {
    const imgUrl = path.relative(
      GENERATED_PATH,
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

  const webpSrcSet = webPImages.map((imagePath) => {
    const imgUrl = path.relative(
      GENERATED_PATH,
      imagePath
    );
    const imgWidth = parseInt(
      path.basename(imagePath, path.extname(imagePath)), 10);

    return `/${imgUrl} ${imgWidth}w`;
  }).join(', ') || null;

  let htmlMarkup = '<picture>';
  if (webpSrcSet) {
    htmlMarkup += `<source srcset="${webpSrcSet}" type="image/webp">`;
  }
  htmlMarkup += `<source srcset="${srcSet}">`;
  htmlMarkup += `<img src="/${largestSrc}" alt="${text}" />`;
  htmlMarkup += '</picture>';
  return htmlMarkup;
} catch (err) {
  console.log(err);
}
};

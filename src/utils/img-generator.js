const path = require('path');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminWebp = require('imagemin-webp');

class ImageGenerator {
  generateAllImageVariations(imagePath, outputPath) {
    const fileWidths = [
      400,
      800,
      1200,
      1600,
      2000,
      2400,
    ];
    fileWidths.forEach((fileWidth) => {
      const outputFilepath = path.join(
        outputPath,
        `${fileWidth}w${path.extname(imagePath)}`
      );
      console.log(`TODO: Resize ${imagePath} to ${outputFilepath}`);
    });
    // 400, 800, 1200, 1600, 2000, 2400 (800 * 3 = 2400)

    // 0. Check if files exist.

    // 1. Resize Images

    const globPath = `${outputPath}/*.{jpg,png}`;

    return Promise.all([
      // Minimise based on image type.
      imagemin([globPath], outputPath, {
        plugins: [
          imageminJpegtran(),
          imageminOptipng(),
        ],
      }),

      // Minimise and convert to webp
      imagemin([globPath], outputPath, {
        plugins: [
          imageminWebp(),
        ],
      })
    ]);
  }

  optimiseImageFiles(arrayOfFiles) {
    return arrayOfFiles.reduce((promiseChain, filePath) => {
      return promiseChain.then(() => {
        const relativeFilePath = path.relative(
          path.join(__dirname, '..', 'public'),
          filePath
        );
        const outputPath = path.join(
          __dirname, '..', 'public', 'generated', relativeFilePath
        );
        return this.generateAllImageVariations(filePath, outputPath);
      });
    }, Promise.resolve());
  }
}

module.exports = new ImageGenerator();

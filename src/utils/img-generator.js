const path = require('path');
const fs = require('fs-extra');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminWebp = require('imagemin-webp');

class ImageGenerator {
  generateAllImageVariations(imagePath, outputPath) {
    const allFileWidths = [
      400,
      800,
      1200,
      1600,
      2000,
      2400,
    ];

    return sharp(imagePath).metadata()
    .then((metadata) => {
      let maxedOut = false;
      const selectedFileWidths = allFileWidths.filter((currentWidth) => {
        if (currentWidth <= metadata.width) {
          return true;
        } else {
          // If the image is too small to create the sizes, we should at least
          // add the full image size to the options.
          if (maxedOut) {
            return false;
          }
          maxedOut = true;
          return true;
        }
      });

      return selectedFileWidths.reduce((promiseChain, fileWidth) => {
        const outputFilepath = path.join(
          outputPath,
          `${fileWidth}${path.extname(imagePath)}`
        );

        return promiseChain.then(() => {
          return fs.access(outputFilepath)
          .catch(() => {
            console.log(`Generating image: ${path.relative(process.cwd(), outputFilepath)}`);
            return fs.ensureDir(outputPath)
            .then(() => {
              return sharp(imagePath)
                .withoutEnlargement(true)
              .resize(fileWidth, null)
              .toFile(outputFilepath);
            })
            .then(() => {
              // Minimise based on image type.
              return imagemin([outputFilepath], outputPath, {
                plugins: [
                  imageminJpegtran(),
                  imageminOptipng(),
                ],
              });
            })
            .then(() => {
              // Minimise and convert to webp
              return imagemin([outputFilepath], outputPath, {
                plugins: [
                  imageminWebp(),
                ],
              });
            });
          });
        });
      }, Promise.resolve());
    });
    // 400, 800, 1200, 1600, 2000, 2400 (800 * 3 = 2400)

    // 0. Check if files exist.

    // 1. Resize Images

    /** const globPath = `${outputPath}/*.{jpg,png}`;

    **/
  }

  optimiseImageFiles(arrayOfFiles) {
    return arrayOfFiles.reduce((promiseChain, filePath) => {
      return promiseChain.then(() => {
        const relativeFilePath = path.relative(
          path.join(__dirname, '..', '..', 'assets'),
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

const path = require('path');
const fs = require('fs-extra');
const gm = require('gm');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminOptipng = require('imagemin-optipng');
const imageminWebp = require('imagemin-webp');
const imageminGifsicle = require('imagemin-gifsicle');

class ImageGenerator {
  _handleJpegPng(imagePath, outputPath) {
    const allFileWidths = [
      400,
      800,
      1200,
      1600,
      2000,
      2400,
    ];

    // Get current width of image
    return new Promise((resolve, reject) => {
      gm(imagePath).size(function(err, value) {
        if (err) {
          return reject(err);
        }
        resolve(value);
      });
    })
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
              return new Promise((resolve, reject) => {
                return gm(imagePath)
                .resize(fileWidth)
                .write(outputFilepath, (err) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve();
                });
              });
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
  }

  _handleGif(imagePath, outputPath) {
    return imagemin([imagePath], outputPath, {
      plugins: [
        imageminGifsicle(),
      ],
    });
  }

  generateAllImageVariations(imagePath, outputPath) {
    if (path.extname(imagePath) === '.gif') {
      return this._handleGif(imagePath, outputPath);
    }
    return this._handleJpegPng(imagePath, outputPath);
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

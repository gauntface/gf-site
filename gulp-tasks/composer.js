'use strict';

/* eslint-env node */

const gulp = require('gulp');
const path = require('path');
const spawn = require('child_process').spawn;

gulp.task('composer', () => {
  return new Promise((resolve, reject) => {
    const args = [
      'install',
      '-d',
      `./${global.config.dest}/server`,
      '--prefer-source',
      '--no-interaction',
    ];

    const composerProcess = spawn('composer', args, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    composerProcess.on('exit', (code) => {
      if (code !== 0) {
        return reject(`Unexpected exit code: ${code}`);
      }

      resolve();
    });
  });
});

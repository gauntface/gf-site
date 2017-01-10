const seleniumAssistant = require('selenium-assistant');
const lighthouse = require('lighthouse');
const path = require('path');
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;

class LighthouseWrapper {
  constructor() {

  }

  downloadChrome() {
    console.log('Starting download.');
    return seleniumAssistant.downloadLocalBrowser('chrome', 'stable', 24 * 7)
    .then(() => {
      console.log('Download finished.');
    });
  }

  run(url) {
    const tmpDir = this._unixTmpDir();
    const args = [
      `--remote-debugging-port=${9222}`,
      '--disable-extensions',
      '--disable-translate',
      '--disable-default-apps',
      '--no-first-run',
      `--user-data-dir=${tmpDir}`,
    ];
    const chromeProcess = spawn(
      path.join(seleniumAssistant.getBrowserInstallDir(), '/chrome/stable/usr/bin/google-chrome-stable'),
      args
    );

    // Wait for Chrome to be usable
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    })
    .then(() => {
      return lighthouse(url);
    })
    .catch((err) => {
      console.error(`Error occured when running '${url}' through lighthouse.`);
      console.error(err);

      chromeProcess.kill('SIGHUP');

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(err);
        }, 2000);
      });
    })
    .then((results) => {
      chromeProcess.kill('SIGHUP');

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(results);
        }, 2000);
      });
    });
  }

  _unixTmpDir() {
    return execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim();
  }
}

module.exports = new LighthouseWrapper();

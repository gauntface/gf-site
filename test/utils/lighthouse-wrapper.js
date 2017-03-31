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

  startChrome() {
    if (this._chromeProcess) {
      return Promise.resolve();
    }

    const tmpDir = this._unixTmpDir();
    const args = [
      `--remote-debugging-port=${9222}`,
      '--disable-extensions',
      '--disable-translate',
      '--disable-default-apps',
      '--no-first-run',
      `--user-data-dir=${tmpDir}`,
    ];
    this._chromeProcess = spawn(
      path.join(seleniumAssistant.getBrowserInstallDir(), '/chrome/stable/usr/bin/google-chrome-stable'),
      args
    );

    // Wait for Chrome to be usable
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  killChrome() {
    if (!this._chromeProcess) {
      return Promise.resolve();
    }

    this._chromeProcess.kill('SIGHUP');
    this._chromeProcess = null;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  }

  run(url) {
    return lighthouse(url);
  }

  _unixTmpDir() {
    return execSync('mktemp -d -t lighthouse.XXXXXXX').toString().trim();
  }
}

module.exports = new LighthouseWrapper();

const chalk = require('chalk');

class Logger {
  constructor(prefix) {
    this._prefix;
  }

  log(...args) {
    console.log(chalk.green(this._prefix), ...args);
  }

  warn(...args) {
    console.log(chalk.yellow(this._prefix), ...args);
  }

  error(...args) {
    console.log(chalk.red(this._prefix), ...args);
  }
}

module.exports = Logger;

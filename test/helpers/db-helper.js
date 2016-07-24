'use strict';

const mysql = require('mysql');

/**
 * > CREATE DATABASE gauntface_site_db_test;
 * > USE gauntface_site_db_test;
 * > CREATE USER 'gf_site_test'@'localhost' IDENTIFIED BY 'test_password';
 * > GRANT ALL PRIVILEGES ON gauntface_site_db_test.* TO 'gf_site_test'@'localhost';
 */

class DBHelper {
  constructor() {
  }

  open() {
    let previousPromise = Promise.resolve();
    if (this._database) {
      previousPromise = this.close();
    }

    return previousPromise.then(() => {
      this._database = mysql.createConnection({
          host     : 'localhost',
          user     : 'gf_site_test',
          password : 'test_password',
          database : 'gauntface_site_db_test'
      });

      return new Promise((resolve, reject) => {
        this._database.connect(err => {
          if (err) {
            return reject(err);
          }

          resolve();
        });
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this._database.end(() => {
        resolve();
      });
    });
  }

  query(query, params) {
    return new Promise((resolve, reject) => {
      this._database.query(query, params, (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  }
}

module.exports = new DBHelper();

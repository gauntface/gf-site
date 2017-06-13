const mysql = require('mysql');

const TABLES = {
  post: 'posts_table',
};

const CREATE_POSTS_TABLE = `CREATE TABLE IF NOT EXISTS ${TABLES.post} (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  publishDate datetime DEFAULT NULL,
  draftDate datetime NOT NULL,
  title text,
  author varchar(100) NOT NULL DEFAULT 'Matt Gaunt',
  excerptMarkdown text,
  bodyMarkdown text,
  mainImage text,
  mainImageBgColor text,
  slug text,
  status varchar(100) NOT NULL DEFAULT 'draft',
  PRIMARY KEY (id)
)`;

const CREATE_TABLES = [
  CREATE_POSTS_TABLE,
];

class DatabaseHelper {
  get ready() {
    if (!this._ready) {
      this._connect();
      this._ready = this._createTables();
    }

    return this._ready;
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (!this._mysqlConnection) {
        return resolve();
      }

      this._mysqlConnection.end((err) => {
        this._ready = null;
        this._mysqlConnection = null;

        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  _getDBDetails() {
    let mysqlOptions;
    switch(process.env.CONFIG_NAME) {
      case 'testing': {
        const testingConfig = require('../config/testing');
        mysqlOptions = {
          host: process.env.MYSQL_NAME,
          user: testingConfig.database.user,
          password: testingConfig.database.password,
          database: testingConfig.database.database,
        };
        break;
      }
      case 'prod': {
        throw new Error('Need to add mysql options for prod environment');
      }
      default: {
        const devConfig = require('../config/development');
        mysqlOptions = {
          host: 'localhost',
          user: devConfig.database.user,
          password: devConfig.database.password,
          database: devConfig.database.database,
        };
        break;
      }
    }

    return mysqlOptions;
  }

  _connect() {
    this._mysqlConnection = mysql.createConnection(this._getDBDetails());
    this._mysqlConnection.connect();
  }

  _createTables() {
    return CREATE_TABLES.reduce((promiseChain, createTableQuery) => {
      return promiseChain.then(() => this._wrappedQuery(createTableQuery));
    }, Promise.resolve());
  }

  _wrappedQuery(query, queryArgs = []) {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(query, queryArgs,
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  executeQuery(query, queryArgs) {
    return this.ready
    .then(() => {
      return this._wrappedQuery(query, queryArgs);
    });
  }

  __TEST_ONLY_DROP_TABLES() {
    this._connect();
    return Promise.all(Object.keys(TABLES).map((tableKey) => {
      return this._wrappedQuery(`DROP TABLE IF EXISTS ${TABLES[tableKey]}`);
    }))
    .then(() => this.disconnect());
  }
}

module.exports = new DatabaseHelper();

const mysql = require('mysql');

const TABLES = {
  publishedPosts: 'published_posts_table',
  draftPosts: 'draft_posts_table',
};

const CREATE_PUB_POSTS_TABLE = `CREATE TABLE IF NOT EXISTS
  ${TABLES.publishedPosts} (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  lastUpdate datetime NOT NULL,
  title text,
  author varchar(100) NOT NULL DEFAULT 'Matt Gaunt',
  excerptMarkdown text,
  bodyMarkdown text,
  mainImage text,
  mainImageBgColor text,
  slug text,
  PRIMARY KEY (id)
)`;

const CREATE_DRAFT_POSTS_TABLE = `CREATE TABLE IF NOT EXISTS
  ${TABLES.draftPosts} (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  lastUpdate datetime NOT NULL,
  title text,
  author varchar(100) NOT NULL DEFAULT 'Matt Gaunt',
  excerptMarkdown text,
  bodyMarkdown text,
  mainImage text,
  mainImageBgColor text,
  slug text,
  PRIMARY KEY (id)
)`;

const CREATE_TABLES = [
  CREATE_PUB_POSTS_TABLE,
  CREATE_DRAFT_POSTS_TABLE,
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
    const mysqlOptions = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    };
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

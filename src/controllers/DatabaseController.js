const mysql = require('mysql');

const CREATE_POSTS_TABLE = `CREATE TABLE IF NOT EXISTS posts_table (
  post_id int(11) unsigned NOT NULL AUTO_INCREMENT,
  publish_date datetime DEFAULT NULL,
  draft_date datetime NOT NULL,
  post_title text,
  post_author varchar(100) NOT NULL DEFAULT 'Matt Gaunt',
  post_excerpt text,
  post_markdown text,
  post_main_img text,
  post_main_img_bg_color text,
  post_slug text,
  post_status varchar(100) NOT NULL DEFAULT 'draft',
  post_grey_scale_img text,
  PRIMARY KEY (post_id)
)`;

const CREATE_TABLES = [
  CREATE_POSTS_TABLE,
];

class DatabaseController {
  constructor() {
    this._mysqlConnection = mysql.createConnection({
      host: 'gauntface-local-mysql',
      user: 'example-user',
      password: 'example-password',
      database: 'example-db',
    });
    this.ready = this._initDatabase();
  }

  _initDatabase() {
    this._mysqlConnection.connect();

    return this._createTables();
  }

  _createTables() {
    return CREATE_TABLES.reduce((promiseChain, createTableQuery) => {
      return promiseChain.then(() => this._wrappedQuery(createTableQuery));
    }, Promise.resolve());
  }

  _wrappedQuery(query) {
    return new Promise((resolve, reject) => {
      this._mysqlConnection.query(query,
        (error, results, fields) => {
          if (error) {
            return reject(error);
          }
          resolve(results);
        }
      );
    });
  }

  executeQuery(query) {
    return this.ready
    .then(() => {
      return this._wrappedQuery(query);
    });
  }
}

module.exports = new DatabaseController();
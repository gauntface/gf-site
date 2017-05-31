const mysql = require('mysql');

const CREATE_POSTS_TABLE = `CREATE TABLE IF NOT EXISTS posts_table (
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

class DatabaseController {
  get ready() {
    if (!this._ready) {
      let mysqlOptions;
      switch(process.env.BUILDTYPE) {
        case 'development':
          mysqlOptions = {
            host: 'gauntface-local-mysql',
            user: 'example-user',
            password: 'example-password',
            database: 'example-db',
          };
          break;
        case 'prod':
          throw new Error('Need to add mysql options for prod environment');
        default:
          mysqlOptions = {
            host: 'localhost',
            user: 'example-user',
            password: 'example-password',
            database: 'example-db',
          };
          break;
      }
      this._ready = this._initDatabase(mysqlOptions);
    }

    return this._ready;
  }

  _initDatabase(mysqlOptions) {
    this._mysqlConnection = mysql.createConnection(mysqlOptions);
    this._mysqlConnection.connect();

    return this._createTables();
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
}

module.exports = new DatabaseController();
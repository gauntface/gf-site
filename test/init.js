'use strict';

const dbHelper = require('./helpers/db-helper');
const glob = require('glob');
const path = require('path');
const del = require('del');

describe('Gauntface Test Suite', function() {

  beforeEach(function() {
    return dbHelper.open()
    .then(() => {
      return dbHelper.query('show tables;');
    })
    .then(results => {
      const dropTablesPromise = results.map(result => {
        const tableName = result[Object.keys(result)[0]];
        return dbHelper.query(`DROP TABLE ${tableName};`);
      });
      return Promise.all(dropTablesPromise);
    })
    .then(() => {
      // Create new tables
      const sqlCommands = [
        'CREATE TABLE posts_table (post_id INT AUTO_INCREMENT PRIMARY KEY, publish_date DATETIME, draft_date DATETIME, post_title TEXT, post_author VARCHAR(100) DEFAULT \'Matt Gaunt\', post_excerpt TEXT, post_markdown TEXT, post_grey_scale_img TEXT, post_main_img TEXT, post_main_img_bg_color TEXT, post_slug TEXT, post_status TEXT);'
      ];
      const commandPromises = sqlCommands.map(sqlCommand => {
        return dbHelper.query(sqlCommand);
      });
      return Promise.all(commandPromises);
    })
    .then(() => {
      return dbHelper.close();
    })
    .then(() => {
      return del('../build/application/dbcache/**/');
    });
  });

  global.testUrl = 'http://localhost:3000';

  const testFiles = glob.sync(path.join(__dirname, 'tests/*.js'));
  testFiles.forEach(testFile => {
    require(testFile);
  });
});

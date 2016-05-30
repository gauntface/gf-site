'use strict';

require('chai').should();

const mysql = require('mysql');
const selenium = require('selenium-webdriver');
const seleniumAssistant = require('selenium-assistant');

describe('Blog Post', function() {
  const DEMO_POST_DETAILS = {
    publish_date: '2016-06-20T16:52:00',
    draft_date: '2016-06-20T16:51:00',
    post_title: 'test-generated-title-for-funsies',
    post_excerpt: 'This is the test excerpt',
    post_grey_scale_img: null,
    post_main_img: null,
    post_main_img_bg_color: '#C0FFEE',
    post_slug: 'mde-up-slug',
    post_status: 'published'
  };

  let globalDriver;
  let testPostId = -1;

  before(function() {
    return new Promise((resolve, reject) => {
      // Check if test post exists, if not, create it.
      var database = mysql.createConnection({
          host     : 'localhost',
          user     : 'gauntface_site',
          password : 'password',
          database : 'gauntface_site_db'
      });

      database.connect();

      database.query('select * from posts_table where post_title=?', [
        DEMO_POST_DETAILS['post_title']
      ], function(err, rows, fields) {
        if (err) throw err;

        if (rows.length === 0) {
          database.query('INSERT INTO posts_table SET ?', DEMO_POST_DETAILS,
          function(err, result) {
            if (err) throw err;

            testPostId = result.insertId;

            database.end();
            resolve();
          });
        } else {
          testPostId = rows[0].post_id;
          database.end();
          resolve();
        }
      });
    })
    .then(() =>  {
      const chromeBrowser = seleniumAssistant.getBrowser('chrome', 'stable');
      return chromeBrowser.getSeleniumDriver();
    })
    .then(driver => {
      globalDriver = driver;
    });
  });

  after(function() {
    this.timeout(4000);

    return seleniumAssistant.killWebDriver(globalDriver);
  });


  it('should be able to view the test page', function() {
    return new Promise((resolve, reject) => {
      globalDriver.get(`http://127.0.0.1:5123/blog/2016/06/20/${DEMO_POST_DETAILS.post_slug}`)
      .then(() => {
        const expectedTitle = `${DEMO_POST_DETAILS.post_title} - Gaunt Face | Matt Gaunt`;
        return globalDriver.wait(selenium.until.titleIs(expectedTitle), 1000);
      })
      .then(() => {
        return globalDriver.executeScript(function() {
          const keyArt = document.querySelector('.key_art-content__keyart');
          return window.getComputedStyle(keyArt)['background-color'];
        });
      })
      .then(bgColor => {
        let keyArtHex = DEMO_POST_DETAILS.post_main_img_bg_color;
        keyArtHex = keyArtHex.substring(1);
        let keyArtRed = keyArtHex.substring(0, 2);
        let keyArtGreen = keyArtHex.substring(2, 4);
        let keyArtBlue = keyArtHex.substring(4, 6);

        bgColor.should.equal(`rgb(${parseInt(keyArtRed, 16)}, ${parseInt(keyArtGreen, 16)}, ${parseInt(keyArtBlue, 16)})`);
      })
      .then(() => {
        resolve();
      })
      .thenCatch(reject);
    });
  });
});

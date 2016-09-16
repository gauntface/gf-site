'use strict';

require('chai').should();

const selenium = require('selenium-webdriver');
const seleniumAssistant = require('selenium-assistant');
const fetch = require('node-fetch');

const dbHelper = require('../helpers/db-helper');

describe('Blog API', function() {
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

  beforeEach(function() {
    this.timeout(4000);

    return dbHelper.open()
    .then(() => {
      return dbHelper.query(
        'INSERT INTO posts_table SET ?', DEMO_POST_DETAILS);
    })
    .then(result => {
      testPostId = result.insertId;
    })
    .then(() => {
      return dbHelper.close();
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

    return seleniumAssistant.killWebDriver(globalDriver)
    .then(() => {
      return dbHelper.close();
    });
  });


  it('should be able to save the test page several times via the API', function() {
    if (process.env['TRAVIS']) {
      console.warn(' SKIPPPING ON TRAVIS COS PERMISSION WOES.');
      return;
    }

    this.timeout(10000);
    return new Promise((resolve, reject) => {
      globalDriver.get(global.testUrl + `/blog/view/${testPostId}`)
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
        return fetch(`${testUrl}/admin/api/blog/save?cache-bust=${Date.now()}`, {
          method: 'POST',
          body: JSON.stringify({
            postId: testPostId,
            title: "Test 1"
          })
        });
      })
      .then(response => {
        return response.text().then(responseText => {
          console.log(responseText);
          response.status.should.equal(200);
        });
      })
      .then(() => {
        return globalDriver.get(global.testUrl + `/blog/view/${testPostId}`);
      })
      .then(() => {
        const expectedTitle = `Test 1 - Gaunt Face | Matt Gaunt`;
        return globalDriver.wait(selenium.until.titleIs(expectedTitle), 1000);
      })
       .then(() => {
        return fetch(`${testUrl}/admin/api/blog/save?cache-bust=${Date.now()}`, {
          method: 'POST',
          body: JSON.stringify({
            postId: testPostId,
            title: "Test 2"
          })
        });
      })
      .then(response => {
        response.status.should.equal(200);
      })
      .then(() => {
        return globalDriver.get(global.testUrl + `/blog/view/${testPostId}`);
      })
      .then(() => {
        const expectedTitle = `Test 2 - Gaunt Face | Matt Gaunt`;
        return globalDriver.wait(selenium.until.titleIs(expectedTitle), 1000);
      })
      .then(() => {
        resolve();
      })
      .thenCatch(reject);
    });
  });
});

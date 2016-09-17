'use strict';

const expect = require('chai').expect;
const seleniumAssistant = require('selenium-assistant');

const dbHelper = require('../helpers/db-helper');

require('chai').should();

const DEMO_POST_DETAILS = {
  publish_date: '2016-06-20T16:52:00',
  draft_date: '2016-06-20T16:51:00',
  post_title: 'Home Page Test Title',
  post_excerpt: 'This is the test excerpt',
  post_grey_scale_img: null,
  post_main_img: null,
  post_main_img_bg_color: '#C0FFEE',
  post_slug: 'mde-up-slug',
  post_status: 'published'
};

describe('Home Page', function() {

  let globalDriver;

  beforeEach(function() {
    this.timeout(4000);

    const chromeBrowser = seleniumAssistant.getBrowser('chrome', 'stable');
    return chromeBrowser.getSeleniumDriver()
    .then(driver => {
      globalDriver = driver;
    })
    .then(() => {
      return dbHelper.open();
    })
    .then(() => {
      return dbHelper.query(
        'INSERT INTO posts_table SET ?', DEMO_POST_DETAILS);
    })
    .then(() => {
      return dbHelper.close();
    });
  });

  afterEach(function() {
    this.timeout(5000);

    return seleniumAssistant.killWebDriver(globalDriver);
  });

  it('should be able to get a tweet from twitter', function() {
    this.timeout(60000);

    if (process.env['TRAVIS']) {
      console.warn(' Skipping on travis because Twitter doesn\'t have ' +
        'API keys.');
      return;
    }

    return globalDriver.get(global.testUrl)
    .then(() => {
      return globalDriver.executeScript(function() {
        const timeElement = document.querySelector('.twitter-block__tweet-info > time');
        const textElement = document.querySelector('.twitter-block__tweet');

        const returnValues = {};
        if (textElement) {
          returnValues.text = textElement.textContent;
        }

        if (timeElement) {
          returnValues.date = timeElement.getAttribute('datetime');
        }
        return returnValues;
      });
    })
    .then(tweetValues => {
      if (!tweetValues.text) {
        throw new Error('No tweet text found.');
      }

      if (!tweetValues.date) {
        throw new Error('No tweet date found.');
      }

      tweetValues.text.should.not.equal('Oops looks like there was a problem talking with Twitter.');

      expect(function() {
        new Date(tweetValues.date);
      }).to.not.throw();
    });
  });

  it('should display the first blog post on the home page', function() {
    this.timeout(60000);

    return globalDriver.get(global.testUrl)
    .then(() => {
      return globalDriver.executeScript(function(blogSlug) {
        try {
          const blogSection = document.querySelector(blogSlug);
          const timeElement = blogSection.querySelector('.title-block-item__toptext');
          const titleElement = blogSection.querySelector('.title-block-item__title');
          const excerptElement = blogSection.querySelector('.title-block-item__excerpt p');

          return {
            title: titleElement.textContent,
            excerpt: excerptElement.textContent,
            date: timeElement.getAttribute('datetime')
          }
        } catch (err) {}
        return null;
      }, `.${DEMO_POST_DETAILS.post_slug}`);
    })
    .then(blogInfo => {
      if (blogInfo === null) {
        throw new Error('Unable to get blog info from page.');
      }

      blogInfo.title.should.equal(DEMO_POST_DETAILS.post_title);
      blogInfo.excerpt.should.equal(DEMO_POST_DETAILS.post_excerpt);
      blogInfo.date.should.equal('2016-06-20');
    });
  });
});

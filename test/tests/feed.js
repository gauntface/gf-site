'use strict';

const fetch = require('node-fetch');
const feedParser = require('feed-read');

const dbHelper = require('../helpers/db-helper.js');

describe('RSS Feed', function() {

  const DEMO_POSTS = [
    {
      publish_date: '2016-03-20T16:52:00',
      draft_date: '2016-03-20T16:51:00',
      post_title: 'test-title-3',
      post_excerpt: 'test excerpt 3',
      post_markdown: 'test markdown 3',
      post_grey_scale_img: null,
      post_main_img: null,
      post_main_img_bg_color: '#C3FFEE',
      post_slug: 'slug-3',
      post_status: 'published'
    },
    {
      publish_date: '2016-01-20T16:52:00',
      draft_date: '2016-01-20T16:51:00',
      post_title: 'test-title-1',
      post_excerpt: 'test excerpt 1',
      post_markdown: 'test markdown 1',
      post_grey_scale_img: null,
      post_main_img: null,
      post_main_img_bg_color: '#C1FFEE',
      post_slug: 'slug-1',
      post_status: 'published'
    },
    {
      publish_date: '2016-02-20T16:52:00',
      draft_date: '2016-02-20T16:51:00',
      post_title: 'test-title-2',
      post_excerpt: 'test excerpt 2',
      post_markdown: 'test markdown 2',
      post_grey_scale_img: null,
      post_main_img: null,
      post_main_img_bg_color: '#C2FFEE',
      post_slug: 'slug-2',
      post_status: 'draft'
    }
  ];

  beforeEach(function() {
    return dbHelper.open()
    .then(() => {
      const insertPromises = DEMO_POSTS.map(demoPost => {
        dbHelper.query(
          'INSERT INTO posts_table SET ?', demoPost);
      });
      return Promise.all(insertPromises);
    })
    .then(() => {
      return dbHelper.close();
    });
  });

  function validateParsedArticles(articles) {
    articles.length.should.equal(2);

    articles[0].title.should.equal('test-title-3');
    articles[0].link.should.equal('http://localhost:3000/blog/2016/03/20/slug-3');
    articles[0].published.getTime().should.equal(new Date('Sun, 20 Mar 2016 16:52:00 GMT').getTime());

    articles[1].title.should.equal('test-title-1');
    articles[1].link.should.equal('http://localhost:3000/blog/2016/01/20/slug-1');
    articles[1].published.getTime().should.equal(new Date('Wed, 20 Jan 2016 16:52:00 GMT').getTime());
  }

  it('should be able to retrieve and parse the RSS feed', function() {
    return fetch(global.testUrl + '/blog/feed/rss')
      .then(response => {
        response.status.should.equal(200);

        return response.text();
      })
      .then(response => {
        return new Promise((resolve, reject) => {
          feedParser.rss(response, (err, articles) => {
            if (err) {
              return reject(err);
            }

            resolve(articles);
          });
        });
      })
      .then(articles => {
        validateParsedArticles(articles);

        articles[0].content.should.equal('<p>test excerpt 3</p>');
        articles[1].content.should.equal('<p>test excerpt 1</p>');
      });
  });

  it('should be able to retrieve and parse the Atom feed', function() {
    return fetch(global.testUrl + '/blog/feed/atom')
      .then(response => {
        response.status.should.equal(200);

        return response.text();
      })
      .then(response => {
        return new Promise((resolve, reject) => {
          feedParser.atom(response, (err, articles) => {
            if (err) {
              return reject(err);
            }

            resolve(articles);
          });
        });
      })
      .then(articles => {
        validateParsedArticles(articles);

        articles[0].author.should.equal('Matt Gaunt');
        articles[0].content.should.equal('<p>test markdown 3</p>');
        articles[1].author.should.equal('Matt Gaunt');
        articles[1].content.should.equal('<p>test markdown 1</p>');
      });
  });
});

const fetch = require('node-fetch');
const expect = require('chai').expect;

const dockerHelper = require('../../gulp-tasks/utils/docker-helper');
const parseMarkdown = require('../../src/utils/parse-markdown');
const blogModel = require('../../src/models/blog-model.js');
const SinglePostModel = require('../../src/models/single-post-model.js');
const dbHelper = require('../../src/utils/database-helper.js');
const testingConfig = require('../../src/config/testing');

describe('Test Blog Post', function() {
  before(function() {
    this.timeout(5 * 60 * 1000);

    // This env is set for the local db helper
    process.env.CONFIG_NAME = 'testing';

    return dockerHelper.stop()
    .then(() => dockerHelper.remove())
    .then(() => dockerHelper.runTestingMysql())
    .then(() => dockerHelper.runTesting())
    .then(() => {
      // This is here to wait for the mysql container to be fully up and running
      return new Promise((resolve) => {
        setTimeout(resolve, 15 * 1000);
      });
    })
    .then(() => {
      return dbHelper.__TEST_ONLY_DROP_TABLES();
    });
  });

  after(function() {
    return dbHelper.disconnect();
  });

  it('should render relevant info for blog post', function() {
    const postDate = new Date();
    const blogPost = new SinglePostModel({
      title: 'Example Title. Published.',
      excerptMarkdown: `This is the excerpt.

It has two paragraphs.`,
      bodyMarkdown: `This is the body text.

\`\`\`javascript
console.log('it has code too.')
\`\`\`
`,
      publishDate: postDate,
      draftDate: postDate,
      status: 'published',
      slug: 'example-slug',
    });

    return blogModel.addPost(blogPost)
    .catch((err) => {
      console.log('Error: ', err);
      throw err;
    })
    .then(() => {
      return fetch(`${testingConfig.url}${blogPost.getPublishedUrl()}`);
    })
    .then((response) => {
      return response.text()
      .then((textResponse) => {
        if(!response.ok) {
          throw new Error('Unable to get home screen: ' + textResponse);
        }

        return textResponse;
      });
    })
    .then((response) => {
      return parseMarkdown(blogPost.bodyMarkdown)
      .then((parsedBody) => {
        return {
          response,
          parsedBody,
        };
      });
    })
    .then((result) => {
      const response = result.response;
      const parsedBody = result.parsedBody;

      const titleRegexp = new RegExp(`<title>.*${blogPost.title}.*</title>`);
      expect(titleRegexp.exec(response)).to.exist;

      const mastheadRegexp = new RegExp(`<img.*src="${blogPost.mainImage}".*/>`);
      expect(mastheadRegexp.exec(response)).to.exist;

      expect(response.indexOf(parsedBody.html)).to.not.equal(-1);
    });
  });
});

const fetch = require('node-fetch');

const blogModel = require('../../src/models/published-posts-model.js');
const SinglePostModel = require('../../src/models/single-post-model.js');
const dbHelper = require('../../src/utils/database-helper.js');

describe('Test Blog Post', function() {
  before(async function() {
    this.timeout(5 * 60 * 1000);

    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = 3306;
    process.env.DB_USER = 'testing-user';
    process.env.DB_PASSWORD = 'testing-password';
    process.env.DB_NAME = 'testing-db';

    await dbHelper.__TEST_ONLY_DROP_TABLES();
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
      lastUpdate: postDate,
      status: 'published',
      slug: 'example-slug',
    });

    return blogModel.addPost(blogPost)
    .catch((err) => {
      console.log('Error: ', err);
      throw err;
    })
    .then(() => {
      return fetch(`http://localhost${blogPost.getPublishedUrl()}`);
    })
    .then((response) => {
      return response.text()
      .then((textResponse) => {
        if (!response.ok) {
          throw new Error('Bad status code: ' + textResponse);
        }

        return textResponse;
      });
    })
    /** .then((response) => {
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

      const mastheadRegexp = new RegExp(`<img.*src="${blogPost.mainImage}".*//** >`);
      expect(mastheadRegexp.exec(response)).to.exist;

      expect(response.indexOf(parsedBody.html)).to.not.equal(-1);
    })**/;
  });
});

const fetch = require('node-fetch');
const moment = require('moment');
const expect = require('chai').expect;
const minifyHTML = require('html-minifier').minify;

const parseMarkdown = require('../../src/utils/parse-markdown');
const blogModel = require('../../src/models/published-posts-model.js');
const SinglePostModel = require('../../src/models/single-post-model.js');
const dbHelper = require('../../src/utils/database-helper.js');

describe('Test Blog Index Page', () => {
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

  it('should display blog posts up to 20 entries', function() {
    const initialPosts = [
      new SinglePostModel({
        title: 'Example Title 1. Published',
        excerptMarkdown: `Excerpt 1

New Paragraph.`,
        bodyMarkdown: `Body 1

New Paragraph.`,
        lastUpdate: moment().subtract(30, 'days').toDate(),
        slug: 'published-1',
      }),
      new SinglePostModel({
        title: 'Example Title 2. Draft',
        excerptMarkdown: `Excerpt 2`,
        bodyMarkdown: `Body 2.`,
        lastUpdate: new Date(),
        slug: 'draft-1',
      }),
      new SinglePostModel({
        title: 'Example Title 3. Published',
        excerptMarkdown: `Excerpt 3

New Paragraph.

\`\`\`javascript
// Just a comment
console.log('Oh Hai');
\`\`\`

Testing Paragraph.

- Example List
- With Two Items
`,
        bodyMarkdown: `Body 3

New Paragraph.

\`\`\`javascript
// Just a comment
console.log('Oh Hai');
\`\`\`

Testing Paragraph.

- Example List
- With Two Items`,
        lastUpdate: moment().subtract(25, 'days').toDate(),
        slug: 'published-3',
      }),
      new SinglePostModel({
        title: 'Example Title 4. Draft',
        excerptMarkdown: `Excerpt 4.`,
        bodyMarkdown: `Body 4.`,
        lastUpdate: new Date(),
        slug: 'draft-4',
      }),
      new SinglePostModel({
        title: 'Example Title 5. Published',
        excerptMarkdown: `Excerpt 5

New Paragraph. New Paragraph. \`Example Code Snippet\`

    Code Block
`,
        bodyMarkdown: `Body 5

New Paragraph. New Paragraph. \`Example Code Snippet\`

    Code Block
`,
        lastUpdate: moment().subtract(20, 'days').toDate(),
        slug: 'published-5',
      }),
      new SinglePostModel({
        title: 'Example Title 6. Published',
        excerptMarkdown: `Excerpt 6.`,
        bodyMarkdown: `Body 6.`,
        lastUpdate: moment().subtract(15, 'days').toDate(),
        slug: 'published-6',
      }),
      new SinglePostModel({
        title: 'Example Title 7. No Slug. Published',
        excerptMarkdown: `This shouldn't be displayed due to no slug.`,
        bodyMarkdown: `This shouldn't be displayed due to no slug.`,
        lastUpdate: moment().subtract(1, 'days').toDate(),
      }),
      new SinglePostModel({
        title: 'Example Title 8. No Body. Published',
        excerptMarkdown: `This shouldn't be displayed due to no body.`,
        lastUpdate: moment().subtract(1, 'days').toDate(),
        slug: 'published-8',
      }),
    ];

    // Create a clone.
    const postModels = [].concat(initialPosts);

    // 6 Published above, max of 20 posts, so need 14 more to max, then
    // add 5 more
    const POSTS_TO_ADD = 14;
    const ADDITIONAL_POSTS = 5;
    for (let i = 0; i < POSTS_TO_ADD + ADDITIONAL_POSTS; i++) {
      postModels.push(new SinglePostModel({
        title: `AUTO-GENERATED-POST ${i}. Published`,
        excerptMarkdown: `Hello World for auto generated ${i}.`,
        bodyMarkdown: `Hello World for auto generates ${i}`,
        lastUpdate: moment().subtract(60, 'days').toDate(),
        slug: `auto-generated-${i}`,
      }));
    }

    const promises = postModels.map((model) => {
      return blogModel.addPost(model);
    });

    return Promise.all(promises)
    .catch((err) => {
      console.log('Error: ', err);
      throw err;
    })
    .then(() => {
      return fetch(`http://localhost/blog/`);
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
    .then((response) => {
      return Promise.all(postModels.map((postModel) => {
        return parseMarkdown(postModel.excerptMarkdown)
        .then((renderedContent) => {
          renderedContent.html = minifyHTML(renderedContent.html, {
            collapseWhitespace: true,
            removeComments: true,
          });
          return renderedContent;
        });
      }))
      .then((excerptHTMLs) => {
        return {
          response,
          excerptHTMLs,
        };
      });
    })
    .then(({response, excerptHTMLs}) => {
      expect(response.indexOf(postModels[0].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[0].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[1].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[1].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[2].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[2].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[3].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[3].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[4].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[4].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[5].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[5].html)).to.not.equal(-1);

      // expect(response.indexOf(postModels[6].title)).to.not.equal(-1);
      // expect(response.indexOf(excerptHTMLs[6].html)).to.not.equal(-1);

      // expect(response.indexOf(postModels[7].title)).to.not.equal(-1);
      // expect(response.indexOf(excerptHTMLs[7].html)).to.not.equal(-1);

      for (let i = 0; i < POSTS_TO_ADD + ADDITIONAL_POSTS; i++) {
        const postModel = postModels[initialPosts.length + i];
        const excerpt = excerptHTMLs[initialPosts.length + i];
        if (i < POSTS_TO_ADD) {
          expect(response.indexOf(postModel.title)).to.not.equal(-1);
          expect(response.indexOf(excerpt.html)).to.not.equal(-1);
        } else {
          expect(response.indexOf(postModel.title)).to.equal(-1);
          expect(response.indexOf(excerpt.html)).to.equal(-1);
        }
      }
    });
  });
});

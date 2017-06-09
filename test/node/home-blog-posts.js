const fetch = require('node-fetch');
const moment = require('moment');
const expect = require('chai').expect;

const dockerHelper = require('../../gulp-tasks/utils/docker-helper');
const parseMarkdown = require('../../src/utils/parse-markdown');
const blogModel = require('../../src/models/blog-model.js');
const SinglePostModel = require('../../src/models/single-post-model.js');
const siteServer = require('../../src/site-server');
const dbHelper = require('../../src/utils/database-helper.js');

describe('Test Home Page + Blog Posts', () => {
  const desiredPort = 3006;
  let serverUrl;

  before(function() {
    this.timeout(5 * 60 * 1000);

    return Promise.all([
      siteServer.start(desiredPort),
      dockerHelper.clean()
      .then(() => dockerHelper.run('mysql')),
    ])
    .then(() => {
      serverUrl = `http://localhost:${desiredPort}`;

      return new Promise((resolve) => {
        setTimeout(resolve, 15 * 1000);
      });
    })
    .then(() => {
      return dbHelper.__TEST_ONLY_DROP_TABLES();
    });
  });

  after(function() {
    return siteServer.stop()
    .then(() => {
      return dbHelper.disconnect();
    });
  });

  it('should display only published posts, max 3', function() {
    const postModels = [
      new SinglePostModel({
        title: 'Example Title 1. Published',
        excerptMarkdown: `Excerpt 1

New Paragraph.`,
        bodyMarkdown: `Body 1

New Paragraph.`,
        publishDate: moment().subtract(30, 'days').toDate(),
        draftDate: moment().subtract(30, 'days').toDate(),
        status: 'published',
        slug: 'published-1',
      }),
      new SinglePostModel({
        title: 'Example Title 2. Draft',
        excerptMarkdown: `Excerpt 2`,
        bodyMarkdown: `Body 2.`,
        draftDate: new Date(),
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
        publishDate: moment().subtract(25, 'days').toDate(),
        draftDate: moment().subtract(25, 'days').toDate(),
        status: 'published',
        slug: 'published-3',
      }),
      new SinglePostModel({
        title: 'Example Title 4. Draft',
        excerptMarkdown: `Excerpt 4.`,
        bodyMarkdown: `Body 4.`,
        draftDate: new Date(),
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
        publishDate: moment().subtract(20, 'days').toDate(),
        draftDate: moment().subtract(20, 'days').toDate(),
        status: 'published',
        slug: 'published-5',
      }),
      new SinglePostModel({
        title: 'Example Title 6. Published',
        excerptMarkdown: `Excerpt 6.`,
        bodyMarkdown: `Body 6.`,
        publishDate: moment().subtract(15, 'days').toDate(),
        draftDate: moment().subtract(15, 'days').toDate(),
        status: 'published',
        slug: 'published-6',
      }),
      new SinglePostModel({
        title: 'Example Title 7. No Slug. Published',
        excerptMarkdown: `This shouldn't be displayed due to no slug.`,
        bodyMarkdown: `This shouldn't be displayed due to no slug.`,
        publishDate: moment().subtract(1, 'days').toDate(),
        draftDate: moment().subtract(1, 'days').toDate(),
        status: 'published',
      }),
      new SinglePostModel({
        title: 'Example Title 8. No Body. Published',
        excerptMarkdown: `This shouldn't be displayed due to no body.`,
        publishDate: moment().subtract(1, 'days').toDate(),
        draftDate: moment().subtract(1, 'days').toDate(),
        status: 'published',
        slug: 'published-8',
      }),
    ];

    const promises = postModels.map((model) => {
      return blogModel.addPost(model);
    });

    return Promise.all(promises)
    .catch((err) => {
      console.log('Error: ', err);
      throw err;
    })
    .then(() => {
      return fetch(`${serverUrl}`);
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
      return Promise.all(postModels.map((postModel) => {
        return parseMarkdown(postModel.excerptMarkdown);
      }))
      .then((excerptHTMLs) => {
        return {
          response,
          excerptHTMLs,
        };
      });
    })
    .then(({response, excerptHTMLs}) => {
      expect(response.indexOf('Latest Blog Posts')).to.not.equal(-1);

      expect(response.indexOf(postModels[0].title)).to.equal(-1);
      expect(response.indexOf(excerptHTMLs[0].html)).to.equal(-1);

      expect(response.indexOf(postModels[1].title)).to.equal(-1);
      expect(response.indexOf(excerptHTMLs[1].html)).to.equal(-1);

      expect(response.indexOf(postModels[2].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[2].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[3].title)).to.equal(-1);
      expect(response.indexOf(excerptHTMLs[3].html)).to.equal(-1);

      expect(response.indexOf(postModels[4].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[4].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[5].title)).to.not.equal(-1);
      expect(response.indexOf(excerptHTMLs[5].html)).to.not.equal(-1);

      expect(response.indexOf(postModels[6].title)).to.equal(-1);
      expect(response.indexOf(excerptHTMLs[6].html)).to.equal(-1);

      expect(response.indexOf(postModels[7].title)).to.equal(-1);
      expect(response.indexOf(excerptHTMLs[7].html)).to.equal(-1);
    });
  });
});

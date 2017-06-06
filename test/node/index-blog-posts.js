const fetch = require('node-fetch');
const moment = require('moment');
const expect = require('chai').expect;

const dockerHelper = require('../../gulp-tasks/utils/docker-helper');
const blogModel = require('../../build/models/blog-model.js');
const PostModel = require('../../build/models/single-post-model.js');
const siteServer = require('../../build/site-server');

describe('Test Home Page + Blog Posts', () => {
  const desiredPort = 3006;
  let serverUrl;

  before(function() {
    this.timeout(60 * 1000);

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
    });
  });

  it('should display only published posts, max 3', function() {
    const postModels = [
      new PostModel({
        title: 'Example Title 1. Published',
        excerpt: `Hello World 1

New Paragraph.`,
        publishDate: moment().subtract(30, 'days').toDate(),
        draftDate: moment().subtract(30, 'days').toDate(),
        status: 'published',
      }),
      new PostModel({
        title: 'Example Title 2. Draft',
        excerpt: `Hello World 2`,
        draftDate: new Date(),
      }),
      new PostModel({
        title: 'Example Title 3. Published',
        excerpt: `Hello World 3

New Paragraph.

    Code Block

Testing Paragraph.

- Example List
- With Two Items
`,
        publishDate: moment().subtract(25, 'days').toDate(),
        draftDate: moment().subtract(25, 'days').toDate(),
        status: 'published',
      }),
      new PostModel({
        title: 'Example Title 4. Draft',
        excerpt: `Hello World 4`,
        draftDate: new Date(),
      }),
      new PostModel({
        title: 'Example Title 5. Published',
        excerpt: `Hello World 5

New Paragraph. New Paragraph. \`Example Code Snippet\`

    Code Block
`,
        publishDate: moment().subtract(20, 'days').toDate(),
        draftDate: moment().subtract(20, 'days').toDate(),
        status: 'published',
      }),
      new PostModel({
        title: 'Example Title 6. Published',
        excerpt: `Hello World 6.`,
        publishDate: moment().subtract(15, 'days').toDate(),
        draftDate: moment().subtract(15, 'days').toDate(),
        status: 'published',
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
      return fetch(`${serverUrl}`)
    })
    .then((response) => {
      if(!response.ok) {
        throw new Error('Unable to get home screen.');
      }

      return response.text();
    })
    .then((response) => {
      expect(response.indexOf('Latest Blog Posts')).to.not.equal(-1);
      expect(response.indexOf(postModels[0].title)).to.equal(-1);
      expect(response.indexOf(postModels[1].title)).to.equal(-1);
      expect(response.indexOf(postModels[2].title)).to.not.equal(-1);
      expect(response.indexOf(postModels[3].title)).to.equal(-1);
      expect(response.indexOf(postModels[4].title)).to.not.equal(-1);
      expect(response.indexOf(postModels[5].title)).to.not.equal(-1);

      // TODO Parse Excerpt as Markdown.
    });
  });
});

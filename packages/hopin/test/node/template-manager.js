const path = require('path');
const proxyquire = require('proxyquire').noCallThru();

const errorCodes = require('../../src/models/ErrorCodes');

require('chai').should();

describe('Template Manager', function() {
  it('should throw when no template path', function() {
    const INJECTED_ERROR = new Error('Injected Error');
    const TemplateManager = require('../../src/controllers/TemplateManager');

    try {
      new TemplateManager({});
      throw INJECTED_ERROR;
    } catch(err) {
      if (err === INJECTED_ERROR) {
        throw new Error('Expected error to be thrown.');
      }
    }
  });

  it('should read template and return its contents', function() {
    const EXAMPLE_TEMPLATE = 'Hello.';
    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (path) => {
          return Promise.resolve(new Buffer(EXAMPLE_TEMPLATE));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: 'hi',
    });
    const templatePath = 'example/template/path';
    return templateManager.readTemplate(templatePath)
    .then((templateDetails) => {
      templateDetails.path.should.equal(templatePath);
      templateDetails.content.should.equal(EXAMPLE_TEMPLATE);
      templateDetails.styles.should.deep.equal([]);
      templateDetails.scripts.should.deep.equal([]);
    });
  });

  it('should remove yaml frontmatter', function() {
    const FRONT_MATTER = '---\ntest: yaml\n---';
    const EXAMPLE_TEMPLATE = 'Hello.';
    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (path) => {
          return Promise.resolve(new Buffer(FRONT_MATTER + EXAMPLE_TEMPLATE));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: 'hi',
    });
    const templatePath = 'example/template/path';
    return templateManager.readTemplate(templatePath)
    .then((templateDetails) => {
      templateDetails.path.should.equal(templatePath);
      templateDetails.content.should.equal(EXAMPLE_TEMPLATE);
      templateDetails.styles.should.deep.equal([]);
      templateDetails.scripts.should.deep.equal([]);
    });
  });

  it('should provide styles and scripts from front matter', function() {
    const FRONT_MATTER = '---\nscripts:\n - /scripts/example.js\nstyles:\n - /styles/example.css\n---';
    const EXAMPLE_TEMPLATE = 'Hello.';
    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (path) => {
          return Promise.resolve(new Buffer(FRONT_MATTER + EXAMPLE_TEMPLATE));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: 'hi',
    });
    const templatePath = 'example/template/path';
    return templateManager.readTemplate(templatePath)
    .then((templateDetails) => {
      templateDetails.path.should.equal(templatePath);
      templateDetails.content.should.equal(EXAMPLE_TEMPLATE);
      templateDetails.styles.should.deep.equal(['/styles/example.css']);
      templateDetails.scripts.should.deep.equal(['/scripts/example.js']);
    });
  });

  it('should be able to render a basic view', function() {
    const EXAMPLE_TEMPLATE = 'Hello.';
    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (path) => {
          return Promise.resolve(new Buffer(EXAMPLE_TEMPLATE));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: 'hi',
    });
    const templatePath = 'example/template/path';
    return templateManager.render(templatePath)
    .then((templateDetails) => {
      templateDetails.content.should.equal(EXAMPLE_TEMPLATE);
      templateDetails.styles.should.deep.equal([]);
      templateDetails.scripts.should.deep.equal([]);
    });
  });

  it('should be able to render a view that has a partial', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch (relPath) {
            case 'example/partial':
              return Promise.resolve(new Buffer('Partial.'));
            case 'example/main':
              return Promise.resolve(new Buffer('---\nstyles:\n - /styles/example.css\nscripts:\n - /scripts/example.js\npartials:\n - example/partial\n---Hello.{{> example/partial}}Goodbye.'));
            default:
              return Promise.reject('Unknown template: ' + fullPath);
          }
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render('example/main', {})
    .then((templateDetails) => {
      templateDetails.content.should.equal('Hello.Partial.Goodbye.');
      templateDetails.styles.should.deep.equal([
        '/styles/example.css',
      ]);
      templateDetails.scripts.should.deep.equal([
        '/scripts/example.js',
      ]);
    });
  });

  it('should be able to render a view that uses {{content}}', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const PATH_1_CONTENT = 'Path 1 Content.';
    const PATH_2 = 'example/path/2';
    const PATH_2_CONTENT = 'Path 2 Content.';
    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1:
              return Promise.resolve(new Buffer(PATH_1_CONTENT + '{{content}}'));
            case PATH_2:
              return Promise.resolve(new Buffer(PATH_2_CONTENT));
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render(PATH_1, {
      views: [
        {
          templatePath: PATH_2,
        },
      ],
    })
    .then((templateDetails) => {
      templateDetails.content.should.equal(`${PATH_1_CONTENT}${PATH_2_CONTENT}`);
    });
  });

  it('should be able to render a view that uses {{content-*}}', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const PATH_1_CONTENT = 'Path 1 Content.';
    const PATH_2 = 'example/path/2';
    const PATH_2_CONTENT = 'Path 2 Content.';
    const PATH_3 = 'example/path/3';
    const PATH_3_CONTENT = 'Path 3 Content.';

    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1:
              return Promise.resolve(new Buffer(PATH_1_CONTENT + '{{content-1}}' + '{{content-0}}'));
            case PATH_2:
              return Promise.resolve(new Buffer(PATH_2_CONTENT));
            case PATH_3:
              return Promise.resolve(new Buffer(PATH_3_CONTENT));
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render(PATH_1, {
      views: [
        {
          templatePath: PATH_2,
        },
        {
          templatePath: PATH_3,
        },
      ],
    })
    .then((templateDetails) => {
      templateDetails.content.should.equal(`${PATH_1_CONTENT}${PATH_3_CONTENT}${PATH_2_CONTENT}`);
    });
  });

  it('should be able to rendered nested {{content}}', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const PATH_1_CONTENT = 'Path 1 Content.';
    const PATH_2 = 'example/path/2';
    const PATH_2_CONTENT = 'Path 2 Content.';
    const PATH_3 = 'example/path/3';
    const PATH_3_CONTENT = 'Path 3 Content.';

    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1:
              return Promise.resolve(new Buffer(PATH_1_CONTENT + '{{content}}'));
            case PATH_2:
              return Promise.resolve(new Buffer(PATH_2_CONTENT + '{{content}}'));
            case PATH_3:
              return Promise.resolve(new Buffer(PATH_3_CONTENT));
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render(PATH_1, {
      views: [
        {
          templatePath: PATH_2,
          data: {
            views: [
              {
                templatePath: PATH_3,
              },
            ],
          },
        },
      ],
    })
    .then((templateDetails) => {
      templateDetails.content.should.equal(`${PATH_1_CONTENT}${PATH_2_CONTENT}${PATH_3_CONTENT}`);
    });
  });

  it('should be able to return styles and scripts for all sub views used', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const PATH_2 = 'example/path/2';
    const PATH_3 = 'example/path/3';

    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1: {
              let content = `---\nscripts:\n - /scripts/1/example.js\nstyles:\n - /styles/1/example.css\n---`;
              content += 'Hello 1.';
              return Promise.resolve(new Buffer(content + '{{content}}'));
            }
            case PATH_2: {
              let content = `---\nscripts:\n - /scripts/2/example.js\nstyles:\n - /styles/2/example.css\n---`;
              content += 'Hello 2.';
              return Promise.resolve(new Buffer(content + '{{content}}'));
            }
            case PATH_3: {
              let content = `---\nscripts:\n - /scripts/3/example.js\nstyles:\n - /styles/3/example.css\n---`;
              content += 'Hello 3.';
              return Promise.resolve(new Buffer(content));
            }
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render(PATH_1, {
      views: [
        {
          templatePath: PATH_2,
          data: {
            views: [
              {
                templatePath: PATH_3,
              },
            ],
          },
        },
      ],
    })
    .then((templateDetails) => {
      templateDetails.content.should.equal(`Hello 1.Hello 2.Hello 3.`);
      templateDetails.styles.should.deep.equal([
        '/styles/1/example.css',
        '/styles/2/example.css',
        '/styles/3/example.css',
      ]);
      templateDetails.scripts.should.deep.equal([
        '/scripts/1/example.js',
        '/scripts/2/example.js',
        '/scripts/3/example.js',
      ]);
    });
  });

  it('should dedupe styles and scripts', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const PATH_2 = 'example/path/2';
    const PATH_3 = 'example/path/3';

    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1: {
              let content = `---\nscripts:\n - /scripts/1/example.js\nstyles:\n - /styles/1/example.css\n---`;
              content += 'Hello 1.';
              return Promise.resolve(new Buffer(content + '{{content}}'));
            }
            case PATH_2: {
              let content = `---\nscripts:\n - /scripts/1/example.js\nstyles:\n - /styles/1/example.css\n---`;
              content += 'Hello 2.';
              return Promise.resolve(new Buffer(content + '{{content}}'));
            }
            case PATH_3: {
              let content = `---\nscripts:\n - /scripts/3/example.js\nstyles:\n - /styles/3/example.css\n---`;
              content += 'Hello 3.';
              return Promise.resolve(new Buffer(content));
            }
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render(PATH_1, {
      views: [
        {
          templatePath: PATH_2,
          data: {
            views: [
              {
                templatePath: PATH_3,
              },
            ],
          },
        },
      ],
    })
    .then((templateDetails) => {
      templateDetails.content.should.equal(`Hello 1.Hello 2.Hello 3.`);
      templateDetails.styles.should.deep.equal([
        '/styles/1/example.css',
        '/styles/3/example.css',
      ]);
      templateDetails.scripts.should.deep.equal([
        '/scripts/1/example.js',
        '/scripts/3/example.js',
      ]);
    });
  });

  it('should be able to return styles and scripts for only sub views used', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const PATH_2 = 'example/path/2';
    const PATH_3 = 'example/path/3';

    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1: {
              let content = `---\nscripts:\n - /scripts/1/example.js\nstyles:\n - /styles/1/example.css\n---`;
              content += 'Hello 1.';
              return Promise.resolve(new Buffer(content + '{{content}}'));
            }
            case PATH_2: {
              let content = `---\nscripts:\n - /scripts/2/example.js\nstyles:\n - /styles/2/example.css\n---`;
              content += 'Hello 2.';
              return Promise.resolve(new Buffer(content));
            }
            case PATH_3: {
              let content = `---\nscripts:\n - /scripts/3/example.js\nstyles:\n - /styles/3/example.css\n---`;
              content += 'Hello 3.';
              return Promise.resolve(new Buffer(content));
            }
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });

    return templateManager.render(PATH_1, {
      views: [
        {
          templatePath: PATH_2,
          data: {
            views: [
              {
                templatePath: PATH_3,
              },
            ],
          },
        },
      ],
    })
    .then((templateDetails) => {
      templateDetails.content.should.equal(`Hello 1.Hello 2.`);
      templateDetails.styles.should.deep.equal([
        '/styles/1/example.css',
        '/styles/2/example.css',
      ]);
      templateDetails.scripts.should.deep.equal([
        '/scripts/1/example.js',
        '/scripts/2/example.js',
      ]);
    });
  });

  it('should throw when rendering HTML without data', function() {
    const TemplateManager = require('../../src/controllers/TemplateManager');
    try {
      const templateManager = new TemplateManager({
        templatePath: '.',
      });
      templateManager.renderHTML();
      throw new Error('Injected Error');
    } catch (err) {
      if (err.message.indexOf(errorCodes['shell-required'].message) !== 0) {
        throw new Error('Unexpected error thrown: ' + err.message);
      }
    }
  });

  it('should throw when rendering HTML without a shell', function() {
    const TemplateManager = require('../../src/controllers/TemplateManager');
    try {
      const templateManager = new TemplateManager({
        templatePath: '.',
      });
      templateManager.renderHTML({});
      throw new Error('Injected Error');
    } catch (err) {
      if (err.message.indexOf(errorCodes['shell-required'].message) !== 0) {
        throw new Error('Unexpected error thrown: ' + err.message);
      }
    }
  });

  it('should render HTML with a shell', function() {
    const TEMPLATE_PATH = 'tmpl-path';
    const PATH_1 = 'example/path/1';
    const SHELL_1 = 'shells/example/2';
    const DOC_1 = 'documents/html.tmpl';

    const TemplateManager = proxyquire('../../src/controllers/TemplateManager', {
      'fs-promise': {
        readFile: (fullPath) => {
          const relPath = path.relative(TEMPLATE_PATH, fullPath);
          switch(relPath) {
            case PATH_1: {
              let content = `---\nscripts:\n - /scripts/1/example.js\nstyles:\n - /styles/1/example.css\n---`;
              content += 'Hello 1.';
              return Promise.resolve(new Buffer(content + '{{content}}'));
            }
            case SHELL_1: {
              let content = `---\nscripts:\n - /scripts/2/example.js\nstyles:\n - /styles/2/example.css\n---`;
              content += 'Hello Shell. {{{content}}}';
              return Promise.resolve(new Buffer(content));
            }
            case DOC_1: {
              let content = '<body>{{{content}}}</body>';
              return Promise.resolve(new Buffer(content));
            }
          }

          return Promise.reject(new Error('Unknown template path: ' + fullPath));
        },
      },
    });
    const templateManager = new TemplateManager({
      templatePath: TEMPLATE_PATH,
    });
    return templateManager.renderHTML({
      shell: SHELL_1,
      views: [
        {
          templatePath: PATH_1,
        },
      ],
    })
    .then((templateResult) => {
      templateResult.should.equal(`<body>Hello Shell. Hello 1.</body>`);
    });
  });
});

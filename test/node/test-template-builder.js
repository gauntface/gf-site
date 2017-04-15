global.self = global.self || {};
require('../../src/server/app/webroot/scripts/utils/template-builder');
const templateBuilder = global.self.GauntFace.TemplateBuilder;

describe('Template Builder', function() {
  it('should handle bad input', function() {
    const badInputs = [
      true,
      false,
      '',
      [],
    ];

    return badInputs.reduce((promiseChain, badInput) => {
      return promiseChain.then(() => {
        return templateBuilder.mergeTemplates(badInput);
      })
      .then(() => {
        throw new Error('Expected error to be thrown');
      }, (err) => {
        if (err.message !== `You must provide 'documentData', 'shellData' & 'contentData' into mergeTemplates().`) {
          throw new Error('Unexpected error: ' + err.message);
        }
      });
    }, Promise.resolve());
  });

  it('should handle bad parameters', function() {
    return templateBuilder.mergeTemplates({
      documentData: {}, shellData: {}, contentData: {},
    })
    .then(() => {
      throw new Error('Expected error to be thrown');
    }, (err) => {
      if (err.message !== `'documentData', 'shellData' & 'contentData' must have 'html' attributes.`) {
        throw new Error('Unexpected error: ' + err.message);
      }
    });
  });

  it('should require styles for the content', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head></head><body></body></html>',
      },
      shellData: {
        html: '<main></main>',
      },
      contentData: {
        html: '<h1>Content</h1>',
      },
    })
    .then(() => {
      throw new Error('Expected Error.');
    }, (err) => {
      if (err.message !== `'documentData', 'shellData' & 'contentData' must have 'styles' attributes with 'inline' and 'remote' attributes.`) {
        throw new Error('Unexpected error: ' + err.message);
      }
    });
  });

  it('should require styles.inline and styles.remote for the content', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head></head><body></body></html>',
        styles: {},
      },
      shellData: {
        html: '<main></main>',
        styles: {},
      },
      contentData: {
        html: '<h1>Content</h1>',
        styles: {},
      },
    })
    .then(() => {
      throw new Error('Expected Error.');
    }, (err) => {
      if (err.message !== `'documentData', 'shellData' & 'contentData' must have 'styles' attributes with 'inline' and 'remote' attributes.`) {
        throw new Error('Unexpected error: ' + err.message);
      }
    });
  });

  it('should require a title for the content', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head></head><body></body></html>',
        styles: {
          inline: [],
          remote: [],
        },
      },
      shellData: {
        html: '<main></main>',
        styles: {
          inline: [],
          remote: [],
        },
      },
      contentData: {
        html: '<h1>Content</h1>',
        styles: {
          inline: [],
          remote: [],
        },
      },
    })
    .then(() => {
      throw new Error('Expected Error.');
    }, (err) => {
      if (err.message !== `'contentData' must contain a 'metadata' parameter with a 'title' parameter.`) {
        throw new Error('Unexpected error: ' + err.message);
      }
    });
  });

  it('should be able to to merge html elements', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head></head><body></body></html>',
        styles: {
          inline: [],
          remote: [],
        },
      },
      shellData: {
        html: '<main></main>',
        styles: {
          inline: [],
          remote: [],
        },
      },
      contentData: {
        html: '<h1>Content</h1>',
        styles: {
          inline: [],
          remote: [],
        },
        metadata: {
          title: 'Content Title',
        },
      },
    })
    .then((mergedTemplate) => {
      if (mergedTemplate !== '<html><head></head><body><main><h1>Content</h1></main></body></html>') {
        throw new Error('Unexpected output from mergedTemplate: ' + mergedTemplate);
      }
    });
  });

  it('should be able to to merge html elements with styles', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head><meta name="theme-color" content="#fff"><title>This should be removed.</title></head><body><script>indow.GauntFace = window.GauntFace || {}; window.GauntFace._asyncStyles = [\'/styles/pre-1.css\',\'styles/pre-2.css\'];</script></body></html>',
        styles: {
          inline: [`body {color: '#111'}`],
          remote: [`/styles/document-remote.js`],
        },
      },
      shellData: {
        html: '<main></main>',
        styles: {
          inline: [`body {color: '#222'}`, `body {color: '#333'}`],
          remote: [`/styles/shell-remote-1.js`, `/styles/shell-remote-2.js`],
        },
      },
      contentData: {
        html: '<h1>Content</h1>',
        styles: {
          inline: [`body {color: '#444'}`],
          remote: [`/styles/content-remote.js`],
        },
        metadata: {
          title: 'Content Title',
        },
      },
    })
    .then((mergedTemplate) => {
      if (mergedTemplate !== `<html><head><style>body {color: '#111'}</style><style>body {color: '#222'}</style><style>body {color: '#333'}</style><style>body {color: '#444'}</style><meta name="theme-color" content=""><title>Content Title</title></head><body><main><h1>Content</h1></main><script>indow.GauntFace = window.GauntFace || {}; window.GauntFace._asyncStyles = ['/styles/pre-1.css','styles/pre-2.css','/styles/document-remote.js','/styles/shell-remote-1.js','/styles/shell-remote-2.js','/styles/content-remote.js'];</script></body></html>`) {
        throw new Error('Unexpected output from mergedTemplate: ' + mergedTemplate);
      }
    });
  });

  it('should be able to to merge html templates using document theme_color as default', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head><meta name="theme-color" content="#fff"><title>This should be removed.</title></head><body><script>indow.GauntFace = window.GauntFace || {}; window.GauntFace._asyncStyles = [\'/styles/pre-1.css\',\'styles/pre-2.css\'];</script></body></html>',
        styles: {
          inline: [`body {color: '#111'}`],
          remote: [`/styles/document-remote.js`],
        },
        metadata: {
          theme_color: '#111111',
        },
      },
      shellData: {
        html: '<main></main>',
        styles: {
          inline: [`body {color: '#222'}`, `body {color: '#333'}`],
          remote: [`/styles/shell-remote-1.js`, `/styles/shell-remote-2.js`],
        },
      },
      contentData: {
        html: '<h1>Content</h1>',
        styles: {
          inline: [`body {color: '#444'}`],
          remote: [`/styles/content-remote.js`],
        },
        metadata: {
          title: 'Content Title',
        },
      },
    })
    .then((mergedTemplate) => {
      if (mergedTemplate !== `<html><head><style>body {color: '#111'}</style><style>body {color: '#222'}</style><style>body {color: '#333'}</style><style>body {color: '#444'}</style><meta name="theme-color" content="#111111"><title>Content Title</title></head><body><main><h1>Content</h1></main><script>indow.GauntFace = window.GauntFace || {}; window.GauntFace._asyncStyles = ['/styles/pre-1.css','styles/pre-2.css','/styles/document-remote.js','/styles/shell-remote-1.js','/styles/shell-remote-2.js','/styles/content-remote.js'];</script></body></html>`) {
        throw new Error('Unexpected output from mergedTemplate: ' + mergedTemplate);
      }
    });
  });

  it('should be able to to merge html templates using content theme_color', function() {
    return templateBuilder.mergeTemplates({
      documentData: {
        html: '<html><head><meta name="theme-color" content="#fff"><title>This should be removed.</title></head><body><script>indow.GauntFace = window.GauntFace || {}; window.GauntFace._asyncStyles = [\'/styles/pre-1.css\',\'styles/pre-2.css\'];</script></body></html>',
        styles: {
          inline: [`body {color: '#111'}`],
          remote: [`/styles/document-remote.js`],
        },
        metadata: {
          theme_color: '#111111',
        },
      },
      shellData: {
        html: '<main></main>',
        styles: {
          inline: [`body {color: '#222'}`, `body {color: '#333'}`],
          remote: [`/styles/shell-remote-1.js`, `/styles/shell-remote-2.js`],
        },
      },
      contentData: {
        html: '<h1>Content</h1>',
        styles: {
          inline: [`body {color: '#444'}`],
          remote: [`/styles/content-remote.js`],
        },
        metadata: {
          title: 'Content Title',
          theme_color: '#222222',
        },
      },
    })
    .then((mergedTemplate) => {
      if (mergedTemplate !== `<html><head><style>body {color: '#111'}</style><style>body {color: '#222'}</style><style>body {color: '#333'}</style><style>body {color: '#444'}</style><meta name="theme-color" content="#222222"><title>Content Title</title></head><body><main><h1>Content</h1></main><script>indow.GauntFace = window.GauntFace || {}; window.GauntFace._asyncStyles = ['/styles/pre-1.css','styles/pre-2.css','/styles/document-remote.js','/styles/shell-remote-1.js','/styles/shell-remote-2.js','/styles/content-remote.js'];</script></body></html>`) {
        throw new Error('Unexpected output from mergedTemplate: ' + mergedTemplate);
      }
    });
  });
});

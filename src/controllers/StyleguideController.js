const glob = require('glob');
const path = require('path');

const highlightCode = require('../utils/highlight-code');
const parseMarkdown = require('../utils/parse-markdown');

const JS_CODE_SAMPLE = `const workboxSW = new WorkboxSW();
workboxSW.precache([
  {
    url: '/',
    revision: '613e6c7332dd83e848a8b00c403827ed'
  },
  {
    url: '/styles/main.css',
    revision: '59a325f32baad11bd47a8c515ec44ae5'
  }
]);

// Register runtime routes like so.
workboxSW.router.registerRoute(
  '/example/', workboxSW.staleWhileRevalidate());
workboxSW.router.registerRoute(
  /\/images\/(.*\/)?.*\.(png|jpg|jpeg|gif)/,
  workboxSW.strategies.cacheFirst());
workboxSW.router.registerRoute(
  '/styles/:filename', workboxSW.strategies.cacheFirst());

// For the Lolz
workboxSW.Matt.Is.Totes.The.Best.LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll0000000000000000000000000000ZZZZZZZZZZZZZZZLLLLLLLLLLLLLLLZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ();`;

const HTML_CODE_SAMPLE = `<html>
<body>
  <p class="example-selector">
    Hello World.
  </p>
</body>
</html>`;

class StyleguideController {
  index(args) {
    return {
      templatePath: 'templates/documents/html.tmpl',
      views: [
        {
          templatePath: 'templates/shells/styleguide.tmpl',
        },
      ],
      data: {
        title: 'GauntFace | Matthew Gaunt - Styleguide',
      },
    };
  }

  list(args) {
    const globIgnores = [
      'documents/json.tmpl',
      'documents/xml.tmpl',
      'views/sitemap.tmpl',
    ];

    return new Promise((resolve, reject) => {
      glob('**/*.tmpl', {
        cwd: path.join(__dirname, '..', 'templates'),
        ignore: globIgnores,
      }, (err, files) => {
        if (err) {
          return reject(err);
        }
        resolve(files);
      });
    })
    .then((templates) => {
      const listItems = templates.map((templateFile) => {
        return templateFile.replace('.tmpl', '');
      });

      if(args.type === 'json') {
        return {
          templatePath: 'templates/documents/json.tmpl',
          data: {
            json: JSON.stringify(listItems),
          },
        };
      }

      return {
        scripts: [
          '/scripts/utils/toggle-async-css.js',
        ],
        data: {
          title: 'GauntFace | Matthew Gaunt - Styleguide Views',
        },
        templatePath: 'templates/documents/html.tmpl',
        views: [
          {
            templatePath: 'templates/views/styleguide/list.tmpl',
            data: {
              listItems,
            },
          },
          {
            templatePath: `templates/views/grid-overlay.tmpl`,
          },
        ],
      };
    });
  }

  display(args) {
    const templatePath = args.urlSegments.join('/');
    const renderResult = {
      templatePath: 'templates/documents/html.tmpl',
      scripts: [
        '/scripts/utils/toggle-async-css.js',
      ],
      data: {
        title: `GauntFace | Matthew Gaunt - Styleguide '${templatePath}'`,
      },
    };

    let viewsPromise = Promise.resolve();
    const views = [];
    if (templatePath.indexOf('documents') === 0) {
      renderResult.templatePath = 'templates/'+templatePath+'.tmpl';
    } else if(templatePath.indexOf('views/styleguide/code') === 0) {
      viewsPromise = Promise.all([
        highlightCode(JS_CODE_SAMPLE),
        highlightCode(JS_CODE_SAMPLE, 'js'),
        highlightCode(HTML_CODE_SAMPLE, 'html'),
      ])
      .then((highlightedCodes) => {
        highlightedCodes.forEach((singleHighlight) => {
          if (singleHighlight.styles) {
            renderResult.styles = singleHighlight.styles;
          }
        });
        views.push({
          templatePath: `templates/${templatePath}.tmpl`,
          data: {
            'no-lang': highlightedCodes[0].html,
            'js-lang': highlightedCodes[1].html,
            'html-lang': highlightedCodes[2].html,
          },
        });
        views.push({
          templatePath: `templates/views/grid-overlay.tmpl`,
        });
      });
    } else if(templatePath.indexOf('views/styleguide/markdown') === 0) {
      viewsPromise = parseMarkdown(`
# Hello World
## Testing
Example

- Test 1
- Test 2


1. Test 3
1. Test 4


\`\`\`
console.log('No Lang');
\`\`\`

\`\`\`javascript
console.log('Javascript Lang');
\`\`\`

\`\`\`madeup
console.log('Madeup Lang');
\`\`\`

Let's try \`inner code block\` to see what happens.

> Block Quote Yay`
      )
      .then((parsedMarkdown) => {
        renderResult.styles = parsedMarkdown.styles;
        views.push({
          templatePath: 'templates/views/styleguide/markdown.tmpl',
          data: {
            markdown: parsedMarkdown.html,
          },
        });
        views.push({
          templatePath: `templates/views/grid-overlay.tmpl`,
        });
      });
    } else if(templatePath.indexOf('views/blog/post') === 0) {
      viewsPromise = parseMarkdown(`
I'm an example blog post.

\`\`\`javascript
console.log('hello world.');
\`\`\`

- Example One
- Example Two

What a nice bunch of lists.

1. Example One
1. Example Two

So many lists.
`)
      .then((parsedMarkdown) => {
        views.push({
        templatePath: `templates/${templatePath}.tmpl`,
        data: {
          blogPost: {
            title: 'Hello World.',
            bodyHTML: parsedMarkdown.html
          },
        }
      });
      views.push({
        templatePath: `templates/views/grid-overlay.tmpl`,
      });
      });
    } else {
      views.push({
        templatePath: `templates/${templatePath}.tmpl`,
      });
      views.push({
        templatePath: `templates/views/grid-overlay.tmpl`,
      });
    }

    return viewsPromise.then(() => {
      renderResult.views = views;
      return renderResult;
    });
  }
}

module.exports = new StyleguideController();

const glob = require('glob');
const path = require('path');

const highlightCode = require('../utils/highlight-code');

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
      .then((highlightedCode) => {
        views.push({
          templatePath: `templates/${templatePath}.tmpl`,
          data: {
            'no-lang': highlightedCode[0],
            'js-lang': highlightedCode[1],
            'html-lang': highlightedCode[2],
          },
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

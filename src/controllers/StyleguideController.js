const glob = require('glob');
const path = require('path');

class StyleguideController {
  index(args) {
    return {
      shell: 'shells/styleguide.tmpl',
      styles: [

      ],
      data: {
        title: 'GauntFace | Matthew Gaunt - Styleguide',
      },
      views: [],
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
          document: 'documents/json.tmpl',
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
        views: [
          {
            templatePath: 'views/styleguide/list.tmpl',
            data: {
              listItems,
            },
          },
          {
            templatePath: `views/grid-overlay.tmpl`,
          },
        ],
      };
    });
  }

  display(args) {
    const templatePath = args.urlSegments.join('/');
    const renderResult = {
      scripts: [
        '/scripts/utils/toggle-async-css.js',
      ],
      data: {
        title: `GauntFace | Matthew Gaunt - Styleguide '${templatePath}'`,
      },
    };

    const views = [];
    if (templatePath.indexOf('documents') === 0) {
      renderResult.document = templatePath+'.tmpl';
    } else {
      views.push({
        templatePath: `${templatePath}.tmpl`,
      });
      views.push({
        templatePath: `views/grid-overlay.tmpl`,
      });
    }
    renderResult.views = views;

    return renderResult;
  }
}

module.exports = new StyleguideController();

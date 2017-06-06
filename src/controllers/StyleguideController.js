const glob = require('glob');
const path = require('path');

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

    const views = [];
    if (templatePath.indexOf('documents') === 0) {
      renderResult.templatePath = 'templates/'+templatePath+'.tmpl';
    } else {
      views.push({
        templatePath: `templates/${templatePath}.tmpl`,
      });
      views.push({
        templatePath: `templates/views/grid-overlay.tmpl`,
      });
    }
    renderResult.views = views;

    return renderResult;
  }
}

module.exports = new StyleguideController();

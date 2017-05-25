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
    const listItems = [
      {
        name: 'HTML Elements',
        url: '/styleguide/display/html/',
      },
      {
        name: 'Button Styles',
        url: '/styleguide/display/button/',
      },
      {
        name: 'Code Styles',
        url: '/styleguide/display/code/',
      },
    ];

    if (args.type === 'json') {
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
  }

  display(args) {
    const displayName = args.urlSegments[0];
    return {
      scripts: [
        '/scripts/utils/toggle-async-css.js',
      ],
      data: {
        title: `GauntFace | Matthew Gaunt - Styleguide ${displayName}`,
      },
      views: [
        {
          templatePath: `views/styleguide/${displayName}.tmpl`,
        },
        {
          templatePath: `views/grid-overlay.tmpl`,
        },
      ],
    };
  }
}

module.exports = new StyleguideController();

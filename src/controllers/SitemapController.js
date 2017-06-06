class SitemapController {
  index(args) {
    const urls = [
      '/',
      '/styleguide',
    ];

    const protocol = 'http://';
    const host = args.request.get('host');
    const parsedUrls = urls.map((url) => {
      return `${protocol}${host}${url}`;
    });

    return {
      templatePath: 'templates/documents/xml.tmpl',
      views: [
        {
          templatePath: 'templates/shells/blank.tmpl',
          views: [{
            templatePath: 'templates/views/sitemap.tmpl',
            data: {
              urls: parsedUrls,
            },
          }],
        },
      ],
    };
  }
}

module.exports = new SitemapController();

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
      document: 'documents/xml.tmpl',
      shell: 'shells/blank.tmpl',
      views: [{
        templatePath: 'views/sitemap.tmpl',
        data: {
          urls: parsedUrls,
        },
      }],
    };
  }
}

module.exports = new SitemapController();

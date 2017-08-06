const blogModel = require('../models/blog-model');

class SitemapController {
  index(args) {
    const urls = [
      '/',
      '/styleguide',
      '/blog',
    ];

    console.log(args);

    return blogModel.getPublishedPosts()
    .then((posts) => {
      posts.forEach((post) => {
        urls.push(post.getPublishedUrl());
      });

      const parsedUrls = urls.map((url) => {
        return `${url}`;
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
    });
  }
}

module.exports = new SitemapController();

const blogModel = require('../models/blog-model');

class SitemapController {
  index(args) {
    console.log(`<--------------------`);
    const urls = [
      '/',
      '/styleguide',
      '/blog',
    ];

    return blogModel.getPublishedPosts()
    .then((posts) => {
      posts.forEach((post) => {
        urls.push(post.getPublishedUrl());
      });

      const parsedUrls = urls.map((url) => {
        /** if (process.env.BUILDTYPE === 'production') {
          return `https://gauntface.com${url}`;
        }**/

        return `http://localhost:${process.env.NGINX_PORT}${url}`;
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

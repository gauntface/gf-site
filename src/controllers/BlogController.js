const blogModel = require('../models/blog-model');
const parseMarkdown = require('../utils/parse-markdown');

class HomeController {
  index(args) {
    return blogModel.getPublishedPosts(20)
    .catch((err) => {
      console.error('BlogController.index(): Failed to get blog posts:', err);
      return [];
    })
    .then((blogPosts) => {
      return Promise.all(
        blogPosts.map((blogPost) => {
          return parseMarkdown(blogPost.excerptMarkdown)
          .then((parsedMarkdown) => {
            return {
              title: blogPost.title,
              excerptHTML: parsedMarkdown.html,
              publishedUrl: blogPost.getPublishedUrl(),
            };
          });
        })
      );
    })
    .then((blogPosts) => {
      return {
        data: {
          title: 'GauntFace | Matthew Gaunt - Blog',
        },
        templatePath: 'templates/documents/html.tmpl',
        views: [
          {
            templatePath: 'templates/shells/headerfooter.tmpl',
            views: [
              {
                templatePath: 'templates/views/blog/index.tmpl',
                data: {
                  blogPosts,
                },
              },
            ],
          },
        ],
      };
    });
  }

  viewByDateAndSlug(args) {
    const year = args.urlSegments[0];
    const month = args.urlSegments[1];
    const day = args.urlSegments[2];
    const slug = args.urlSegments[3];
    return blogModel.getPostFromDetails(
      year, month, day, slug, 'published'
    )
    .then((blogPost) => {
      if (!blogPost) {
        return {
          content: 'TODO: Show 404 Page',
        };
      }
      return parseMarkdown(blogPost.bodyMarkdown)
      .then((parsedMarkdown) => {
        return {
          title: blogPost.title,
          bodyHTML: parsedMarkdown.html,
        };
      });
    })
    .then((blogPost) => {
      return {
        data: {
          title: `blogModel.title - GauntFace | Matthew Gaunt`,
        },
        templatePath: 'templates/documents/html.tmpl',
        views: [{
            templatePath: 'templates/shells/headerfooter.tmpl',
            views: [
              {
                templatePath: 'templates/views/blog/post.tmpl',
                data: {
                  blogPost,
                },
              },
            ],
          },
        ],
      };
    });
  }
}

module.exports = new HomeController();

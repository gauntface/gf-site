const path = require('path');

const blogModel = require('../models/blog-model');
const parseMarkdown = require('../utils/parse-markdown');
const srcSetGen = require('../utils/src-set-gen');

class BlogController {
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
            templatePath: 'templates/shells/header-footer.tmpl',
            views: [
              {
                templatePath: 'templates/views/blog/index.tmpl',
                data: {
                  blogPosts,
                  noBlogImage: srcSetGen(
                    'images/error-paw-chow.png',
                    'No blogs posts are available, but this is a cute cartoon.'
                  ),
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

    let styles = {
      raw: [],
      inline: [],
    };

    return blogModel.getPostFromDetails(
      year, month, day, slug, 'published'
    )
    .then((blogPost) => {
      if (!blogPost) {
        return {
          content: 'TODO: Show 404 Page',
        };
      }
      const promises = [
        parseMarkdown(blogPost.bodyMarkdown),
      ];
      if (blogPost.mainImage) {
        promises.push(
          srcSetGen(
            blogPost.mainImage,
            `Key Art for &#34;${blogPost.title}&#34; by Matthew Gaunt`
          ),
        );
      } else {
        promises.push(null);
      }
      return Promise.all(promises)
      .then((results) => {
        const parsedMarkdown = results[0];
        const srcSetImage = results[1];
        styles.inline = styles.inline.concat(parsedMarkdown.styles.inline);
        return {
          title: blogPost.title,
          bodyHTML: parsedMarkdown.html,
          mainImage: blogPost.mainImage,
          srcSetImage,
        };
      });
    })
    .then((blogPost) => {
      return {
        styles,
        data: {
          title: `${blogPost.title} - GauntFace | Matthew Gaunt`,
        },
        templatePath: 'templates/documents/html.tmpl',
        views: [
          {
            templatePath: 'templates/views/header.tmpl',
          },
          {
            templatePath: 'templates/shells/content.tmpl',
            views: [
              {
                templatePath: 'templates/views/blog/post.tmpl',
                data: {
                  srcSetImg: blogPost.srcSetImage,
                  blogPost,
                },
              },
            ],
          },
          {
            templatePath: 'templates/views/author.tmpl',
          },
          {
            templatePath: 'templates/views/footer.tmpl',
          },
        ],
      };
    });
  }
}

module.exports = new BlogController();

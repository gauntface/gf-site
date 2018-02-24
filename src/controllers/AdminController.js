const adminUsers = require('../models/admin-users');
const draftsPostModel = require('../models/draft-posts-model');
const parseMarkdown = require('../utils/parse-markdown');
const srcSetGen = require('../utils/src-set-gen');

const ID_COOKIE_NAME = 'gf-id';

const signInCheck = async (args) => {
  const userId = args.request.cookies[ID_COOKIE_NAME];

  const isSignedIn = await adminUsers.isUserSignedIn(userId);
  if (!isSignedIn) {
    args.response.redirect(
      302,
      `/admin/signin/?gf-redirect=${encodeURI(args.request.originalUrl)}`,
    );
  }

  return isSignedIn;
};

class AdminController {
  async index(args) {
    if (!await signInCheck(args)) {
      return;
    }

    const rawDraftPosts = await draftsPostModel.getPosts({
      order: `lastUpdate DESC`,
      count: 20,
    });

    const draftPosts = await Promise.all(
      rawDraftPosts.map((blogPost) => {
        return parseMarkdown(blogPost.excerptMarkdown)
        .then((parsedMarkdown) => {
          return {
            id: blogPost.id,
            title: blogPost.title ? blogPost.title : 'Untitled Post',
            excerptHTML: parsedMarkdown ? parsedMarkdown.html : '',
            publishedUrl: blogPost.getPublishedUrl(),
          };
        });
      })
    );

    return {
      data: {
        title: 'GauntFace | Matthew Gaunt - Blog',
      },
      templatePath: 'templates/documents/html.tmpl',
      views: [
        {
          templatePath: 'templates/views/admin/index.tmpl',
          data: {
            draftPosts,
          },
        },
      ],
    };
  }

  signin(args) {
    return {
      data: {
        title: 'GauntFace | Matthew Gaunt - Blog',
      },
      templatePath: 'templates/documents/html.tmpl',
      views: [
        {
          templatePath: 'templates/views/admin/signin.tmpl',
        },
      ],
    };
  }

  async oauth(args) {
    if (!args.request.query.code) {
      throw new Error('No code parameter.');
    }

    const code = args.request.query.code;
    const userId = await adminUsers.addNewUser(code);

    args.response.cookie(ID_COOKIE_NAME, userId, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    if (args.request.query['gf-redirect']) {
      return args.response.redirect(302, args.request.query['gf-redirect']);
    }

    return args.response.redirect(302, '/admin/');
  }

  async edit(args) {
    if (!await signInCheck(args)) {
      return;
    }

    let postId = null;
    if (args.urlSegments && Array.isArray(args.urlSegments)) {
      if (args.urlSegments.length > 1) {
        throw new Error('Not Found.');
      }
      postId = parseInt(args.urlSegments[0], 10);
    }

    let blogPostJSON = '{}';
    if (postId !== null) {
      const whereClauses = [
        'id = ?',
      ];
      const whereArgs = [
        postId,
      ];

      const rawBlogPosts = await draftsPostModel.getPosts({
        where: {
          clauses: whereClauses,
          args: whereArgs,
        },
      });

      if (rawBlogPosts.length > 1) {
        throw new Error(`Found multiple blog posts.`);
      }

      if (rawBlogPosts.length !== 1) {
        throw new Error(`Blog post not found.`);
      }

      const blogPost = rawBlogPosts[0];
      blogPostJSON = JSON.stringify({
        id: blogPost.id,
        title: blogPost.title,
        excerptMarkdown: blogPost.excerptMarkdown,
        mainImg: blogPost.mainImage,
        mainImageBgColor: blogPost.mainImageBgColor,
        bodyMarkdown: blogPost.bodyMarkdown,
        lastUpdate: blogPost.lastUpdate,
      });
    }


    return {
      templatePath: 'templates/documents/html.tmpl',
      data: {
        title: 'Edit GauntFace Blog',
      },
      views: [
        {
          templatePath: 'templates/views/admin/blog-editor.tmpl',
          data: {
            blogPostJSON,
          },
        },
      ],
    };
  }

  async preview(args) {
    if (!await signInCheck(args)) {
      return;
    }

    const id = parseInt(args.urlSegments[0], 10);

    let styles = {
      raw: [],
      inline: [],
    };

    const rawBlogPost = await draftsPostModel.getPostFromId(id);
    if (!rawBlogPost) {
      return {
        content: 'TODO: Show 404 Page',
      };
    }

    const promises = [
      parseMarkdown(rawBlogPost.bodyMarkdown),
    ];
    if (rawBlogPost.mainImage) {
      promises.push(
        srcSetGen(
          rawBlogPost.mainImage,
          `Key Art for &#34;${rawBlogPost.title}&#34; by Matthew Gaunt`
        ),
      );
    } else {
      promises.push(null);
    }

    const results = await Promise.all(promises);
    const parsedMarkdown = results[0];
    const srcSetImage = results[1];
    styles.inline = styles.inline.concat(parsedMarkdown.styles.inline);
    const blogPost = {
      title: rawBlogPost.title,
      bodyHTML: parsedMarkdown.html,
      mainImage: rawBlogPost.mainImage,
      srcSetImage,
    };

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
  }

  async save(args) {
    const body = args.request.body;
    if (!body) {
      args.response.status(400).json({
        error: {
          code: 'no-body',
          message: 'No body.',
        },
      });
      return;
    }

    if (!body.title) {
      args.response.status(400).json({
        error: {
          code: 'no-title',
          message: 'No title.',
        },
      });
      return;
    }

    let newId = body.id;
    if (body.id) {
      draftsPostModel.updatePost(body);
      args.response.status(200).json({
        data: {
          id: body.id,
        },
      });
    } else {
      const result = await draftsPostModel.addPost(body);
      newId = result.insertId;
    }

    args.response.status(200).json({
      data: {
        id: newId,
      },
    });
  }
}

module.exports = new AdminController();

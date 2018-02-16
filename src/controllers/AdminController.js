const adminUsers = require('../models/admin-users');

const ID_COOKIE_NAME = 'gf-id';

const signInCheck = (args) => {
  const userId = args.request.cookies[ID_COOKIE_NAME];
  if (!adminUsers.isUserSignedIn(userId)) {
    return args.response.redirect(
      302,
      `/admin/signin/?gf-redirect=${encodeURI(args.request.originalUrl)}`,
    );
  }
}

class AdminController {
  index(args) {
    signInCheck(args);

    return {
      data: {
        title: 'GauntFace | Matthew Gaunt - Blog',
      },
      templatePath: 'templates/documents/html.tmpl',
      views: [
        {
          templatePath: 'templates/views/admin/index.tmpl',
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

  edit(args) {
    signInCheck(args);

    let postId = null;
    if (args.urlSegments) {
      if (args.urlSegments.length > 1) {
        throw new Error('Not Found.');
      }
      postId = parseInt(args.urlSegments[0], 10);
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
            blogPostJSON: JSON.stringify({
              postId,
              title: 'Example Title',
              excerpt: 'Example Excerpt',
              mainImg: '/uploads/images/example.png',
              mainImgBGColor: '#ff0000',
              markdown: '# Example Markdown',
            }),
          },
        },
      ],
    };
  }
}

module.exports = new AdminController();

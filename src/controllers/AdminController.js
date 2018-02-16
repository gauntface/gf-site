const adminUsers = require('../models/admin-users');

const isLoggedIn = () => {
  return false;
}

const assertSignedIn = (request) => {
  if (isLoggedIn() || request.url === '/admin/signin') {
    return;
  }

  if (request.method === 'post') {
    throw new Error(`API should return a 403 error.`);
  } else {
    request.res.redirect(`/admin/signin`);
  }
};

class AdminController {
  index(args) {
    assertSignedIn(args.request);

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
    console.log(`Cookie Time: ${userId}`);
    console.log(Object.keys(args));

    args.response.cookie('gf-id', userId, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      data: {
        title: 'GauntFace | Matthew Gaunt - Blog',
      },
      templatePath: 'templates/documents/html.tmpl',
      views: [
        {
          templatePath: 'templates/views/admin/oauth.tmpl',
        },
      ],
    };
  }

  edit(postID) {
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
              postId: 999,
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

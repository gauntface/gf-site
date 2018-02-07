
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

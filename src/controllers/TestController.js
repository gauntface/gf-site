class TestController {
  index(args) {
    return {
      title: 'GauntFace | Matthew Gaunt',
      theme_color: '#1e1621',
      shell: 'shells/headerfooter.tmpl',
      views: [
        {
          templatePath: 'views/title-block.tmpl',
          data: {
            topText: 'TODO: Date',
            title: 'Testing Custom Routes',
            excerpt: 'TODO: Blog Excerpt',
          },
        },
      ],
    };
  }
}

module.exports = new TestController();

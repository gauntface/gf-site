class HomeController {
  index(args) {
    return {
      title: 'GauntFace | Matthew Gaunt',
      theme_color: '#1e1621',
      shell: 'shells/headerfooter.tmpl',
      views: [
        {
          templatePath: 'views/home-header.tmpl',
        }, {
          templatePath: 'views/title-block.tmpl',
          data: {
            topText: 'TODO: Date',
            title: 'TODO: Blog Post.',
            excerpt: 'TODO: Blog Excerpt',
          },
        }, {
          templatePath: 'views/split-section.tmpl',
          data: {
            views: [{
              templatePath: 'views/youtube-block.tmpl',
              data: {
                url: 'TODO: Replace',
                title: 'TODO: Replace',
              },
            }, {
              templatePath: 'views/twitter-block.tmpl',
              data: {
                username: '@gauntface',
                userURL: 'https://twitter.com/gauntface',
                tweetDate: 'TODO: Replace',
                tweet: 'TODO: Replace',
              },
            }],
          },
        }, {
          templatePath: 'views/title-block.tmpl',
          data: {
            smallTopText: 'News',
            title: 'Smashing Book 5',
            excerpt: 'I’ve written a chapter in this book about service worker and it’s available now! <a href="http://www.smashingmagazine.com/2015/03/real-life-responsive-web-design-smashing-book-5/">Get the print or ebook HERE</a>',
          },
        },
      ],
    };
  }
}

module.exports = new HomeController();

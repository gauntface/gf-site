const blogModel = require('../models/blog-model');

class HomeController {
  index(args) {
    /** return Promise.all([
      youtubeModel.getLatestTTTEpisode(),
      twitterModel.getLatestTweet(),
    ])
    .then((results) => {
      const tttEpisode = results[0];
      const tweet = results[1];

      const tweetTime = tweet.time ? moment(tweet.time) : null;

      return {
        shell: 'shells/headerfooter.tmpl',
        styles: [
          '/styles/unique/smashing-mag-book.css',
        ],
        data: {
          title: 'GauntFace | Matthew Gaunt',
          theme_color: '#1e1621',
        },
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
                  url: tttEpisode.url,
                  title: tttEpisode.title,
                },
              }, {
                templatePath: 'views/twitter-block.tmpl',
                data: {
                  username: '@gauntface',
                  userURL: 'https://twitter.com/gauntface',
                  tweetDate: tweetTime ? tweetTime.format('YYYY-MM-DD') : '',
                  tweetDateText: tweetTime ? tweetTime.format('MMM D') : '',
                  tweet: tweet.message,
                },
              }],
            },
          }, {
            templatePath: 'views/title-block.tmpl',
            data: {
              smallTopText: 'News',
              title: 'Smashing Book 5',
              className: 'smashing-book-5',
              excerpt: 'I’ve written a chapter in this book about service worker and it’s available now! <a href="http://www.smashingmagazine.com/2015/03/real-life-responsive-web-design-smashing-book-5/">Get the print or ebook HERE</a>',
            },
          },
        ],
      };
    });**/

    return blogModel.getPublishedPosts(3)
    .catch((err) => {
      console.error('HomeController.index(): Failed to get blog posts:', err);
      return [];
    })
    .then((blogPosts) => {
      return {
        data: {
          title: 'GauntFace | Matthew Gaunt',
        },
        templatePath: 'templates/documents/html.tmpl',
        views: [
          {
            templatePath: 'templates/shells/headerfooter.tmpl',
            views: [
              {
                templatePath: 'templates/views/home.tmpl',
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
}

module.exports = new HomeController();

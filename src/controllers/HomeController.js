const moment = require('moment');

const youtubeModel = require('../models/youtube-model');
const twitterModel = require('../models/twitter-model');

class HomeController {
  index(args) {
    return Promise.all([
      youtubeModel.getLatestTTTEpisode(),
      twitterModel.getLatestTweet(),
    ])
    .then((results) => {
      const tttEpisode = results[0];
      const tweet = results[1];

      const tweetTime = tweet.time ? moment(tweet.time) : null;

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
              excerpt: 'I’ve written a chapter in this book about service worker and it’s available now! <a href="http://www.smashingmagazine.com/2015/03/real-life-responsive-web-design-smashing-book-5/">Get the print or ebook HERE</a>',
            },
          },
        ],
      };
    });
  }
}

module.exports = new HomeController();

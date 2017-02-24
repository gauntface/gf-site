const Hopin = require('hopin');

const hop = new Hopin({
  relativePath: __dirname,
});
hop.startServer(3000);
/**
const express = require('express');
const mustache = require('mustache');
const fs = require('fs-promise');

const app = express();

// Boot Up - Load all Views and watch for new ones
// Add express route for all routes -> Router.
// Router -> Controllers
// Express Response <-> Router <-> Controllers <-> Views

app.get('/', function (req, res) {
  let latestTweet;
  let latestTTTEpisode;
  if(!latestTweet) {
    latestTweet = {
      message:'Oops looks like there was a problem talking with ' +
        'Twitter.',
      time: null,
    };
  }

    if(!latestTTTEpisode) {
      latestTTTEpisode = {
        title: 'Selenium',
        url: 'https://www.youtube.com/watch?v=M6VcneC2pI0&list=PLNYkxOF6rcIB3ci6nwNyLYNU6RDOU3YyL'
      };
    }

    const viewData = {
      title: 'GauntFace | Matthew Gaunt',
      theme_color: '#1E1621',
      shell: 'headerfooter',
      test: [
        () => {
          return 'Function Lolz';
        },
        () => {
          return 'Double Function Lolz';
        }
      ],
      elements: [
        {
          id: 'home-header',
        }, {
          id: 'title-block',
          data: {
            smallTopText: 'TODO: Date',
            title: 'TODO: Blog Post',
            excerpt: 'TODO: Blog Excerpt',
          },
        }, {
          id: 'split-section',
          data: {
            left: {
              id: 'youtube-block',
              data: {
                episodeURL: latestTTTEpisode.url,
                episodeTitle: latestTTTEpisode.title
              }
            },
            right: {
              id: 'twitter-block',
              data: {
                username: '@gauntface',
                userURL: 'https://twitter.com/gauntface',
                tweetDate: latestTweet.time,
                tweet: latestTweet.message
              }
            },
          },
        }, {
          id: 'title-block',
          data: {
            smallTopText: 'News',
            title: 'Smashing Book 5',
            excerpt: 'I’ve written a chapter in this book about ' +
              'service worker and it’s available now! ' +
              '<a href="http://www.smashingmagazine.com/2015/03/real-life-responsive-web-design-smashing-book-5/">' +
              'Get the print or ebook HERE</a>'
          }
        }
      ]
    };

    // $renderData = array('data' => $viewData);
    // if (array_key_exists('type', $this->request->params) &&
      $this->request->params['type'] === 'json') {
    //   $renderData['layout'] = 'template-view';
    // }

  fs.readFile(path.join(__dirname, 'views', 'home.tmpl'))
  .then((templateBuffer) => {
    const templateString = templateBuffer.toString();
    res.send(mustache.render(templateString, viewData));
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
**/

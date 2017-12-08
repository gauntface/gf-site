const Twitter = require('twitter');

const logHelper = require('../utils/log-helper');
const CacheableInterface = require('./cacheable-interface');

const LATEST_TWEET_CACHE_KEY = 'latest-tweet';

class TwitterModel extends CacheableInterface {
  constructor() {
    super();

    // TODO: Fix this to work correctly.
    // process.env.TWITTER_CONSUMER_KEY = '';
    // process.env.TWITTER_CONSUMER_SECRET = '';
    // process.env.TWITTER_ACCESS_TOKEN = '';
    // process.env.TWITTER_ACCESS_SECRET = '';

    this._twitterClient = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_SECRET,
    });

    this._updateLatestTweetFromNetwork =
      this._updateLatestTweetFromNetwork.bind(this);
  }

  get cacheExpiry() {
    return 2 * 60 * 60;
  }

  get fallbackTweet() {
    return {
      message: 'Oops looks like there was a problem talking with ' +
        'Twitter.',
      time: null,
    };
  }

  getLatestTweet() {
    // Check for latest video from cache
    return this.getFromCacheAndUpdate({
      key: LATEST_TWEET_CACHE_KEY,
      expiryTimeSeconds: this.cacheExpiry,
      updateMethod: this._updateLatestTweetFromNetwork,
    })
    .catch((err) => {
      logHelper.warn('Error occured when retrieving latest Tweet ' +
        `from cache. Error Message: "${err.message}"`);
    })
    .then((result) => {
      if (!result) {
        result = this.fallbackTweet;
      }

      return result;
    });
  }

  _updateLatestTweetFromNetwork() {
    const queryParams = {
      q: 'screen_name=gauntface&count=1',
    };
    return this._twitterClient.get('statuses/user_timeline', queryParams)
    .then((result) => {
      return {
        message: result[0].text,
        time: new Date(result[0].created_at),
      };
    });
  }
}

module.exports = new TwitterModel();

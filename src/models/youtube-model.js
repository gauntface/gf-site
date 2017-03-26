const googleapis = require('googleapis');

const logHelper = require('../utils/log-helper');
const CacheableInterface = require('./cacheable-interface');

const LATEST_TTT_CACHE_KEY = 'latest-ttt-episode';

const TTT_TITLE_REGEX = /((?:,|in|:)?\s*Totally\s*Tooling\s*Tips.*)/;
const TTT_PLAYLIST_ID = 'PLNYkxOF6rcIB3ci6nwNyLYNU6RDOU3YyL';

class YoutubeDetails extends CacheableInterface {
  constructor() {
    super();

    // TODO: Fix the environment variables.
    // process.env.YOUTUBE_API_KEY = '';

    this._youtubeClient = googleapis.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY,
    });

    this._updateLatestTTTFromNetwork =
      this._updateLatestTTTFromNetwork.bind(this);
  }

  get cacheExpiry() {
    return 24 * 60 * 60;
  }

  get fallbackTTTEpisode() {
    return {
      url: `https://www.youtube.com/watch?` +
        `list=${TTT_PLAYLIST_ID}`,
      title: 'Watch all of Totally Tooling Tips.',
    };
  }

  getLatestTTTEpisode() {
    // Check for latest video from cache
    return this.getFromCacheAndUpdate({
      key: LATEST_TTT_CACHE_KEY,
      expiryTimeSeconds: this.cacheExpiry,
      updateMethod: this._updateLatestTTTFromNetwork,
    })
    .catch((err) => {
      logHelper.warn('Error occured when retrieving latest TTT video ' +
        `from cache. Error Message: "${err.message}"`);
    })
    .then((result) => {
      if (!result) {
        result = this.fallbackTTTEpisode;
      }

      return result;
    });
  }

  _updateLatestTTTFromNetwork() {
    return new Promise((resolve, reject) => {
      this._youtubeClient.playlistItems.list({
          part: 'id,snippet',
          playlistId: TTT_PLAYLIST_ID,
          maxResults: 3,
        }, (err, data, response) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(data, response);
        });
    })
    .then((data, response) => {
      let videoInfo = null;
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        const origTitle = item.snippet.title;
        if (origTitle.toLowerCase().indexOf('trailer') !== -1) {
          continue;
        }

        const result = TTT_TITLE_REGEX.exec(origTitle);
        if (!result) {
          continue;
        }

        const reducedTitle = origTitle.replace(result[1], '');
        const videoSnippet = item.snippet;
        const videoId = videoSnippet.resourceId.videoId;
        videoInfo = {
          title: reducedTitle,
          url: `https://www.youtube.com/watch?v=${videoId}` +
            `&list=${TTT_PLAYLIST_ID}`,
        };
        break;
      }

      return videoInfo;
    });
  }
}

module.exports = new YoutubeDetails();

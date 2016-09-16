<?php

require_once APPPATH.'models/components/BaseComponent.php';
require_once APPPATH.'third_party/twitteroauth-0.6.4/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

class TwitterComponent extends BaseComponent {

  private static $LATEST_TWEET_CACHE_KEY = 'TwitterComponent/LatestTweet';

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/twitter-block');

    $this->addInlineStylesheet('/styles/components/twitter-block/twitter-block-inline.css');
    $this->load->driver('cache', array('adapter' => 'apc'));
  }

  function getLatestTweet() {
    if ($storedTweet = $this->cache->get(self::$LATEST_TWEET_CACHE_KEY)) {
      return $storedTweet;
    }

    $latestTweet = $this->getTweetFromTwitter();

    if ($latestTweet) {
      // Save for 30 minutes
      $this->cache->save(self::$LATEST_TWEET_CACHE_KEY, $latestTweet, 1800);
    }

    return $latestTweet;
  }

  private function getTweetFromTwitter() {
    $this->config->load('confidential', TRUE);

    try {
      $connection = new TwitterOAuth(
        $this->config->item('twitter_consumer_key', 'confidential'),
        $this->config->item('twitter_consumer_secret', 'confidential'),
        $this->config->item('twitter_access_token', 'confidential'),
        $this->config->item('twitter_access_secret', 'confidential')
      );
      $statuses = $connection->get("statuses/user_timeline", array("q" => "screen_name=gauntface&count=1"));
      if(count($statuses) > 0) {
        $tweet['text'] = $statuses[0]->text;
        $tweet['time'] = strtotime($statuses[0]->created_at);
        return $tweet;
      }
    } catch(Exception $e) {
      // Unable to get tweet
    }
    return null;
  }
}

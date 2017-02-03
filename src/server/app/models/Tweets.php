<?php

namespace app\models;

use lithium\analysis\Logger;
use lithium\storage\Cache;

use Abraham\TwitterOAuth\TwitterOAuth;

class Tweets extends \lithium\data\Model {

  protected $_meta = [
		'connection' => false
	];

  public static function getLatestTweet() {
    $tweetInfo = Cache::read('default', 'latest_tweet');
    if ($tweetInfo) {
      return $tweetInfo;
    }

    try {
      $connection = new TwitterOAuth(
        getenv('TWITTER_CONSUMER_KEY'),
        getenv('TWITTER_CONSUMER_SECRET'),
        getenv('TWITTER_ACCESS_TOKEN'),
        getenv('TWITTER_ACCESS_SECRET')
      );

      $statuses = $connection->get("statuses/user_timeline", array("q" => "screen_name=gauntface&count=1"));
      if (isset($statuses->errors)) {
        Logger::warning('Issue with retrieving latest tweet.');
        Logger::warning('    '.$statuses->errors[0]->code);
        Logger::warning('    '.$statuses->errors[0]->message);
        return null;
      }

      if(count($statuses) > 0) {
        $tweetInfo = array(
          'text' => $statuses[0]->text,
          'time' => strtotime($statuses[0]->created_at)
        );

        // Cache the latest tweek for 1 hours.
        $written = Cache::write('default', 'latest_tweet', $tweetInfo, 60 * 60);
        if (!$written) {
          Logger::debug("Latets tweet cache failed.");
        }
      }
    } catch(Exception $e) {
      // Unable to get tweet
      Logger::error("Unable to retrieve latest tweet: ". $e->getMessage());
    }

    return $tweetInfo;
  }
}

?>

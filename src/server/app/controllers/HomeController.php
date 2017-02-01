<?php

namespace app\controllers;

use Abraham\TwitterOAuth\TwitterOAuth;
use lithium\net\http\Media;
use lithium\analysis\Logger;
use Exception;

class HomeController extends \lithium\action\Controller {

  public function index() {
    $latestTweet = $this->getTweetFromTwitter();

    if(isset($latestTweet)) {
      $twitterMessage = $latestTweet['text'];
      $twitterTime = $latestTweet['time'];
    } else {
      $twitterMessage = 'Oops looks like there was a problem talking with '.
        'Twitter.';
      $twitterTime = null;
    }
    return array(
      'title' => 'GauntFace | Matthew Gaunt',
      'theme_color' => '#1e1621',
      'elements' => array(
        array(
          'id' => 'home-header'
        ),
        array(
          'id' => 'title-block',
          'data' => array(
            'smallTopText' => 'TODO: Date',
            'title' => 'TODO: Blog Post.',
            'excerpt' => 'TODO: Blog Excerpt'
          )
        ),
        array(
          'id' => 'split-section',
          'data' => array(
            'left' => array(
              'id' => 'youtube-block',
              'data' => array(
                'episodeURL' => 'https://www.youtube.com/watch?v=M6VcneC2pI0&index=2&list=PLNYkxOF6rcIB3ci6nwNyLYNU6RDOU3YyL',
                'episodeTitle' => 'Selenium',
                'playlistURL' => 'https://www.youtube.com/watch?v=QH94CXVv3UE&list=PLNYkxOF6rcIB3ci6nwNyLYNU6RDOU3YyL'
              )
            ),
            'right' => array(
              'id' => 'twitter-block',
              'data' => array(
                'username' => '@gauntface',
                'userURL' => 'https://twitter.com/gauntface',
                'tweetDate' => $twitterTime,
                'tweet' => $twitterMessage
              )
            )
          )
        ),
        array(
          'id' => 'title-block',
          'data' => array(
            'smallTopText' => 'News',
            'title' => 'Smashing Book 5',
            'excerpt' => 'I’ve written a chapter in this book about service worker and it’s available now! <a href="http://www.smashingmagazine.com/2015/03/real-life-responsive-web-design-smashing-book-5/">Get the print or ebook HERE</a>'
          )
        ),
        array(
          'id' => 'footer'
        )
      )
    );
	}

  private function getTweetFromTwitter() {
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
        return array(
          'text' => $statuses[0]->text,
          'time' => strtotime($statuses[0]->created_at)
        );
      }
    } catch(Exception $e) {
      // Unable to get tweet
    }
    return null;
  }
}

?>

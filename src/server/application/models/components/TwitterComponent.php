<?php

require_once APPPATH.'models/components/BaseComponent.php';
/** require_once APPPATH.'third_party/twitteroauth-0.5.3/autoload.php'; **/
// use Abraham\TwitterOAuth\TwitterOAuth;

class TwitterComponent extends BaseComponent {

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/twitter-block');

    // $data['tweetTitleModel'] = $this->getLatestTweet();
    // $this->load->model('TwitterKeys');

    $this->addInlineStylesheet('/styles/components/twitter-block/twitter-block-inline.css');
  }

  /** private function getLatestTweet() {
    try {
      $twitterKeys = new TwitterKeys();
      $connection = new TwitterOAuth($twitterKeys->consumerKey, $twitterKeys->consumerSecret, $twitterKeys->accessToken, $twitterKeys->accessSecret);
      $statuses = $connection->get("statuses/user_timeline", array("q" => "screen_name=gauntface&count=1"));
      if(count($statuses) <= 0) {
        return;
      }

      $tweetModel = new TitleModel();
      $tweetModel->setDescription($statuses[0]->text);
      $tweetModel->setTime(strtotime($statuses[0]->created_at));

      return $tweetModel;
    } catch(Exception $e) {
      // Unable to get tweet
    }
    return null;
  } **/
}

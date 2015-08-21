<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';
require_once APPPATH.'third_party/twitteroauth-0.5.3/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;

class Home extends Base_Controller {

  public function index()
  {
    if(isset($_SERVER['CI_ENV'])) {
      log_message('error', "_SERVER['CI_ENV'] = " . $_SERVER['CI_ENV']);
    }
    log_message('error', "ENVIRONMENT = " . ENVIRONMENT);

    $this->load->model('PageModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');
    $this->load->model('blog/PostsModel');
    $this->load->model('TwitterKeys');

    $pageData = new PageModel();
    $pageData->setTitle('Welcome');
    $pageData->setRemoteStylesheets(['styles/index-remote.css']);
    $pageData->setInlineStylesheets(['styles/index-inline.css']);

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('home');

    $postsModel = new PostsModel();
    $posts = $postsModel->getPublishedPosts($startIndex = 0, 1);

    if(count($posts) > 0) {
      $firstPostTitleModel = new TitleModel();
      $firstPostTitleModel->makePadded(true);
      $firstPostTitleModel->setTitle($posts[0]->getTitle());
      $firstPostTitleModel->setDescription($posts[0]->getExcerptHTML());
      $firstPostTitleModel->setSmallBackgroundImage($posts[0]->getGreyScaleImg());
      $firstPostTitleModel->setTime($posts[0]->getPublishTime());
      $firstPostTitleModel->setLinkURL('/blog/view/'.$posts[0]->getId());
    }

    $bottomTitleModel = new TitleModel();
    $bottomTitleModel->setTitle('Smashing Book 5');
    $bottomTitleModel->setDescription('<p>I’ve written a chapter in this book about service worker and it’s available now!</p><p><a href="#">Get the print or ebook HERE</a></p>');
    $bottomTitleModel->setSmallTopText('News');
    $bottomTitleModel->setSmallBackgroundImage('/images/pages/home/smashing-mag.png');
    $bottomTitleModel->makePadded(true);

    $data['page'] = $pageData;
    $data['appbar'] = $appBarData;
    $data['blogTitleModel'] = $firstPostTitleModel;
    $data['bottomTitleModel'] = $bottomTitleModel;
    $data['tweetTitleModel'] = $this->getLatestTweet();

    $this->load->view('content/home', $data);
  }

  private function getLatestTweet() {
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
  }
}

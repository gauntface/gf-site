<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Feed extends Base_Controller {

  private static $FEED_POST_COUNT = 50;

  public function index($feedType = 'rss')
  {
    $this->load->model('blog/PostsModel');

    $postsModel = new PostsModel();
    $data['posts'] = $postsModel->getPublishedPosts($startIndex = 0, self::$FEED_POST_COUNT);

    log_message('error', 'FeedType: ' . $feedType);

    switch($feedType) {
      case 'rss':
        return $this->load->view('layouts/rss', $data);
      case 'atom':
        return $this->load->view('layouts/atom', $data);
      default:
        return $this->show_404();
    }
  }
}

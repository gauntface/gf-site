<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Feed extends BaseController {

  public function __construct() {
    // Cache for 60 minutes
    parent::__construct(60);
  }

  public function rss() {
    $this->load->model('data/blog/PostsModel');
    $posts = $this->PostsModel->getPublishedPosts(0, 100);

    $data['posts'] = $posts;
    $this->load->view('output-types/rss', $data);
  }

  public function atom() {
    $this->load->model('data/blog/PostsModel');
    $posts = $this->PostsModel->getPublishedPosts(0, 100);

    $data['posts'] = $posts;
    $this->load->view('output-types/atom', $data);
  }
}

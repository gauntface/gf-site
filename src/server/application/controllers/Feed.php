<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Feed extends CI_Controller {

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

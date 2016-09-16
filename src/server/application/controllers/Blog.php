<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Blog extends BaseController {

  public function index($pageIndex = 0) {
    if($pageIndex < 0) {
      show_404();
      return;
    }

    $this->load->model('contents/BlogContents');
    $this->render(
      $this->BlogContents->getIndexDocument(array('pageIndex' => $pageIndex))
    );
  }

  public function viewPostByDate($year, $month, $day, $slug) {
    $this->load->model('data/blog/PostsModel');

    $postModel = $this->PostsModel->getPostByDetails($year, $month, $day, $slug);

    $this->load->model('contents/BlogContents');
    $this->render(
      $this->BlogContents->getArticleDocument(array('postModel' => $postModel))
    );
  }

  public function viewPostById($postId) {
    $this->load->model('data/blog/PostsModel');
    $this->db->cache_off();
    $postModel = $this->PostsModel->getPostById($postId);
    $this->db->cache_on();

    $this->load->model('contents/BlogContents');
    $this->render(
      $this->BlogContents->getArticleDocument(array('postModel' => $postModel))
    );
  }
}

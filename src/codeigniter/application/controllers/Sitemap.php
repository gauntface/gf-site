<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Sitemap extends Base_Controller {

  public function index() {
    $this->load->model('blog/PostsModel');

    $siteArray = [
      '',
      'blog',
      'about',
      'contact',
    ];

    $postsModel = new PostsModel();
    $postCount = $postsModel->getPublishedPostCount();
    $posts = $postsModel->getPublishedPosts(0, $postCount);
    for($i = 0; $i < count($posts); $i++) {
      array_push($siteArray, $posts[$i]->getPublicURL());
    }
    /**$this->load->model('blogmodel');

    $totalPostCount = $this->blogmodel->getPublishedPostCount();
    $numberOfResults = 20;
    $pageNumber = 1;
    for($i = 0; $i < $totalPostCount; $i += $numberOfResults) {
      if($i == 0) {
        array_push($siteArray, 'blog/');
      } else {
        array_push($siteArray, 'blog/page/'.$pageNumber.'/');
        $pageNumber++;
      }


      $posts = $this->blogmodel->getPublishedPosts($startIndex = $i,
      $numberOfResults);


    }**/

    // Add blog pagination

    // Add blogs posts

    $data['urls'] = $siteArray;
    $this->load->view('layouts/sitemap', $data);
  }

}

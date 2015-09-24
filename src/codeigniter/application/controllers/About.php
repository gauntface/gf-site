<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class About extends Base_Controller {

  public function index()
  {
    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');
    $this->load->model('blog/PostsModel');

    $postsModel = new PostsModel();
    $posts = $postsModel->getPublishedPosts($startIndex = 0, 1);

    $firstPostTitleModel = null;
    if(count($posts) > 0) {
      $data['latestPost'] = $posts[0];
    }

    $pageData = new PageModel();
    $pageData->setTitle('About');
    $pageData->setRemoteStylesheets(['styles/about-remote.css']);
    $pageData->setInlineStylesheets(['styles/about-inline.css']);

    $contentData = new ContentGridModel();
    $contentData->setRightContentView('content/about');

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('about');

    $titleData = new TitleModel();
    $titleData->setTitle('Hey');

    $data['page'] = $pageData;
    $data['contentgrid'] = $contentData;
    $data['appbar'] = $appBarData;
    $data['title'] = $titleData;

    $this->load->view('layouts/split-sections', $data);
  }
}

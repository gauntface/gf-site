<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/admin/Admin_controller.php';

class Blog extends CI_Controller {

  public function view ($postId = null) {
    $this->load->helper('file');

    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');
    $this->load->model('blog/PostsModel');

    if ($postId == null) {
      show_404();
      return;
    }

    $postsModel = new PostsModel();
    $postModel = $postsModel->getPostById($postId);
    // TODO List:
    //    Check if page isn't published then check auth token

    $leftSectionCSS = read_file('styles/templates/inline-split-section.css');

    // TODO Select appropriate color for image background
    $leftSectionCSS = str_replace('\'{{left-section-bg-color}}\'', $postModel->getMainImgBgColor(), $leftSectionCSS);
    $leftSectionCSS = str_replace('{{left-section-img-url}}', $postModel->getMainImg(), $leftSectionCSS);
    //$leftSectionCSS = str_replace('{{masthead-bg-template-extension}}', $pathinfo["extension"], $mastheadTemplate);

    $pageData = new PageModel();
    $pageData->setTitle($postModel->getTitle());
    $pageData->setInlineStylesheets(['styles/pages/blog.css']);
    $pageData->setInlineRawCSS([
      $leftSectionCSS
    ]);

    $contentData = new ContentGridModel();

    // TODO: Change to Blog Content
    // $contentData->setRightContentView('content/about');
    // TODO: Add Left Content Change / Image

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('blog');

    $titleData = new TitleModel();
    $titleData->setTitle($postModel->getTitle());

    $data['page'] = $pageData;
    $data['contentgrid'] = $contentData;
    $data['appbar'] = $appBarData;
    $data['title'] = $titleData;
    $data['postModel'] = $postModel;

    $this->load->view('layouts/split-sections', $data);
  }

}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class About extends BaseController {

  public function __construct() {
    parent::__construct();
  }

  public function index() {
    $document = $this->getDocument('about-index');
    $this->render($document);
  }

  protected function getAppShellModel($pageId) {
    return 'appshell/KeyArtShell';
  }

  protected function generatePage($pageId) {
    switch($pageId) {
    case 'about-index':
      return $this->indexPage();
    }

    show_404();
  }

  private function indexPage() {
    $this->load->model('PageModel');
    $this->load->model('components/TitleComponent');
    $this->load->model('data/blog/PostsModel');
    $this->load->model('components/ViewOnlyComponent');

    $this->PageModel->setTitle('About');
    $this->PageModel->setThemeColor('#606363');
    $this->PageModel->addRemoteStylesheet('/styles/pages/about/about-remote.css');
    $this->PageModel->addInlineStylesheet('/styles/pages/about/about-inline.css');

    $this->TitleComponent->setTitle('Hey');
    $this->PageModel->addComponent($this->TitleComponent);

    $posts = $this->PostsModel->getPublishedPosts($startIndex = 0, 1);
    if(count($posts) > 0) {
      $this->ViewOnlyComponent->setData($posts[0]);
    }
    $this->ViewOnlyComponent->setView('content/about');
    $this->PageModel->addComponent($this->ViewOnlyComponent);

    return $this->PageModel;
  }
}

<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class AboutContents extends CI_Model {

  public function __construct() {
    parent::__construct(null);
  }

  public function getIndexDocument() {
    $this->load->model('document/StandardDocument', 'document');
    $this->load->model('appshell/KeyArtShell', 'appshell');

    $this->document->setAppShell($this->appshell);

    $page = $this->getIndexPage();
    $page->setId('about-index');

    $this->document->setPage($page);

    return $this->document;
  }

  private function getIndexPage() {
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

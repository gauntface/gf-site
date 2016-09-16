<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class HomeContents extends CI_Model {

  public function __construct() {
    parent::__construct(null);
  }

  public function getIndexDocument() {
    $this->load->model('document/StandardDocument', 'document');
    $this->load->model('appshell/HeaderFooterShell', 'appshell');

    $this->document->setAppShell($this->appshell);

    $page = $this->getIndexPage();
    $page->setId('home-index');
    
    $this->document->setPage($page);

    return $this->document;
  }

  private function getIndexPage() {
    $this->load->model('PageModel');
    $this->load->model('data/blog/PostsModel');
    $this->load->model('layouts/SplitHalfLayout');
    $this->load->model('components/TitleComponent');
    $this->load->model('components/LogoComponent');
    $this->load->model('components/TwitterComponent');
    $this->load->model('components/YouTubeComponent');

    $this->PageModel->addInlineStylesheet('/styles/pages/home/home-inline.css');

    $this->PageModel->addComponent($this->LogoComponent);

    $posts = $this->PostsModel->getPublishedPosts($startIndex = 0, 1);
    if(count($posts) > 0) {
      $firstPostComponent = new TitleComponent();
      $firstPostComponent->makePadded(true);
      $firstPostComponent->setTitle($posts[0]->getTitle());
      $firstPostComponent->setDescription($posts[0]->getExcerptHTML());
      $firstPostComponent->setSmallBackgroundImage($posts[0]->getGreyScaleImg());
      $firstPostComponent->setTime($posts[0]->getPublishTime());
      $firstPostComponent->setLinkURL($posts[0]->getPublicURL());
      $firstPostComponent->setClassName($posts[0]->getSlug());

      $this->PageModel->addComponent($firstPostComponent);
    }

    $this->SplitHalfLayout->addComponent($this->YouTubeComponent);
    $this->SplitHalfLayout->addComponent($this->TwitterComponent);

    $this->PageModel->addComponent($this->SplitHalfLayout);

    $bottomTitleModel = new TitleComponent();
    $bottomTitleModel->setTitle('Smashing Book 5');
    $bottomTitleModel->setDescription('<p>I’ve written a chapter in this book about service worker and it’s available now!</p><p><a href="'.htmlspecialchars('http://www.smashingmagazine.com/2015/03/real-life-responsive-web-design-smashing-book-5').'/">Get the print or ebook HERE</a></p>');
    $bottomTitleModel->setSmallTopText('News');
    $bottomTitleModel->setSmallBackgroundImage('/static/image/static/smashing-mag/smashing-mag.png');
    $bottomTitleModel->makePadded(true);

    $this->PageModel->addComponent($bottomTitleModel);

    return $this->PageModel;
  }
}

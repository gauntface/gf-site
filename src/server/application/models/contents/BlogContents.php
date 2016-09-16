<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'models/contents/BaseContents.php';

class BlogContents extends BaseContents {

  public static $NUM_OF_RESULTS_PER_PAGE = 20;

  public function getIndexDocument($pageData) {
    $this->load->model('document/StandardDocument', 'document');
    $this->load->model('appshell/HeaderFooterShell', 'appshell');

    $this->document->setAppShell($this->appshell);

    $page = $this->getIndexPage($pageData['pageIndex']);
    $page->setId('blog-index');

    $this->document->setPage($page);

    return $this->document;
  }

  public function getArticleDocument($pageData) {
    $this->load->model('document/StandardDocument', 'document');
    $this->load->model('appshell/KeyArtShell', 'appshell');

    $this->document->setAppShell($this->appshell);

    $page = $this->getArticlePage($this->appshell, $pageData['postModel']);
    if ($page) {
      $page->setId('blog-article');
      $this->document->setPage($page);
    }

    return $this->document;
  }

  private function getIndexPage($pageIndex) {
    $this->load->model('PageModel');
    $this->load->model('data/blog/PostsModel');
    $this->load->model('components/TitleComponent');

    $this->PageModel->setTitle('Blog');
    $this->PageModel->addInlineStylesheet('/styles/pages/blog-index/blog-index-inline.css');

    $offset = $pageIndex * self::$NUM_OF_RESULTS_PER_PAGE;
    $posts = $this->PostsModel->getPublishedPosts($startIndex = $offset, self::$NUM_OF_RESULTS_PER_PAGE);
    if(count($posts) > 0) {
      $this->PageModel->setThemeColor($posts[0]->getMainImgBgColor());

      $firstTitleComponent = new TitleComponent();
      $firstTitleComponent->setTitle($posts[0]->getTitle());
      $firstTitleComponent->setDescription($posts[0]->getExcerptHTML());
      $firstTitleComponent->setLinkURL($posts[0]->getPublicURL(), 'keyart');
      $firstTitleComponent->setFullbleedBackgroundImage($posts[0]->getMainImg());
      $firstTitleComponent->setFullbleedBackgroundColor($posts[0]->getMainImgBgColor());
      $firstTitleComponent->makePadded(true);
      $firstTitleComponent->setIsTransparent(false);
      $firstTitleComponent->setUseLightDivider(true);

      $this->PageModel->addComponent($firstTitleComponent);

      for ($i = 1; $i < count($posts); $i++) {
        $post = $posts[$i];

        $titleComponent = new TitleComponent();
        $titleComponent->setTitle($post->getTitle());
        $titleComponent->setDescription($post->getExcerptHTML());
        $titleComponent->setLinkURL($post->getPublicURL(), 'keyart');
        $titleComponent->setTime($post->getPublishTime());
        $titleComponent->setSmallBackgroundImage($post->getGreyScaleImg());
        $titleComponent->makePadded(true);

        $this->PageModel->addComponent($titleComponent);
      }
    } else {
      $titleComponent = new TitleComponent();
      $titleComponent->setTitle("No Posts Yet");
      $titleComponent->setDescription("<p>Give me a couple of minutes to put something together</p>");
      $titleComponent->setSmallBackgroundImage("images/pages/blog/coffee.png");
      $titleComponent->makePadded(true);

      $this->PageModel->addComponent($titleComponent);
    }

    return $this->PageModel;
  }

  private function getArticlePage($appshell, $postModel) {
    if($postModel == null) {
      return null;
    }

    $this->load->helper('loggedin');
    if (!$postModel->isPublished() && !isLoggedIn()) {
      return null;
    }

    $this->load->model('PageModel');
    $this->load->model('components/TitleComponent');
    $this->load->model('components/MarkdownComponent');

    // How to apply this to the keyart layout? Shoud it be?
    // setKeyArtImageUrl($postModel->getMainImgBgColor())
    // $this->PageModel->setInlineRawCSS([
    //  $leftSectionCSS
    // ]);
    $keyartLayout = $appshell->getLayout();

    $this->PageModel->setTitle($postModel->getTitle());
    $this->PageModel->setThemeColor($postModel->getMainImgBgColor());

    // This doesn't exist at the moment - may be needed in the future
    // At the moment extra styles are pulled in via markdown parser
    // So only styles that are NEEDED are added to the page.
    $this->PageModel->addInlineStylesheet('/styles/pages/blog-article/blog-article-inline.css');

    $this->PageModel->addInlineRawCSS(
      $keyartLayout->getBGColorCSS($postModel->getMainImgBgColor())
    );
    $this->PageModel->addRemoteRawCSS(
      $keyartLayout->getMainImgCSS($postModel->getMainImg())
    );

    $this->TitleComponent->setTitle($postModel->getTitle());
    $this->PageModel->addComponent($this->TitleComponent);

    $this->MarkdownComponent->setMarkdown($postModel->getContentMarkdown());
    $this->PageModel->addComponent($this->MarkdownComponent);

    return $this->PageModel;
  }
}

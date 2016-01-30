<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Blog extends BaseController {

  public static $NUM_OF_RESULTS_PER_PAGE = 20;

  public function __construct() {
    // Cache for 60 minutes
    parent::__construct(60);
  }

  public function index($pageIndex = 0) {
    if($pageIndex < 0) {
      show_404();
      return;
    }

    $document = $this->getDocument('blog-index', array('pageIndex' => $pageIndex));
    $this->render($document);
  }

  public function viewPostByDate($year, $month, $day, $slug) {
    $this->load->model('data/blog/PostsModel');

    $postModel = $this->PostsModel->getPostByDetails($year, $month, $day, $slug);

    $document = $this->getDocument('blog-article', array('postModel' => $postModel));
    $this->render($document);
  }

  public function viewPostById($postId) {
    $this->load->model('data/blog/PostsModel');

    $postModel = $this->PostsModel->getPostById($postId);

    $document = $this->getDocument('blog-article', array('postModel' => $postModel));
    $this->render($document);
  }

  protected function getAppShellModel($pageId) {
    switch($pageId) {
    case 'blog-article':
      return 'appshell/KeyArtShell';
    }

    return 'appshell/HeaderFooterShell';
  }

  protected function generatePage($pageId, $appshell, $pageData) {
    switch($pageId) {
    case 'blog-index':
      return $this->indexPage($pageData['pageIndex']);
    case 'blog-article':
      return $this->articlePage($appshell, $pageData['postModel']);
    }

    return null;
  }

  private function indexPage($pageIndex) {
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
    } else if(count($posts) === 0) {
      $titleComponent = new TitleComponent();
      $titleComponent->setTitle("No Posts Yet");
      $titleComponent->setDescription("<p>Give me a couple of minutes to put something together</p>");
      $titleComponent->setSmallBackgroundImage("images/pages/blog/coffee.png");
      $titleComponent->makePadded(true);

      $this->PageModel->addComponent($titleComponent);
    } else {
      show_404();
      return;
    }

    return $this->PageModel;
  }

  private function articlePage($appshell, $postModel) {
    if($postModel == null) {
      show_404();
      return;
    }
    
    if (!$postModel->isPublished() && !$this->isLoggedIn()) {
      show_404();
      return;
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

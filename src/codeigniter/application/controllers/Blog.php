<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Blog extends Base_Controller {

  public function index($page = 0) {
    if($page < 0) {
      return show_404();
    }

    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');
    $this->load->model('blog/PostsModel');

    $postsModel = new PostsModel();

    $numberOfResults = 20;
    $offset = $page * $numberOfResults;
    $posts = $postsModel->getPublishedPosts($startIndex = $offset, $numberOfResults);

    $pageData = new PageModel();
    $pageData->setTitle('Blog');
    $pageData->setRemoteStylesheets(['styles/blog-index-remote.css']);
    $pageData->setInlineStylesheets(['styles/blog-index-inline.css']);

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('blog');

    $data['page'] = $pageData;
    $data['appbar'] = $appBarData;

    $data['postTitles'] = array();

    if(count($posts) === 0) {
      $titleModel = new TitleModel();
      $titleModel->setTitle("No Posts Yet");
      $titleModel->setDescription("<p>Give me a couple of minutes to put something together</p>");
      $titleModel->setSmallBackgroundImage("images/pages/blog/coffee.png");
      $titleModel->makePadded(true);

      array_push($data['postTitles'] , $titleModel);
    } else {
      // Top image of the blog should be the main img
      $titleModel = new TitleModel();
      $titleModel->setTitle($posts[0]->getTitle());
      $titleModel->setDescription($posts[0]->getExcerptHTML());
      $titleModel->setFullbleedBackgroundImage($posts[0]->getMainImg());
      $titleModel->setFullbleedBackgroundColor($posts[0]->getMainImgBgColor());
      $titleModel->makePadded(true);
      $titleModel->setUseLightDivider(true);
      $titleModel->setLinkURL('/blog/view/'.$posts[0]->getId());

      array_push($data['postTitles'] , $titleModel);

      for ($i = 1; $i < count($posts); $i++) {
        $post = $posts[$i];

        $titleModel = new TitleModel();
        $titleModel->setTitle($post->getTitle());
        $titleModel->setDescription($post->getExcerptHTML());
        $titleModel->setDate();
        $titleModel->setSmallBackgroundImage($posts[0]->getGreyScaleImg());
        $titleModel->makePadded(true);
        $titleModel->setLinkURL('/blog/view/'.$post->getId());

        array_push($data['postTitles'] , $titleModel);
      }
    }

    $this->load->view('content/blog-index', $data);
  }

  public function view ($postId = null) {
    $this->load->helper('file');

    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');
    $this->load->model('blog/PostsModel');

    if ($postId == null) {
      return show_404();
    }

    $postsModel = new PostsModel();
    $postModel = $postsModel->getPostById($postId);
    if (!$postModel->isPublished() && !$this->verifyLoggedIn()) {
      return show_404();
    }

    $leftSectionCSS = read_file('styles/templates/inline-split-section.css');
    $leftSectionCSS = str_replace('\'{{left-section-bg-color}}\'', $postModel->getMainImgBgColor(), $leftSectionCSS);
    $leftSectionCSS = str_replace('{{left-section-img-url}}', $postModel->getMainImg(), $leftSectionCSS);

    log_message('error', $leftSectionCSS);

    // This will handle responsive image template when needed
    //$leftSectionCSS = str_replace('{{masthead-bg-template-extension}}', $pathinfo["extension"], $mastheadTemplate);

    $pageData = new PageModel();
    $pageData->setTitle($postModel->getTitle());
    $pageData->setRemoteStylesheets(['styles/blog-post-remote.css']);
    $pageData->setInlineStylesheets(['styles/blog-post-inline.css']);
    $pageData->setInlineRawCSS([
      $leftSectionCSS
    ]);

    $contentGridModel = array();
    $contentGridModel['postModel'] = $postModel;
    $contentData = new ContentGridModel($contentGridModel);
    $contentData->setRightContentView('content/blog-post');

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

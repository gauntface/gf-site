<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Push extends BaseController {

  public function __construct() {
    parent::__construct(0);
  }

  public function subscribe() {
    $success = false;

    $this->load->helper('api');

    $apiInputData = json_decode(file_get_contents("php://input"), true);
    if ($apiInputData['endpoint'] !== null) {
      $this->load->model('data/push/SubscriptionsModel');
      $subscriptionModel = $this->SubscriptionsModel->getSubscriptionByEndpoint($apiInputData['endpoint']);
      if ($subscriptionModel != null) {
        // Subscription is already in the server skip over it for now
        $success = true;
      } else {
        $this->SubscriptionsModel->insertSubscription($apiInputData);
        $success = true;
      }
    }

    returnAPISuccess(array(
      'success' => $success
    ));
  }

  protected function generatePage($pageId, $appshell, $pageData) {
    switch($pageId) {
    case 'admin-blog-index':
      return $this->indexPage($pageData['page']);
    case 'admin-blog-edit':
      return $this->editorPage($pageData['postModel']);
    }

    show_404();
  }

  private function indexPage($page) {
    $this->load->model('PageModel');
    $this->load->model('data/blog/PostsModel');
    $this->load->model('components/ViewOnlyComponent');

    $this->PageModel->setExpiryTimeInSeconds(0);
    $this->PageModel->setTitle('Admin');
    $this->PageModel->addInlineStylesheet('/styles/pages/admin/blog-index-inline.css');

    $blogTopOptionsComponent = new ViewOnlyComponent();
    $blogTopOptionsComponent->setView('admin/blog-top-options');
    $this->PageModel->addComponent($blogTopOptionsComponent);

    $offset = $page * self::$NUM_OF_RESULTS_PER_PAGE;
    $posts = $this->PostsModel->getDraftPosts($startIndex = $offset, self::$NUM_OF_RESULTS_PER_PAGE);
    for ($i = 0; $i < count($posts); $i++) {
      $post = $posts[$i];

      $viewonlyComponent = new ViewOnlyComponent();
      $viewonlyComponent->setData($post);
      $viewonlyComponent->setView('admin/blog-item');
      $this->PageModel->addComponent($viewonlyComponent);
    }

    return $this->PageModel;
  }
}

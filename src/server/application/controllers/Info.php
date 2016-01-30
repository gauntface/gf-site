<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Info extends BaseController {

  public function __construct() {
    parent::__construct();
  }

  public function index() {
    $document = $this->getDocument('info-index');
    $this->render($document);
  }

  protected function getAppShellModel($pageId) {
    return 'appshell/KeyArtShell';
  }

  protected function generatePage($pageId) {
    switch($pageId) {
    case 'info-index':
      return $this->indexPage();
    }

    show_404();
  }

  private function indexPage() {
    $this->load->model('PageModel');
    $this->load->model('components/TitleComponent');
    $this->load->model('components/ViewOnlyComponent');

    $this->PageModel->setTitle('Info');
    $this->PageModel->setThemeColor('#bbbbbb');
    $this->PageModel->setShouldIndex(false);

    $this->TitleComponent->setTitle('Info');
    $this->PageModel->addComponent($this->TitleComponent);

    $this->ViewOnlyComponent->setView('content/info');
    $this->PageModel->addComponent($this->ViewOnlyComponent);

    return $this->PageModel;
  }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Contact extends BaseController {

  public function __construct() {
    // Cache for 60 minutes
    parent::__construct(60);
  }

  public function index() {
    $document = $this->getDocument('contact-index');
    $this->render($document);
  }

  protected function generatePage($pageId) {
    switch($pageId) {
    case 'contact-index':
      return $this->indexPage();
    }

    show_404();
  }

  private function indexPage() {
    $this->load->model('PageModel');
    $this->load->model('components/TitleComponent');
    $this->load->model('components/ViewOnlyComponent');

    $this->PageModel->setTitle('Contact');
    $this->PageModel->addInlineStylesheet('/styles/pages/contact/contact-inline.css');
    $this->PageModel->setThemeColor('#1A1420');

    $this->TitleComponent->setTitle('Say Hi');
    $this->TitleComponent->setUseLightDivider(true);

    $this->PageModel->addComponent($this->TitleComponent);

    $this->ViewOnlyComponent->setView('content/contact');
    $this->PageModel->addComponent($this->ViewOnlyComponent);

    return $this->PageModel;
  }
}

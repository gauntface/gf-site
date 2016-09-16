<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class ContactContents extends CI_Model {

  public function __construct() {
    parent::__construct(null);
  }

  public function getIndexDocument() {
    $this->load->model('document/StandardDocument', 'document');
    $this->load->model('appshell/HeaderFooterShell', 'appshell');

    $this->document->setAppShell($this->appshell);

    $page = $this->getIndexPage();
    $page->setId('contact-index');

    $this->document->setPage($page);

    return $this->document;
  }

  private function getIndexPage() {
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

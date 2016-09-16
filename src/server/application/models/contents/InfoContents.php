<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class InfoContents extends CI_Model {

  public function __construct() {
    parent::__construct(null);
  }

  public function getIndexDocument() {
    $this->load->model('document/StandardDocument', 'document');
    $this->load->model('appshell/KeyArtShell', 'appshell');

    $this->document->setAppShell($this->appshell);

    $page = $this->getIndexPage();
    $page->setId('info-index');

    $this->document->setPage($page);

    return $this->document;
  }

  private function getIndexPage() {
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

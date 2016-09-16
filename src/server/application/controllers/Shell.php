<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Shell extends BaseController {

  public function __construct() {
    parent::__construct();
  }


  public function headerfooter() {
    $document = $this->getDocument('headerfooter');
    $this->render($document);
  }

  public function keyart() {
    $document = $this->getDocument('keyart');
    $this->render($document);
  }

  protected function getAppShellModel($pageId) {
    switch($pageId) {
    case 'blank':
      return 'appshell/BlankShell';
    case 'headerfooter':
      return 'appshell/HeaderFooterShell';
    case 'keyart':
      return 'appshell/KeyArtShell';
    }

    show_404();
  }

  protected function generatePage($pageId) {
    $this->load->model('PageModel');
    return $this->PageModel;
  }
}

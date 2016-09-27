<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Document extends BaseController {

  public function index() {
    $this->load->model('document/StandardDocument', 'document');
    $this->render($this->document);
  }
}

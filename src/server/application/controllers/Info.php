<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Info extends BaseController {
  public function index() {
    $this->load->model('contents/InfoContents');
    $this->render($this->InfoContents->getIndexDocument());
  }
}

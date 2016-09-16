<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Contact extends BaseController {

  public function index() {
    $this->load->model('contents/ContactContents');
    $this->render($this->ContactContents->getIndexDocument());
  }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Home extends BaseController {
  public function index() {
    $this->load->model('contents/HomeContents');
    $this->render($this->HomeContents->getIndexDocument());
  }
}

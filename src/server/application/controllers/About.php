<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class About extends BaseController {
  public function index() {
    $this->load->model('contents/AboutContents');
    $this->render($this->AboutContents->getIndexDocument());
  }
}

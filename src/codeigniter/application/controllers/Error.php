<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Error extends Base_Controller {

  public function index()
  {
    $this->show_404();
  }
}

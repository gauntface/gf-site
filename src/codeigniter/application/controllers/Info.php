<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Info extends Base_Controller {

  public function index()
  {
    if(ENVIRONMENT != 'development') {
      return $this->show_404();
    }

    $this->load->view('content/info');
  }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Tests extends Base_Controller {

  public function index() {
    $this->load->model('pagemodel');

    $pageData = new PageModel();
    $pageData->setTitle('Tests');
    $pageData->setInlineStylesheets([]);
    $pageData->setRemoteStylesheets(['https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css']);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view('content/tests');
    $this->load->view('templates/footer', $data);
  }

}

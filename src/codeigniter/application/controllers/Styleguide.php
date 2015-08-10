<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Styleguide extends Base_Controller {

  public function index() {
    $this->load->model('pagemodel');
    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');

    $pageData->setInlineStylesheets(['styles/pages/styleguide-view-window.css']);
    $pageData->setRemoteScripts(['scripts/styleguide/styleguide-viewer-controller.es6.js']);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view('styleguide/styleguide-view-window');
    $this->load->view('templates/footer', $data);
  }

  public function view($component = null) {
    $this->load->model('pagemodel');
    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');

    $viewToRender = 'styleguide/styleguide-index.php';
    if($component != null) {
      $pageData->setBodyClass('styleguide-element-test');
      $viewToRender = 'styleguide/components/' . $component;
    }

    $pageData->setInlineStylesheets(['styles/pages/styleguide-index.css']);
    $pageData->setRemoteScripts(['scripts/styleguide/styleguide-messenger-controller.es6.js']);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view($viewToRender);
    $this->load->view('templates/footer', $data);
  }

}

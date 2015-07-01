<?php

class Styleguide extends CI_Controller {

  public function index() {
    $this->load->model('pagemodel');
    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');

    $pageData->setInlineStylesheets(['styles/styleguide-view-window.css']);
    $pageData->setRemoteScripts(['scripts/styleguide-view-options.js', 'scripts/analytics.js']);

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

    $pageData->setInlineStylesheets(['styles/styleguide-index.css']);
    $pageData->setRemoteScripts(['scripts/debug.js', 'scripts/analytics.js', 'scripts/styleguide-window-viewer-messenger.js']);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view($viewToRender);
    $this->load->view('templates/footer', $data);
  }

}

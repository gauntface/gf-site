<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Styleguide extends Base_Controller {

  public function index() {
    $this->load->model('pagemodel');
    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');

    $pageData->setInlineStylesheets(['styles/styleguide-frame-inline.css']);
    $pageData->setRemoteScripts(['scripts/styleguide/styleguide-frame-controller.es6.js']);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view('content/styleguide-frame');
    $this->load->view('templates/footer', $data);
  }

  public function componentList() {
    $this->load->model('pagemodel');

    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');
    $pageData->setBodyClass('styleguide-index-page');
    $pageData->setInlineStylesheets([
      'styles/styleguide-index-inline.css'
    ]);
    $pageData->setRemoteScripts([
      'scripts/styleguide/styleguide-messenger-controller.es6.js'
    ]);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view('content/styleguide-index.php');
    $this->load->view('templates/footer', $data);
  }

  public function view($type, $id, $variant = null) {
    $this->load->model('pagemodel');
    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');
    $pageData->setBodyClass('styleguide-element-test');
    $pageData->setRemoteScripts(['scripts/styleguide/styleguide-messenger-controller.es6.js']);

    switch($type) {
      case 'components':
        $componentName = $id;
        if ($variant) {
          $componentName = $id.'-'.$variant;
        }

        $inlineStylesheets = [
          'styles/components/'.$componentName.'/'.$componentName.'-inline.css',
          'styles/styleguide-index-inline.css'
        ];
        $pageData->setInlineStylesheets($inlineStylesheets);

        if (file_exists('styles/components/'.$componentName.'/'.$componentName.'-remote.css')) {
          $pageData->setRemoteStylesheets(['styles/components/'.$componentName.'/'.$componentName.'-remote.css']);
        }
        break;
      case 'partials':
        $inlineStyles = array('styles/partials/base-core.css', 'styles/components/debug/debug-remote.css');
        if($id != 'base-core') {
          array_push($inlineStyles, 'styles/partials/'.$id.'.css');
        }
        $pageData->setInlineStylesheets($inlineStyles);
        break;
      default:
        $this->show_404();
        break;
    }

    switch($id) {
      case 'appbar':
        $this->load->model('components/appbarModel');
        $appbar = new AppBarModel();
        $appbar->setSelectedItem('home');
        $data['appbar'] = $appbar;
        break;
    }


    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view($type . '/' . $id);
    $this->load->view('templates/footer', $data);
  }

}

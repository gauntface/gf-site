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

  public function view($type = null, $id = null) {
    $this->load->model('pagemodel');
    $pageData = new PageModel();
    $pageData->setTitle('Styleguide');

    if($type == null && $id == null) {
      $viewToRender = 'content/styleguide-index.php';

      $pageData->setBodyClass('styleguide-index-page');
      $pageData->setInlineStylesheets([
        'styles/styleguide-index-inline.css'
      ]);
    } else {
      switch($type) {
        case 'components':
          $pageData->setInlineStylesheets([
            'styles/components/'.$id.'/'.$id.'-inline.css',
            'styles/styleguide-index-inline.css'
          ]);

          // TODO: Check if the remote stylesheet actually exists
          $pageData->setRemoteStylesheets(['styles/components/'.$id.'/'.$id.'-remote.css']);
          break;
        case 'partials':
          $inlineStyles = array('styles/partials/base-core.css');
          array_push($inlineStyles, 'styles/components/debug/debug-remote.css');
          if($id != 'base-core') {
            array_push($inlineStyles, 'styles/partials/'.$id.'.css');
          }
          $pageData->setInlineStylesheets($inlineStyles);
          break;
        default:
          $this->show_404();
          break;
      }

      $pageData->setBodyClass('styleguide-element-test');
      $viewToRender = $type . '/' . $id;
    }

    $pageData->setRemoteScripts(['scripts/styleguide/styleguide-messenger-controller.es6.js']);

    $data['page'] = $pageData;

    $this->load->view('templates/header', $data);
    $this->load->view($viewToRender);
    $this->load->view('templates/footer', $data);
  }

}

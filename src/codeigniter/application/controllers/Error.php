<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Error extends Base_Controller {

  public function index()
  {
    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');

    $pageData = new PageModel();
    $pageData->setTitle('404 Oops');
    $pageData->setInlineStylesheets(['styles/pages/about.css']);

    $contentData = new ContentGridModel();
    $contentData->setRightContentView('content/404');

    $appBarData = new AppBarModel();

    $titleData = new TitleModel();
    $titleData->setTitle('404 Oops');

    $data['page'] = $pageData;
    $data['contentgrid'] = $contentData;
    $data['appbar'] = $appBarData;
    $data['title'] = $titleData;

    $this->output->set_status_header('404');
    $this->load->view('layouts/split-sections', $data);
  }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class About extends CI_Controller {

  public function index()
  {
    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');

    $pageData = new PageModel();
    $pageData->setTitle('About');
    $pageData->setInlineStylesheets(['styles/about.css']);

    $contentData = new ContentGridModel();
    $contentData->setRightContentView('content/about');

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('about');

    $titleData = new TitleModel();
    $titleData->setTitle('Hey');

    $data['page'] = $pageData;
    $data['contentgrid'] = $contentData;
    $data['appbar'] = $appBarData;
    $data['title'] = $titleData;

    $this->load->view('layouts/split-sections', $data);
  }
}

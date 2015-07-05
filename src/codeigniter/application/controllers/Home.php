<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

  public function index()
  {
    $this->load->model('PageModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');

    $pageData = new PageModel();
    $pageData->setTitle('Welcome');
    $pageData->setInlineStylesheets(['styles/index.css']);
    $pageData->setRemoteScripts(['scripts/analytics.js', 'scripts/debug.js']);

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('home');

    $titleData = new TitleModel();
    $titleData->setTitle('Test Title');
    $titleData->setDescription('Test Description');
    $titleData->setDate();
    $titleData->setBackgroundImage('/images/example/gass.png');
    $titleData->makePadded(true);

    $data['page'] = $pageData;
    $data['appbar'] = $appBarData;
    $data['title'] = $titleData;

    $this->load->view('layouts/index', $data);
  }
}

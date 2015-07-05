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

    $topTitleModel = new TitleModel();
    $topTitleModel->setTitle('Test Title');
    $topTitleModel->setDescription('Test Description');
    $topTitleModel->setDate();
    $topTitleModel->setBackgroundImage('/images/example/gass.png');
    $topTitleModel->makePadded(true);

    $bottomTitleModel = new TitleModel();
    $bottomTitleModel->setTitle('Smashing Book 5: Real-Life Responsive Web Design');
    $bottomTitleModel->setDescription('I’ve been writing a chapter in this book about service worker and it’s finally coming out! <a href="#">Get the print or ebook HERE</a>');
    $bottomTitleModel->setSmallTopText('News');
    $bottomTitleModel->setBackgroundImage('/images/pages/home/smashing-mag.png');
    $bottomTitleModel->makePadded(true);

    $data['page'] = $pageData;
    $data['appbar'] = $appBarData;
    $data['topTitleModel'] = $topTitleModel;
    $data['bottomTitleModel'] = $bottomTitleModel;

    $this->load->view('layouts/home', $data);
  }
}

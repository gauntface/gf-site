<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Contact extends Base_Controller {

  public function index()
  {
    $this->load->model('PageModel');
    $this->load->model('AppBarModel');
    $this->load->model('TitleModel');

    $pageData = new PageModel();
    $pageData->setTitle('Contact');
    $pageData->setRemoteStylesheets(['styles/contact-remote.css']);
    $pageData->setInlineStylesheets(['styles/contact-inline.css']);

    $appBarData = new AppBarModel();
    $appBarData->setSelectedItem('contact');

    $titleData = new TitleModel();
    $titleData->setTitle('Say Hi');
    $titleData->setUseLightDivider(true);

    $data['page'] = $pageData;
    $data['contentview'] = 'content/about';
    $data['appbar'] = $appBarData;
    $data['title'] = $titleData;

    $this->load->view('layouts/contact', $data);
  }
}

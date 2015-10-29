<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Signin_controller.php';

class Base_Controller extends SignIn_Controller {

  public function __construct($cacheTime = (365 * 24 * 60))
  {
        parent::__construct();
        $this->load->helper('url');
        if($cacheTime > 0 && ENVIRONMENT !== 'development') {
          // Number of minutes to cache output
          $this->output->cache($cacheTime);
        }
  }

  protected function show_404() {
    $this->load->model('PageModel');
    $this->load->model('ContentGridModel');
    $this->load->model('components/AppBarModel');
    $this->load->model('components/TitleModel');

    // 404 shouldn't be cached
    $this->output->cache(0);

    $pageData = new PageModel();
    $pageData->setTitle('404 Oops');
    $pageData->setRemoteStylesheets(['styles/error-remote.css']);
    $pageData->setInlineStylesheets(['styles/error-inline.css']);

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

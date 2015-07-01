<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

  /**
   * Index Page for this controller.
   *
   * Maps to the following URL
   * 		http://example.com/index.php/welcome
   *	- or -
   * 		http://example.com/index.php/welcome/index
   *	- or -
   * Since this controller is set as the default controller in
   * config/routes.php, it's displayed at http://example.com/
   *
   * So any other public methods not prefixed with an underscore will
   * map to /index.php/welcome/<method_name>
   * @see http://codeigniter.com/user_guide/general/urls.html
   */
  public function index()
  {
    log_message('error', 'Start of index() in welcome.php');
    $this->load->model('Pagemodel');
    log_message('error', 'Got pagemodel?');
    $pageData = new PageModel();
    $pageData->setTitle('Welcome');

    $pageData->setInlineStylesheets(['styles/styleguide-index.css']);
    $pageData->setRemoteScripts(['scripts/analytics.js']);

    $data['page'] = $pageData;

    //$this->load->view('welcome_message');
    $this->load->view('templates/header', $data);
    $this->load->view('styleguide/components/appbar');
    $this->load->view('styleguide/components/home-header');
    $this->load->view('styleguide/components/title-block-item');
    $this->load->view('styleguide/components/youtube-block');
    $this->load->view('styleguide/components/twitter-block');
    $this->load->view('styleguide/components/title-block-item');
    $this->load->view('styleguide/components/footer');
    $this->load->view('templates/footer', $data);
  }
}

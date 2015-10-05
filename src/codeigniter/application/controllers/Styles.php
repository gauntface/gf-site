<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class Styles extends Base_Controller {

  public function index() {
    $this->load->helper('file');
    $this->load->helper('styles_image_swap');

    $pathinfo = pathinfo($this->uri->uri_string());
    $numOfSegments = $this->uri->total_segments();
    $stylehsheetPath = '';
    for($i = 2; $i < $numOfSegments; $i++) {
      $stylehsheetPath .= $this->uri->segment($i);
      $stylehsheetPath .= '/';
    }
    $filename = explode('.', $pathinfo['filename'])[0];
    $stylehsheetPath .= $filename.'.'.$pathinfo['extension'];

    if(!file_exists($stylehsheetPath)) {
      $this->show_404();
      return;
    }

    $content = read_file($stylehsheetPath);

    $content = swapStylesheetImages($content);

    $data['css'] = $content;
    $this->load->view('templates/css_response.php', $data);
  }
}

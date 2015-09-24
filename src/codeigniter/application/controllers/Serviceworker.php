<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class ServiceWorker extends Base_Controller {

  public function __construct() {
    // Cache for 1 day
    parent::__construct(24 * 60);
  }

  public function index()
  {
    $this->load->helper('file');
    $this->load->helper('revision');

    $cachableAssets = [];

    $jsonData = '';
    for($i = 0; $i < count($cachableAssets); $i++) {
      $jsonData .= '"'.$cachableAssets[$i].'"';
      if($i+1 < count($cachableAssets)) {
        $jsonData .= ',';
      }
      $jsonData .= "\r\n";
    }
    $jsonData .= '';

    $serviceWorkerTemplate = read_file('sw.tmpl.js');
    $serviceWorkerTemplate = str_replace("//@ GF-SW @//", $jsonData, $serviceWorkerTemplate);
    $serviceWorkerTemplate = str_replace("//@ GF-MODDATE @//", "/** ".date ("F d Y H:i:s.",
      filemtime('sw.tmpl.js')).
      " **/", $serviceWorkerTemplate);

    $outputArray;
    preg_match_all("/importScripts\('(.*)'\);/",
      $serviceWorkerTemplate, $outputArray);

    for($i = 0; $i < count($outputArray[1]); $i++) {
      log_message('error', 'Swap '.$outputArray[1][$i]);
      log_message('error', 'with '.addRevisionToFilePath($outputArray[1][$i]));
      $serviceWorkerTemplate = str_replace($outputArray[1][$i],
        addRevisionToFilePath($outputArray[1][$i]), $serviceWorkerTemplate);
    }

    $data['js'] = $serviceWorkerTemplate;
    $this->load->view('templates/javascript_response', $data);
  }
}

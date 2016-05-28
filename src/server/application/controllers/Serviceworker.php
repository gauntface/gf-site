<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/BaseController.php';

class Serviceworker extends BaseController {

  public function __construct() {
    parent::__construct(60 * 24);
  }

  public function index() {
    $this->load->helper('file');
    $this->load->helper('revision');

    // These should be dynamically generated
    $cachablePaths = [
      '/',
      '/about',
      '/blog',
      '/contact'
    ];
    $cachableAssets = [
      '/scripts/bootstrap.js'
    ];

    $jsonData = array();
    for($i = 0; $i < count($cachablePaths); $i++) {
      array_push($jsonData, $cachablePaths[$i]);
    }

    for($i = 0; $i < count($cachableAssets); $i++) {
      array_push($jsonData, addRevisionToFilePath($cachableAssets[$i]));
    }

    $serviceWorkerTemplate = read_file('sw.tmpl.js');
    $serviceWorkerTemplate = str_replace("; /**@ GF-SW @**/", " = ".json_encode($jsonData), $serviceWorkerTemplate);
    $serviceWorkerTemplate = str_replace("/**@ GF-MODDATE @**/", "/** ".date ("F d Y H:i:s.",
      filemtime('sw.tmpl.js')).
      " **/", $serviceWorkerTemplate);

    $outputArray;
    preg_match_all("/importScripts\('(.*)'\);/", $serviceWorkerTemplate, $outputArray);

    for($i = 0; $i < count($outputArray[1]); $i++) {
      $serviceWorkerTemplate = str_replace($outputArray[1][$i],
        addRevisionToFilePath($outputArray[1][$i]), $serviceWorkerTemplate);
    }

    $data['js'] = $serviceWorkerTemplate;
    $this->load->view('output-types/javascript', $data);
  }
}

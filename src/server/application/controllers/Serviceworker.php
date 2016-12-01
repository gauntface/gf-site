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
    // TODO: Blog needs to be dynamic
    // TODO: Remote CSS needs to be figured out
    $cachablePaths = [
      '/document?output=json&section=document',

      '/layout/keyart?output=json&section=layout',
      '/layout/headerfooter?output=json&section=layout',

      '/?output=json&section=content',
      '/?output=remote_css&section=both',
      '/about?output=json&section=content',
      '/about?output=remote_css&section=both',
      '/contact?output=json&section=content',
      '/contact?output=remote_css&section=both',

      '/blog?output=json&section=content',
      '/blog?output=remote_css&section=both',
    ];
    // Assets that need file revisioning
    // TODO: Footer assets
    $cachableAssets = [
      '/scripts/bootstrap.js',
      '/styles/elements/fonts.css',
      '/images/components/youtube-block/youtube-block-play-icon.svg',
      '/images/components/twitter-block/twitter-block-logo.svg',
      '/images/components/footer/footer-gplus.svg',
      '/images/components/footer/footer-rss.svg',
      '/images/components/footer/footer-twitter.svg',
      '/images/components/footer/footer-youtube.svg'
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

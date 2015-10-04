<?php

class PageModel extends CI_Model {

  private $DEFAULT_TITLE = 'Gaunt Face | Matt Gaunt';
  private $DEFAULT_DESCRIPTION = 'This is the site for Matt Gaunt, a ' .
    'Developer Programs Engineer at Google. This site is just a list of ' .
    'things he\'s been up to including blog, projects, video series and talks.';

  private $_themeColor;
  private $_title;
  private $_description;
  private $_bodyClass;
  private $_inlineStylesheets;
  private $_inlineRawCSS;
  private $_remoteStylesheets;
  private $_inlineScripts;
  private $_remoteScripts;

  function __construct() {
    // Call the Model constructor
    parent::__construct();

    $this->_themeColor = '#1E1621';
    $this->_remoteScripts = ['scripts/standard-page.es6.js'];
  }

  public function getThemeColor() {
    return $this->_themeColor;
  }

  public function getTitle() {
    if(isset($this->_title) && strlen($this->_title) > 0) {
      return $this->_title . ' - ' . $this->DEFAULT_TITLE;
    }

    return $this->DEFAULT_TITLE;
  }

  public function setTitle($title) {
    $this->_title = $title;
  }

  public function getDescription() {
    if(isset($this->_description) && strlen($this->_description) > 0) {
      return $this->_description;
    }

    return $this->DEFAULT_DESCRIPTION;
  }

  public function getBodyClass() {
    return $this->_bodyClass;
  }

  public function setBodyClass($bodyClass) {
    $this->_bodyClass = $bodyClass;
  }

  // Expiry time is 24 hours
  public function getExpiryTimeInSeconds() {
    return (24 * 60 * 60);
  }

  public function getExpiryDate() {
    $expiresTime = time() + $this->getExpiryTimeInSeconds();
    return gmdate('D, d M Y H:i:s', $expiresTime);
  }

  public function setInlineStylesheets($inlineStylesheets) {
    $this->_inlineStylesheets = $inlineStylesheets;
  }

  public function getInlineStylesheets() {
    return $this->_inlineStylesheets;
  }

  public function getInlineStylesheetContents() {
    $rawStyles = [];
    for($i = 0; $i < count($this->_inlineStylesheets); $i++){
      array_push($rawStyles, $this->getStylesheetContent($this->_inlineStylesheets[$i]));
    }
    return $rawStyles;
  }

  private function getStylesheetContent($stylesheetFilename) {
    $this->load->model('CloudStorageModel');
    $this->load->model('ImageModel');

    $content = read_file($stylesheetFilename);
    $matchesCount = preg_match_all("/background-image:[\s]?url\(\"(\/static\/image\/(.*))\"\);/", $content, $output_array);
    if ($matchesCount == 0) {
      return $content;
    }

    // The regular expression didn't work, it must be a path to the original image required
    for ($i = 0; $i < $matchesCount; $i++) {
      $imgPath = $output_array[2][$i];
      $imageObject = new ImageModel($imgPath);
      if ($this->CloudStorageModel->doesImageExist($imageObject->getCloudStoragePath()) == false) {
        continue;
      }

      $cloudStorageUrl = $this->CloudStorageModel->getCloudStorageUrl($imageObject->getCloudStoragePath());
      $content = str_replace($output_array[1][$i], $cloudStorageUrl, $content);
    }

    return $content;
  }

  public function setRemoteStylesheets($remoteStylesheet) {
    $this->_remoteStylesheets = $remoteStylesheet;
  }

  public function getRemoteStylesheets() {
    return $this->_remoteStylesheets;
  }

  public function setInlineRawCSS($inlineStyles) {
    $this->_inlineRawCSS = $inlineStyles;
  }

  public function getInlineRawCSS() {
    return $this->_inlineRawCSS;
  }

  public function setRemoteScripts($remoteScripts) {
    $this->_remoteScripts = $remoteScripts;
  }

  public function getRemoteScripts() {
    if(isset($this->_remoteScripts)) {
      return $this->_remoteScripts;
    }
    return array();
  }
}

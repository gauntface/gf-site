<?php

class BaseComponent extends CI_Model {

  private $_viewPath;
  private $_inlineStylesheets;
  private $_inlieRawCSS;
  private $_remoteStylesheets;
  private $_remoteRawCSS;
  private $_remoteScripts;

  function __construct($viewPath) {
    // Call the Model constructor
    parent::__construct();

    $this->_viewPath = $viewPath;
    $this->_inlineStylesheets = [];
    $this->_inlieRawCSS = [];
    $this->_remoteStylesheets = [];
    $this->_remoteRawCSS = [];
    $this->_remoteScripts = [];
  }

  public function getViewPath() {
    return $this->_viewPath;
  }

  public function loadView($returnString = false) {
    return $this->load->view($this->_viewPath, array('model' => $this), $returnString);
  }

  public function addInlineStylesheet($stylesheet) {
    array_push($this->_inlineStylesheets, $stylesheet);
  }

  public function removeInlineStylesheet($stylesheet) {
    $index = array_search($stylesheet, $this->_inlineStylesheets);
    array_splice($this->_inlineStylesheets, $index, 1);
  }

  public function getInlineStylesheets() {
    return $this->_inlineStylesheets;
  }

  public function getAllStylesAsCSS() {
    $this->load->helper('styles_image_swap');
    $this->load->helper('file');

    $inlineStylesheets = array_unique($this->getInlineStylesheets());
    $inlineRawCSS = $this->getInlineRawCSS();

    if (count($inlineStylesheets) === 0 && count($inlineRawCSS) === 0) {
      return null;
    }

    $cssToInline = array();
    foreach($inlineStylesheets as $singleStylesheet) {
      array_push($cssToInline, swapStylesheetImages(read_file('.'.$singleStylesheet)));
    }
    foreach($inlineRawCSS as $rawCSS) {
      array_push($cssToInline, swapStylesheetImages($rawCSS));
    }

    $cssToInlineString = implode(' ', $cssToInline);
    if (strlen($cssToInlineString) > 0) {
      return $cssToInlineString;
    }

    return null;
  }

  public function addInlineRawCSS($css) {
    array_push($this->_inlieRawCSS, $css);
  }

  public function getInlineRawCSS() {
    return $this->_inlieRawCSS;
  }

  public function addRemoteStylesheet($stylesheet) {
    array_push($this->_remoteStylesheets, $stylesheet);
  }

  public function getRemoteStylesheets() {
    return $this->_remoteStylesheets;
  }

  public function addRemoteRawCSS($css) {
    array_push($this->_remoteRawCSS, $css);
  }

  public function getRemoteRawCSS() {
    return $this->_remoteRawCSS;
  }

  public function addRemoteScript($script) {
    array_push($this->_remoteScripts, $script);
  }

  public function getRemoteScripts() {
    return $this->_remoteScripts;
  }
}

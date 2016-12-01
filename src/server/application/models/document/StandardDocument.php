<?php

require_once APPPATH.'models/components/BaseComponent.php';

class StandardDocument extends BaseComponent {

  private $_appShellModel;
  private $_pageModel;

  function __construct() {
    // Call the Model constructor
    parent::__construct('documents/standard/standard-document');

    $this->addRemoteScript('/scripts/bootstrap.js');
  }

  public function setAppShell($appshell) {
    $this->_appShellModel = $appshell;
  }

  public function getAppShell() {
    return $this->_appShellModel;
  }

  public function setPage($page) {
    $this->_pageModel = $page;
  }

  public function getPage() {
    return $this->_pageModel;
  }

  public function getRemoteStyleURL() {
    $pageStylesheets = [];
    if ($this->_pageModel) {
      $pageStylesheets = $this->_pageModel->getRemoteStylesheets();
    }
    $shellStylesheets = [];
    if ($this->_appShellModel) {
      $shellStylesheets = $this->_appShellModel->getRemoteStylesheets();
    }

    if (count($pageStylesheets) > 0 || count($shellStylesheets) > 0) {
      return '/'.uri_string().'?output=remote_css&section=both';
    }

    return null;
  }
}

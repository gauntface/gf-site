<?php

class StandardDocument extends CI_Model {

  private $_appShellModel;
  private $_pageModel;

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
    $pageStylesheets = $this->getPage()->getRemoteStylesheets();
    $shellStylesheets = $this->getAppShell()->getRemoteStylesheets();

    if (count($pageStylesheets) > 0 || count($shellStylesheets) > 0) {
      return '/'.uri_string().'?output=remote_css&section=both';
    }
    return null;
  }
}

<?php

require_once APPPATH.'models/layouts/BaseLayout.php';

class BaseShell extends BaseLayout {

  private $_appshellId;

  public function __construct($appshellId){
    parent::__construct(null);

    $this->load->helper('url');
    $this->_appshellId = $appshellId;

    // This is needed to manage spinner between page loads
    $this->addInlineStylesheet('/styles/components/spinner/spinner-inline.css');
  }

  public function loadView($returnString = false) {
    $result = '';
    $allComponents = $this->getComponents();
    foreach($allComponents as $component) {
      $loadViewResult = $component->loadView($returnString);
      if ($returnString) {
        $result .= $loadViewResult;
      }
    }
    return $result;
  }

  public function getAppShellId() {
    return $this->_appshellId;
  }
}

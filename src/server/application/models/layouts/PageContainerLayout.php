<?php

require_once APPPATH.'models/layouts/BaseLayout.php';

class PageContainerLayout extends BaseLayout {

  function __construct() {
    // Call the Model constructor
    parent::__construct('layouts/page-container');
  }

  public function addComponent($component) {
    if (count($this->getComponents()) >= 1) {
      return;
    }

    parent::addComponent($component);
  }
}

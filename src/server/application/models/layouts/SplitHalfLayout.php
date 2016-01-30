<?php

require_once APPPATH.'models/layouts/BaseLayout.php';

class SplitHalfLayout extends BaseLayout {

  function __construct() {
    // Call the Model constructor
    parent::__construct('layouts/split-half');

    $this->addInlineStylesheet('/styles/layouts/split-half/split-half-inline.css');
  }

  public function addComponent($component) {
    if (count($this->getComponents()) >= 2) {
      return;
    }

    parent::addComponent($component);
  }
}

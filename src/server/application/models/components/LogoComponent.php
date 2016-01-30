<?php

require_once APPPATH.'models/components/BaseComponent.php';

class LogoComponent extends BaseComponent {

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/logo');

    $this->addInlineStylesheet('/styles/components/logo/logo-inline.css');
    $this->addRemoteStylesheet('/styles/components/logo/logo-remote.css');
  }
}

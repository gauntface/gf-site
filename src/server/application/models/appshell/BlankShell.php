<?php

require_once APPPATH.'models/appshell/BaseShell.php';

class BlankShell extends BaseShell {

  public function __construct() {
    parent::__construct('default');

    $this->load->model('layouts/PageContainerLayout');

    $this->addComponent($this->PageContainerLayout);

    $this->addInlineStylesheet('/styles/appshell/default-inline.css');
    $this->addInlineStylesheet('/styles/appshell/default-utils.css');

    $this->addRemoteStylesheet('/styles/appshell/default-remote.css');
  }
}

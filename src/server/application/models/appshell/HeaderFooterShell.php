<?php

require_once APPPATH.'models/appshell/BaseShell.php';

class HeaderFooterShell extends BaseShell {

  public function __construct() {
    parent::__construct('headerfooter');

    $this->addInlineStylesheet('/styles/appshell/default-inline.css');
    $this->addInlineStylesheet('/styles/appshell/default-utils.css');

    $this->load->model('components/AppBarComponent');
    $this->load->model('components/FooterComponent');
    $this->load->model('layouts/PageContainerLayout');

    $this->addComponent($this->AppBarComponent);
    $this->addComponent($this->PageContainerLayout);
    $this->addComponent($this->FooterComponent);
  }
}

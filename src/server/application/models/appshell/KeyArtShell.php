<?php

require_once APPPATH.'models/appshell/BaseShell.php';

class KeyArtShell extends BaseShell {

  public function __construct() {
    parent::__construct('keyart');

    $this->addInlineStylesheet('/styles/appshell/default.css');
    $this->addInlineStylesheet('/styles/appshell/default-utils.css');
    $this->addRemoteScript('/scripts/bootstrap.js');

    $this->load->model('components/AppBarComponent');
    $this->load->model('components/FooterComponent');
    $this->load->model('layouts/PageContainerLayout');
    $this->load->model('layouts/KeyArtContentLayout');

    $this->FooterComponent->isSubtleUI(true);

    $this->KeyArtContentLayout->addComponent($this->PageContainerLayout);
    $this->KeyArtContentLayout->addComponent($this->FooterComponent);

    $this->addComponent($this->AppBarComponent);
    $this->addComponent($this->KeyArtContentLayout);
  }

  public function getLayout() {
    return $this->KeyArtContentLayout;
  }
}

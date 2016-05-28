<?php

require_once APPPATH.'models/appshell/BaseShell.php';

class AdminShell extends BaseShell {

  public function __construct() {
    parent::__construct('adminshell');

    $this->load->model('components/AppBarComponent');
    $this->load->model('data/appbar/AdminAppBarModel');
    $this->load->model('layouts/PageContainerLayout');

    $this->AppBarComponent->setLeftMenuItems($this->AdminAppBarModel->getLeftMenuItems());

    $this->addComponent($this->AppBarComponent);
    $this->addComponent($this->PageContainerLayout);

    $this->addInlineStylesheet('/styles/appshell/default.css');
    $this->addInlineStylesheet('/styles/appshell/default-utils.css');
    $this->addInlineStylesheet('/styles/appshell/admin.css');
  }
}

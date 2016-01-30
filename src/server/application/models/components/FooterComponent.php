<?php

require_once APPPATH.'models/components/BaseComponent.php';

class FooterComponent extends BaseComponent {

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/footer');

    $this->addInlineStylesheet('/styles/components/footer/footer-inline.css');
    $this->addInlineStylesheet('/styles/components/toggle/toggle-inline.css');
  }

  public function isSubtleUI($isSubtle) {
    if ($isSubtle) {
      $this->removeInlineStylesheet('/styles/components/footer/footer-inline.css');
      $this->addInlineStylesheet('/styles/components/footer/footer-subtle-inline.css');
    } else {
      $this->removeInlineStylesheet('/styles/components/footer/footer-subtle-inline.css');
      $this->addInlineStylesheet('/styles/components/footer/footer-inline.css');
    }
  }
}

<?php

require_once APPPATH.'models/components/BaseComponent.php';

class AppBarComponent extends BaseComponent {

  protected $_leftMenuElements;

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/appbar');

    $this->addInlineStylesheet('/styles/components/appbar/appbar-inline.css');
    $this->addRemoteStylesheet('/styles/components/appbar/appbar-remote.css');

    $this->load->model('data/appbar/DefaultAppBarModel');
    $this->_leftMenuElements = $this->DefaultAppBarModel->getLeftMenuItems();
  }

  public function setSelectedItem($itemName) {
    if(!$this->_leftMenuElements[$itemName]) {
      log_message('error', 'AppBarModel: No found in menu called \''.$itemName.'\'');
      return;
    }

    $this->_leftMenuElements[$itemName]['isSelected'] = true;
  }

  public function getLeftMenuItems() {
    return $this->_leftMenuElements;
  }

  public function setLeftMenuItems($newItems) {
    $this->_leftMenuElements = $newItems;
  }
}

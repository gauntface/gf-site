<?php

class AppBarModel extends CI_Model {

  protected $_leftMenuElements;

  function __construct() {
    // Call the Model constructor
    parent::__construct();

    $this->_leftMenuElements = array(
      'home'  => array(
          'title' => 'Home',
          'link' => '/'
      ),
      'about' => array(
          'title' => 'About',
          'link' => '/about'
      ),
      'blog' => array(
          'title' => 'Blog',
          'link' => '#'
      ),
      'contact' => array(
          'title' => 'Contact',
          'link' => '#'
      ),
    );
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
}

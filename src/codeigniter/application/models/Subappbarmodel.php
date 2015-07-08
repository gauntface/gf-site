<?php

class SubAppBarModel extends CI_Model {

  protected $_title;
  protected $_rightMenuElements;

  function __construct($title = null, $menuElements = null) {
    // Call the Model constructor
    parent::__construct();

    $this->_title = $title;
    $this->_rightMenuElements = $menuElements;
  }

  public function getTitle() {
    return $this->_title;
  }

  public function getRightMenuItems() {
    return $this->_rightMenuElements;
  }
}

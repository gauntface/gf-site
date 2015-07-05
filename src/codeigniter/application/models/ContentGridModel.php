<?php

class ContentGridModel extends CI_Model {

  private $_rightContentView;

  function __construct() {
    // Call the Model constructor
    parent::__construct();
  }

  public function setRightContentView($rightContentView) {
    $this->_rightContentView = $rightContentView;
  }

  public function getRightContentView() {
    return $this->_rightContentView;
  }
}

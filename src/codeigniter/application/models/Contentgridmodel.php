<?php

class ContentGridModel extends CI_Model {

  private $_rightContentView;

  function __construct($data = null) {
    // Call the Model constructor
    parent::__construct();

    $this->_contentData = $data;
  }

  public function setRightContentView($rightContentView) {
    $this->_rightContentView = $rightContentView;
  }

  public function getRightContentView() {
    return $this->_rightContentView;
  }

  public function getContentData() {
    return $this->_contentData;
  }
}

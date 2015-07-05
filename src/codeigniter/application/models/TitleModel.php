<?php

class TitleModel extends CI_Model {

  private $_title;
  private $_description;
  private $_date;
  private $_smallTopText;
  private $_backgroundImage;
  private $_isPadded;

  function __construct() {
    // Call the Model constructor
    parent::__construct();
  }

  public function setTitle($title) {
    $this->_title = $title;
  }

  public function getTitle() {
    return $this->_title;
  }

  public function setDescription($description) {
    $this->_description = $description;
  }

  public function getDescription() {
    return $this->_description;
  }

  public function setDate() {
    $this->_date = '29.06.2015';
  }

  public function getDate() {
    return $this->_date;
  }

  public function getSmallTopText() {
    return $this->_smallTopText;
  }

  public function setBackgroundImage($imageUrl) {
    $this->_backgroundImage = $imageUrl;
  }

  public function getBackgroundImage() {
    return $this->_backgroundImage;
  }

  public function makePadded($isPadded) {
    $this->_isPadded = $isPadded;
  }

  public function isPadded() {
    return $this->_isPadded;
  }
}

<?php

class TitleModel extends CI_Model {

  private $_title;
  private $_description;
  private $_time;
  private $_smallTopText;
  private $_fullbleedBackgroundImg;
  private $_fullbleedBackgroundColor;
  private $_smallBackgroundImage;
  private $_useLightDivider;
  private $_isPadded;
  private $_linkHref;

  function __construct() {
    // Call the Model constructor
    parent::__construct();

    $_useLightDivider = false;
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

  public function setTime($time) {
    $this->_time = $time;
  }

  public function getTime() {
    return $this->_time;
  }

  public function setSmallTopText($smallTopText) {
    $this->_smallTopText = $smallTopText;
  }

  public function getSmallTopText() {
    return $this->_smallTopText;
  }

  public function setSmallBackgroundImage($imageUrl) {
    $this->_smallBackgroundImage = $imageUrl;
  }

  public function getSmallBackgroundImage() {
    return $this->_smallBackgroundImage;
  }

  public function setFullbleedBackgroundImage($imageUrl) {
    $this->_fullbleedBackgroundImg = $imageUrl;
  }

  public function getFullbleedBackgroundImage() {
    return $this->_fullbleedBackgroundImg;
  }

  public function setFullbleedBackgroundColor($color) {
    $this->_fullbleedBackgroundColor = $color;
  }

  public function getFullbleedBackgroundColor() {
    return $this->_fullbleedBackgroundColor;
  }

  public function makePadded($isPadded) {
    $this->_isPadded = $isPadded;
  }

  public function isPadded() {
    return $this->_isPadded;
  }

  public function setLinkURL($url) {
    $this->_linkHref = $url;
  }

  public function getLinkURL() {
    return $this->_linkHref;
  }

  public function setUseLightDivider($useLightDivider) {
    $this->_useLightDivider = $useLightDivider;
  }

  public function useLightDivider() {
    return $this->_useLightDivider;
  }

  public function getClassName() {
    $this->load->helper('slug');

    return slugify($this->getTitle());
  }
}

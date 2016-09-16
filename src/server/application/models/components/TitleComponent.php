<?php

require_once APPPATH.'models/components/BaseComponent.php';

class TitleComponent extends BaseComponent {

  private $_title;
  private $_description;
  private $_time;
  private $_smallTopText;
  private $_fullbleedBackgroundImg;
  private $_fullbleedBackgroundColor;
  private $_smallBackgroundImage;
  private $_useLightDivider;
  private $_isPadded;
  private $_isTransparent;
  private $_linkHref;
  private $_className;

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/title-block');

    $this->load->helper('slug');
    $this->load->helper('file');

    $this->addInlineStylesheet('/styles/components/title-block/title-block-inline.css');
    $this->addInlineStylesheet('/styles/components/dividers/dividers-inline.css');

    $this->_useLightDivider = false;
    $this->_isTransparent = true;
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

    if ($this->_smallBackgroundImage) {
      $imgPathinfo = pathinfo($this->getSmallBackgroundImage());
      if (
        isset($imgPathinfo['dirname']) &&
        isset($imgPathinfo['filename']) &&
        isset($imgPathinfo['extension'])
      ) {
        $smallBGCSS = read_file('./styles/components/title-block/title-block-greyscale-bg-img-remote.css');
        $smallBGCSS = str_replace('.class-name', '.'.$this->getClassName().' .title-block__content', $smallBGCSS);
        $smallBGCSS = str_replace('{{img-url}}', $imgPathinfo['dirname'].'/'.$imgPathinfo['filename'], $smallBGCSS);
        $smallBGCSS = str_replace('{{img-extension}}', $imgPathinfo['extension'], $smallBGCSS);

        $this->addRemoteRawCSS($smallBGCSS);
      }
    }
  }

  public function getSmallBackgroundImage() {
    return $this->_smallBackgroundImage;
  }

  public function setFullbleedBackgroundImage($imageUrl) {
    $this->_fullbleedBackgroundImg = $imageUrl;

    if ($this->_fullbleedBackgroundImg) {
      $imgPathinfo = pathinfo($this->getFullbleedBackgroundImage());
      if (
        isset($imgPathinfo['dirname']) &&
        isset($imgPathinfo['filename']) &&
        isset($imgPathinfo['extension'])
      ) {
        $remoteFullbleedBGCSS = read_file('./styles/components/title-block/title-block-fullbleed-bg-img-remote.css');
        $remoteFullbleedBGCSS = str_replace('.class-name', '.'.$this->getClassName(), $remoteFullbleedBGCSS);
        $remoteFullbleedBGCSS = str_replace('{{img-url}}', $imgPathinfo['dirname'].'/'.$imgPathinfo['filename'], $remoteFullbleedBGCSS);
        $remoteFullbleedBGCSS = str_replace('{{img-extension}}', $imgPathinfo['extension'], $remoteFullbleedBGCSS);
        $this->addRemoteRawCSS($remoteFullbleedBGCSS);
      }
    }
  }

  public function getFullbleedBackgroundImage() {
    return $this->_fullbleedBackgroundImg;
  }

  public function setFullbleedBackgroundColor($color) {
    $this->_fullbleedBackgroundColor = $color;

    $inlineFullbleedBGCSS = read_file('./styles/components/title-block/title-block-fullbleed-bg-img-inline.css');
    $inlineFullbleedBGCSS = str_replace('.class-name', '.'.$this->getClassName(), $inlineFullbleedBGCSS);
    $inlineFullbleedBGCSS = str_replace('\'{{bg-color}}\'', $this->getFullbleedBackgroundColor(), $inlineFullbleedBGCSS);
    $this->addInlineRawCSS($inlineFullbleedBGCSS);
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

  public function setIsTransparent($transparent) {
    $this->_isTransparent = $transparent;
  }

  public function isTransparent() {
    return $this->_isTransparent;
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

  public function setClassName($className) {
    $this->_className = $className;
  }

  public function getClassName() {
    if ($this->_className) {
      return $this->_className;
    }

    return slugify($this->getTitle());
  }
}

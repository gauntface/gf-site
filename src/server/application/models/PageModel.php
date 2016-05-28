<?php

require_once APPPATH.'models/layouts/BaseLayout.php';

class PageModel extends BaseLayout {
  private $DEFAULT_TITLE = 'Gaunt Face | Matt Gaunt';
  private $DEFAULT_DESCRIPTION = 'This is the site for Matt Gaunt, a ' .
    'Developer Programs Engineer at Google. This site is just a list of ' .
    'things he\'s been up to including blog, projects, video series and talks.';
  private $DEFAULT_THEME_COLOR = '#1E1621';
  private $DEFAULT_EXPIRY_TIME = (24 * 60 * 60);

  private $_expiryTimeInSeconds;
  private $_themeColor;
  private $_title;
  private $_description;
  private $_pageId;
  private $_controllerDepth;
  private $_shouldIndex = true;

  private $_remoteScripts;

  public function __construct() {
    parent::__construct(null);

    $this->_expiryTimeInSeconds = $this->DEFAULT_EXPIRY_TIME;
    $this->_themeColor = $this->DEFAULT_THEME_COLOR;
    $this->_controllerDepth = 1;

    $this->_remoteScripts = [];
  }

  public function loadView($returnString = false) {
    $result = '';
    $allComponents = $this->getComponents();
    foreach($allComponents as $components) {
      $loadViewOutput = $components->loadView($returnString);
      if ($returnString) {
        $result .= $loadViewOutput;
      }
    }
    return $result;
  }

  public function setId($newId) {
    $this->_pageId = $newId;
  }

  public function getId() {
    return $this->_pageId;
  }

  // TODO: Would be great to figure out an auto way to set this
  public function setControllerDepth($controllerDepth) {
    $this->_controllerDepth = $controllerDepth;
  }

  public function setExpiryTimeInSeconds($seconds) {
    $this->_expiryTimeInSeconds = $seconds;
  }

  public function getExpiryTimeInSeconds() {
    return $this->_expiryTimeInSeconds;
  }

  public function getExpiryDate() {
    $expiresTime = time() + $this->getExpiryTimeInSeconds();
    return gmdate('D, d M Y H:i:s', $expiresTime);
  }

  public function getThemeColor() {
    return $this->_themeColor;
  }

  public function setThemeColor($newColor) {
    if ($newColor) {
      $this->_themeColor = $newColor;
    }
  }

  public function getTitle() {
    if(isset($this->_title) && strlen($this->_title) > 0) {
      return $this->_title . ' - ' . $this->DEFAULT_TITLE;
    }

    return $this->DEFAULT_TITLE;
  }

  public function setTitle($title) {
    $this->_title = $title;
  }

  public function getDescription() {
    if(isset($this->_description) && strlen($this->_description) > 0) {
      return $this->_description;
    }

    return $this->DEFAULT_DESCRIPTION;
  }

  public function setDescription($description) {
    $this->_description = $description;
  }

  public function addRemoteScript($remoteScript) {
    array_push($this->_remoteScripts, $remoteScript);
  }

  public function getRemoteScripts() {
    return $this->_remoteScripts;
  }

  public function setShouldIndex($index) {
    $this->_shouldIndex = $index;
  }

  public function shouldIndex() {
    return $this->_shouldIndex;
  }
}

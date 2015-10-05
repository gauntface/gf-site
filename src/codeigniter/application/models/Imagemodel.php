<?php

class ImageModel extends CI_Model {

  private $_isAutoGenerated = FALSE;
  private $_width = 0;
  private $_height = 0;
  private $_density = 1;
  private $_imageDirectory = '';
  private $_filename;
  private $_fileExtension;
  private $_finalLocation;

  function __construct($requestUrl = null) {
    // Call the Model constructor
    parent::__construct();

    if ($requestUrl == null) {
      return;
    }

    $pathinfo = pathinfo($requestUrl);
    $this->_fileExtension = $pathinfo["extension"];
    $this->_filename = $pathinfo["filename"];
    $this->_imageDirectory = $pathinfo['dirname'].'/';

    $pattern = '/(?P<origfilename>.+)_(?P<width>\d+)x(?P<height>\d+)x(?P<density>\d+)/';
    $patternFound = preg_match($pattern, $pathinfo["filename"], $matches);
    if ($patternFound == 0) {
      return;
    }

    $this->_isAutoGenerated = TRUE;

    $this->_width = $this->sanitiseSize($matches["width"]);
    $this->_height = $this->sanitiseSize($matches["height"]);
    $this->_density = $this->sanitiseDensity($matches["density"]);
    $this->_filename = $matches["origfilename"];
  }

  function isAutoGenerated() {
    return $this->_isAutoGenerated;
  }

  function getDesiredWidth() {
    return $this->_width;
  }

  function getDesiredHeight() {
    return $this->_height;
  }

  function getDesiredDensity() {
    return $this->_density;
  }

  function getOriginalStoragePath() {
    return $this->_imageDirectory.$this->_filename.'.'.$this->_fileExtension;
  }

  function getCloudStoragePath() {
    $storagePath = $this->getOriginalStoragePath();
    if ($this->isAutoGenerated()) {
      $storagePath = $this->getCloudStorageDirectory().
        $this->_filename."_".$this->getDesiredWidth()."x".$this->getDesiredHeight()."x".$this->getDesiredDensity().".".$this->_fileExtension;
    }
    return $storagePath;
  }

  function getCloudStorageDirectory() {
    $storageDirectory = $this->_imageDirectory;
    if ($this->isAutoGenerated()) {
      $storageDirectory = 'generated/'.$this->_imageDirectory;
    }
    return $storageDirectory;
  }

  private function sanitiseSize($value) {
    $remainder = $value % 50;
    if($remainder != 0) {
      $value += (50 - $remainder);
    } else {
    }
    return $value;
  }

  private function sanitiseDensity($value) {
    $value = round($value, 0, PHP_ROUND_HALF_DOWN);
    if($value < 1) {
      $value = 1;
    } else if ($value > 4) {
      $value = 4;
    }
    return $value;
  }

}
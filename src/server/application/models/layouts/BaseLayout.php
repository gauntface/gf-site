<?php

require_once APPPATH.'models/components/BaseComponent.php';

class BaseLayout extends BaseComponent {

  private $_components;

  function __construct($viewPath) {
    // Call the Model constructor
    parent::__construct($viewPath);

    $this->_components = [];
  }

  public function addComponent($component) {
    array_push($this->_components, $component);
  }

  public function getComponents() {
    return $this->_components;
  }

  // Get all stylesheets for components as well as layout itself
  public function getInlineStylesheets() {
    $stylesheets = [];

    $allComponents = $this->getComponents();
    foreach($allComponents as $component) {
      $stylesheets = array_merge($stylesheets, $component->getInlineStylesheets());
    }

    $stylesheets = array_merge($stylesheets, parent::getInlineStylesheets());

    return $stylesheets;
  }

  // Get all stylesheets for components as well as layout itself
  public function getRemoteStylesheets() {
    $stylesheets = [];
    $allComponents = $this->getComponents();
    foreach($allComponents as $component) {
      $stylesheets = array_merge($stylesheets, $component->getRemoteStylesheets());
    }
    $stylesheets = array_merge($stylesheets, parent::getRemoteStylesheets());
    return $stylesheets;
  }

  // Get all stylesheets for components as well as layout itself
  public function getInlineRawCSS() {
    $rawCSS = [];
    $allComponents = $this->getComponents();
    foreach($allComponents as $component) {
      $rawCSS = array_merge($rawCSS, $component->getInlineRawCSS());
    }
    $rawCSS = array_merge($rawCSS, parent::getInlineRawCSS());
    return $rawCSS;
  }

  // Get all stylesheets for components as well as layout itself
  public function getRemoteRawCSS() {
    $rawCSS = [];
    $allComponents = $this->getComponents();
    foreach($allComponents as $component) {
        $rawCSS = array_merge($rawCSS, $component->getRemoteRawCSS());
    }
    $rawCSS = array_merge($rawCSS, parent::getRemoteRawCSS());
    return $rawCSS;
  }
}

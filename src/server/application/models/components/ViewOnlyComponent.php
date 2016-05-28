<?php

require_once APPPATH.'models/components/BaseComponent.php';

class ViewOnlyComponent extends BaseComponent {

  protected $_viewPath;
  private $_viewData;

  function __construct() {
    // Call the Model constructor
    parent::__construct(null);
  }

  public function setView($view) {
    $this->_viewPath = $view;
  }

  public function setData($data) {
    $this->_viewData = $data;
  }

  public function loadView($returnString = false) {
    return $this->load->view($this->_viewPath, array('model' => $this->_viewData), $returnString);
  }
}

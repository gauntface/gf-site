<?php

require_once APPPATH.'models/components/BaseComponent.php';

class MarkdownComponent extends BaseComponent {

  private $_viewPath;
  private $_markdown;

  function __construct() {
    // Call the Model constructor
    parent::__construct(null);

    $this->load->library('Standardmarkdownparser');

    $this->_viewPath = 'components/markdown';
  }

  public function setMarkdown($markdown) {
    $this->_markdown = $this->standardmarkdownparser->text($markdown);
  }

  public function getInlineStylesheets() {
    return $this->_markdown["inlineStyles"];
  }

  public function loadView($returnString = false) {
    return $this->load->view($this->_viewPath, array('markdown' => $this->_markdown), $returnString);
  }
}

<?php

class BlogPostModel extends CI_Model {

  private $_blogPostQuery;

  function __construct($blogPostQuery = null) {
    // Call the Model constructor
    parent::__construct();

    if($blogPostQuery) {
      log_message('error', $blogPostQuery);
    }

    $this->_blogPostQuery = $blogPostQuery;
  }

}

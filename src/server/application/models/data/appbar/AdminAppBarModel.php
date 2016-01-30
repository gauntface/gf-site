<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class AdminAppBarModel extends CI_Model {

  private $_leftMenuElements;

  function __construct() {
    $this->_leftMenuElements = array(
      'home'  => array(
          'title' => 'Home',
          'link' => '/admin/home',
          'pageid' => 'admin-home-index'
      ),
      'blog' => array(
          'title' => 'Blog',
          'link' => '/admin/blog',
          'pageid' => 'admin-blog-index'
      ),
      'push' => array(
          'title' => 'Push',
          'link' => '/admin/push',
          'pageid' => 'admin-push-index'
      ),
      'cache' => array(
          'title' => 'Reset Cache',
          'link' => '/admin/cache',
          'pageid' => 'admin-cache-index'
      ),
    );
  }

  public function getLeftMenuItems() {
    return $this->_leftMenuElements;
  }
};

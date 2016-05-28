<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class DefaultAppBarModel extends CI_Model {

  private $_leftMenuElements;

  function __construct() {
    $this->_leftMenuElements = array(
      'home'  => array(
          'title' => 'Home',
          'link' => '/',
          'pageid' => 'home-index'
      ),
      'about' => array(
          'title' => 'About',
          'link' => '/about',
          'pageid' => 'about-index'
      ),
      'blog' => array(
          'title' => 'Blog',
          'link' => '/blog',
          'pageid' => 'blog-index'
      ),
      'contact' => array(
          'title' => 'Contact',
          'link' => '/contact',
          'pageid' => 'contact-index'
      ),
    );
  }

  public function getLeftMenuItems() {
    return $this->_leftMenuElements;
  }
};

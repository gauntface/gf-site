<?php

class SinglePostModel extends CI_Model {

  private $_id;
  private $_title;
  private $_excerpt;
  private $_markdown;
  private $_greyScaleImg;
  private $_mainImg;
  private $_mainImgBGColor;

  function __construct($blogPostQuery = null) {
    // Call the Model constructor
    parent::__construct();

    $this->load->library('md');

    if($blogPostQuery) {
      $this->_id = $blogPostQuery->post_id;
      $this->_title = $blogPostQuery->post_title;
      $this->_excerpt = $blogPostQuery->post_excerpt;
      $this->_markdown = $blogPostQuery->post_markdown;
      $this->_greyScaleImg = $blogPostQuery->post_grey_scale_img;
      $this->_mainImg = $blogPostQuery->post_main_img;
      $this->_mainImgBGColor = $blogPostQuery->post_main_img_bg_color;
    }
  }

  public function setPostId($id) {
    $this->_id = $id;
  }

  public function getPostId() {
    return $this->_id;
  }

  public function setTitle($title) {
      $this->_title = urldecode($title);
  }

  public function getTitle() {
    return $this->_title;
  }

  public function setExcerptMarkdown($excerpt) {
      $this->_excerpt = urldecode($excerpt);
  }

  public function getExcerptMarkdown() {
    return $this->_excerpt;
  }

  public function setGreyScaleImg($img) {
    $this->_greyScaleImg = $img;
  }

  public function getGreyScaleImg() {
    return $this->_greyScaleImg;
  }

  public function setMainImg($img) {
    $this->_mainImg = $img;
  }

  public function getMainImg() {
    return $this->_mainImg;
  }

  public function setMainImgBgColor($color) {
    $this->_mainImgBGColor;
  }

  public function getMainImgBgColor() {
    if (!isset($this->_mainImgBGColor)) {
      return '#333333';
    }
    return $this->_mainImgBGColor;
  }

  public function setContentMarkdown($markdown) {
    $this->_markdown = urldecode($markdown);
  }

  public function getContentMarkdown() {
    return $this->_markdown;
  }

  public function getId() {
    return $this->_id;
  }

  public function getExcerptHTML() {
    return $this->md->defaultTransform(urldecode($this->getExcerptMarkdown()));
  }

  public function getContentHTML() {
    return $this->md->defaultTransform(urldecode($this->getContentMarkdown()));
  }
}

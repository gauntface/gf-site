<?php

class SinglePostModel extends CI_Model {

  private $_id;
  private $_title;
  private $_slug;
  private $_excerpt;
  private $_markdown;
  private $_greyScaleImg;
  private $_mainImg;
  private $_mainImgBGColor;
  private $_postStatus;
  private $_publishTime;
  private $_author;

  function __construct($blogPostQuery = null) {
    // Call the Model constructor
    parent::__construct();

    $this->load->helper('url');
    $this->load->library('Parsedown');

    if($blogPostQuery) {
      $objects = get_object_vars($blogPostQuery);

      $this->_id = urldecode($blogPostQuery->post_id);
      $this->_title = urldecode($blogPostQuery->post_title);
      $this->_slug = urldecode($blogPostQuery->post_slug);
      $this->_excerpt = urldecode($blogPostQuery->post_excerpt);
      $this->_markdown = urldecode($blogPostQuery->post_markdown);
      $this->_greyScaleImg = urldecode($blogPostQuery->post_grey_scale_img);
      $this->_mainImg = urldecode($blogPostQuery->post_main_img);
      $this->_mainImgBGColor = urldecode($blogPostQuery->post_main_img_bg_color);
      $this->_postStatus = urldecode($blogPostQuery->post_status);
      $this->_publishTime = strtotime(urldecode($blogPostQuery->publish_date));
      $this->_author = urldecode($blogPostQuery->post_author);
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
    $this->_mainImgBGColor = $color;
  }

  public function getMainImgBgColor() {
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
    return $this->parsedown->text(urldecode($this->getExcerptMarkdown()));
  }

  public function getContentHTML() {
    return $this->parsedown->text(urldecode($this->getContentMarkdown()));
  }

  public function getPostStatus() {
    return $this->_postStatus;
  }

  public function isPublished() {
    return $this->_postStatus == 'published';
  }

  public function getPublishTime() {
    return $this->_publishTime;
  }

  public function getSlug() {
    return $this->_slug;
  }

  public function getAuthor() {
    return $this->_author;
  }

  public function getPublicURL() {
    if ($this->getPublishTime() == null) {
      return null;
    }

    return '/blog/'.
      date("Y", $this->getPublishTime()).'/'.
      date("m", $this->getPublishTime()).'/'.
      date("d", $this->getPublishTime()).'/'.
      $this->getSlug();
  }
}

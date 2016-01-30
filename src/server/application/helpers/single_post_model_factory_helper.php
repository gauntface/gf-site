<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function singlePostModelFactory($data) {
  // Get a reference to the controller object
  $CI = get_instance();

  $CI->load->model('blog/SinglePostModel');

  $singlePostModel = new SinglePostModel();

  if (!empty($data['postId'])) {
      $singlePostModel->setPostId(urldecode($data['postId']));
  }

  if (!empty($data['title'])) {
      $singlePostModel->setTitle(urldecode($data['title']));
  }

  if (!empty($data['excerpt'])) {
      $singlePostModel->setExcerptMarkdown(urldecode($data['excerpt']));
  }

  if (!empty($data['markdown'])) {
    $singlePostModel->setContentMarkdown(urldecode($data['markdown']));
  }

  if (!empty($data['greyScaleImg'])) {
    $singlePostModel->setGreyScaleImg(urldecode($data['greyScaleImg']));
  }

  if (!empty($data['mainImg'])) {
    $singlePostModel->setMainImg(urldecode($data['mainImg']));
  }

  if (!empty($data['mainImgBGColor'])) {
    $singlePostModel->setMainImgBgColor(urldecode($data['mainImgBGColor']));
  }

  return $singlePostModel;
}

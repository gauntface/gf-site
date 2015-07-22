<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function singlePostModelFactory($data) {
  // Get a reference to the controller object
  $CI = get_instance();

  $CI->load->model('blog/SinglePostModel');

  $singlePostModel = new SinglePostModel();

  if (!empty($data['postId'])) {
      $singlePostModel->setPostId(urldecode($data['postId']));
      log_message('error', 'ID: '.$singlePostModel->getPostId());
  }

  if (!empty($data['title'])) {
      $singlePostModel->setTitle(urldecode($data['title']));
      log_message('error', 'title: '.$singlePostModel->getTitle());
  }

  if (!empty($data['excerpt'])) {
      $singlePostModel->setExcerpt(urldecode($data['excerpt']));
      log_message('error', 'excerpt: '.$singlePostModel->getExcerpt());
  }

  if (!empty($data['markdown'])) {
    $singlePostModel->setMarkdown(urldecode($data['markdown']));
    log_message('error', 'markdown: '.$singlePostModel->getMarkdown());
  }

  if (!empty($data['greyScaleImg'])) {
    $singlePostModel->setGreyScaleImg(urldecode($data['greyScaleImg']));
    log_message('error', 'greyScaleImg: '.$singlePostModel->getGreyScaleImg());
  }

  if (!empty($data['mainImg'])) {
    $singlePostModel->setMainImg(urldecode($data['mainImg']));
    log_message('error', 'mainImg: '.$singlePostModel->getMainImg());
  }

  return $singlePostModel;
}

<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function swapStylesheetImages($content) {
  $CI =& get_instance();
  $CI->load->model('CloudStorageModel');
  $CI->load->model('ImageModel');

  $matchesCount = preg_match_all("/background-image:[\s]?url\(\"(\/static\/image\/([^\"]*))\"\)/", $content, $output_array);
  if ($matchesCount != 0) {
    // The regular expression didn't work, it must be a path to the original image required
    for ($i = 0; $i < $matchesCount; $i++) {
      $imgPath = $output_array[2][$i];
      $imageObject = new ImageModel($imgPath);
      if ($CI->CloudStorageModel->doesImageExist($imageObject->getCloudStoragePath()) == false) {
        continue;
      }

      $cloudStorageUrl = $CI->CloudStorageModel->getCloudStorageUrl($imageObject->getCloudStoragePath());
      $content = str_replace($output_array[1][$i], $cloudStorageUrl, $content);
    }
  }
  return $content;
}

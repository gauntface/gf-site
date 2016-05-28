<?php

require_once APPPATH.'models/layouts/BaseLayout.php';

class KeyArtContentLayout extends BaseLayout {

  function __construct() {
    // Call the Model constructor
    parent::__construct('layouts/key-art-content');

    $this->addInlineStylesheet('/styles/layouts/key-art-content/key-art-content-inline.css');
  }

  // Add to raw inline
  public function getBGColorCSS($bgColor) {
    $bgColorCSS = read_file('./styles/layouts/key-art-content/key-art-content-bg-inline.css');
    $bgColorCSS = str_replace('\'{{keyart-bg-color}}\'', $bgColor, $bgColorCSS);
    return $bgColorCSS;
  }

  // Add to raw remote
  public function getMainImgCSS($imageUrl) {
    $imageCSS = '';
    if ($imageUrl) {
      $imgPathinfo = pathinfo($imageUrl);
      if (
        isset($imgPathinfo['dirname']) &&
        isset($imgPathinfo['filename']) &&
        isset($imgPathinfo['extension'])
      ) {
        $imageCSS = read_file('./styles/layouts/key-art-content/key-art-content-bg-remote.css');
        $imageCSS = str_replace('{{img-url}}', $imgPathinfo['dirname'].'/'.$imgPathinfo['filename'], $imageCSS);
        $imageCSS = str_replace('{{img-extension}}', $imgPathinfo['extension'], $imageCSS);
      }
    }
    return $imageCSS;
  }
}

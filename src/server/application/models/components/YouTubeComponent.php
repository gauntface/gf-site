<?php

require_once APPPATH.'models/components/BaseComponent.php';

class YouTubeComponent extends BaseComponent {

  function __construct() {
    // Call the Model constructor
    parent::__construct('components/youtube-block');

    $this->addInlineStylesheet('/styles/components/youtube-block/youtube-block-inline.css');
    $this->addRemoteStylesheet('/styles/components/youtube-block/youtube-block-remote.css');
  }
}

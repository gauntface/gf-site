<?php
  use lithium\net\http\Media;

  $this->title($title);

  echo $this->_view->render(['element' => 'home-header']);
  echo $this->_view->render(['element' => 'title-block'], array(
    'smallTopText' => 'Example',
    'title' => 'Woohoo.',
    'excerpt' => 'Example description of stuff.'
  ));
?>

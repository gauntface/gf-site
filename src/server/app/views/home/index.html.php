<?php
  use lithium\net\http\Media;

  $this->title($title);

  foreach ($elements as $elementDetails) {
    if (!array_key_exists('data', $elementDetails)) {
      $elementDetails['data'] = array();
    }

    echo $this->_view->render(['element' => $elementDetails['id']], $elementDetails['data']);
  }
?>

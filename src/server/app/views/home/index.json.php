<?php
  use lithium\net\http\Media;

  foreach ($elements as $elementDetails) {
    if (!array_key_exists('data', $elementDetails)) {
      $elementDetails['data'] = array();
    }

    $renderedView = $this->_view->render(['element' => $elementDetails['id']], $elementDetails['data']);
    echo $renderedView;
  }
?>

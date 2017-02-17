<?php
  use lithium\net\http\Media;

  $this->title($title);

  $content = '';
  foreach ($elements as $elementDetails) {
    if (!array_key_exists('data', $elementDetails)) {
      $elementDetails['data'] = array();
    }

    $content = $content.$this->_view->render(['element' => $elementDetails['id']], $elementDetails['data']);
  }

  echo $this->_view->render(['element' => 'shells/'.$shell], array('content' => $content));
?>

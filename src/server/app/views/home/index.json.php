<?php
  use lithium\net\http\Media;

  $jsonData = array(
    'title' => $title,
    'html' => ''
  );

  foreach ($elements as $elementDetails) {
    if (!array_key_exists('data', $elementDetails)) {
      $elementDetails['data'] = array();
    }

    $renderedView = $this->_view->render(['element' => $elementDetails['id']], $elementDetails['data']);
    $jsonData['html'] = $jsonData['html'].$renderedView;
  }

  echo json_encode($jsonData);
?>

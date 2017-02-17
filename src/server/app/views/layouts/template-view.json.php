<?php
use app\utilities\Styles;
  $metadata = array();
  if (isset($title)) {
    $metadata['title'] = $title;
  }
  if (isset($theme_color)) {
    $metadata['theme_color'] = $theme_color;
  }
  if (isset($shell)) {
    $metadata['shell'] = $shell;
  }

  $styles = Styles::groupStyles($this->styles());
  $jsonData = array(
    'html' => $this->content,
    'styles' => $styles,
    'metadata' => $metadata
  );

  echo json_encode($jsonData);
?>

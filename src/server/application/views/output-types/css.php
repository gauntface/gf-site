<?php
$this->output->set_header('content-type: text/css; charset=utf-8');

if (
  count($appshell['stylesheets']) === 0 && count($appshell['rawCSS']) === 0 &&
  count($page['stylesheets']) === 0 && count($page['rawCSS']) === 0
) {
  return;
}

$this->load->helper('styles_image_swap');

function printCSS($group) {
  $cssToInline = array();
  $stylesheets = $group['stylesheets'];
  foreach($stylesheets as $singleStylesheet) {
    if (!file_exists('.'.$singleStylesheet)) {
      continue;
    }

    array_push($cssToInline, swapStylesheetImages(read_file('.'.$singleStylesheet)));
  }
  $rawCSS = $group['rawCSS'];
  foreach($rawCSS as $css) {
    array_push($cssToInline, swapStylesheetImages($css));
  }

  $cssToInlineString = implode(' ', $cssToInline);
  if (strlen($cssToInlineString) > 0) {
    echo("/**\n".implode("\n", $stylesheets)."\n**/\n");
    echo($cssToInlineString);
  }
}

printCSS($appshell);
printCSS($page);

<?php
$urlArray = array();
foreach ($elements as $elementDetails) {
  if (array_key_exists('variations', $elementDetails)) {
      $index = 0;
      foreach ($elementDetails['variations'] as $variationName => $variationDetails) {
        array_push($urlArray, array(
          'name' => $elementDetails['friendly-name'].': '.$variationName,
          'url' => $elementDetails['view-url'].'/'.$index.'/'
        ));
        $index++;
      }
  } else {
    array_push($urlArray, array(
      'name' => $elementDetails['friendly-name'],
      'url' => $elementDetails['view-url']
    ));
  }
}
?>
<?php echo json_encode($urlArray); ?>

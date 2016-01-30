<?php
$remoteStylesUrl = $document->getRemoteStyleURL();
if (
  $remoteStylesUrl === null ||
  strlen($remoteStylesUrl) === 0) {
  return;
}

$asyncCSSJS = read_file('./scripts/remote-scripts.tmpl.js');
$asyncCSSJS = str_replace('/**@ GF-REMOTE-STYLESHEETS @**/', "'".$remoteStylesUrl."'", $asyncCSSJS);
?>
<script async defer>
  <?php echo($asyncCSSJS); ?>
</script>

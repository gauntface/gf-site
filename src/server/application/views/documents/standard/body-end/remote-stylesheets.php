<?php
$remoteStylesUrl = $document->getRemoteStyleURL();
$remoteStylesString = "";
if (
  $remoteStylesUrl !== null &&
  strlen($remoteStylesUrl) >= 0) {
    $remoteStylesString = "'".$remoteStylesUrl."'";
}

$asyncCSSJS = read_file('./scripts/remote-scripts.tmpl.js');
$asyncCSSJS = str_replace('/**@ GF-REMOTE-STYLESHEETS @**/', $remoteStylesString, $asyncCSSJS);
?>
<script async defer>
  <?php echo($asyncCSSJS); ?>
</script>

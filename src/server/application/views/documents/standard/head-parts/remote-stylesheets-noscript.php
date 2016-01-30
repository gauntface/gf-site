<?php
$remoteStylesUrl = $document->getRemoteStyleURL();
if (
  $remoteStylesUrl === null ||
  strlen($remoteStylesUrl) === 0) {
  return;
}
?>

<noscript>
  <link rel="stylesheet" property="stylesheet" href="<?php echo($remoteStylesUrl); ?>" media="all">
</noscript>

<?php
$scripts = $page->getRemoteScripts();
foreach($scripts as $script) {
  $scriptUrl;
  if(strpos($script, "http") === 0) {
    $scriptUrl = $script;
  } else {
    $scriptUrl = base_url().addRevisionToFilePath($script);
  }
  ?>
  <script src="<?php echo($scriptUrl) ?>" type="text/javascript" async></script>
  <?php
}
?>
  </body>
</html>

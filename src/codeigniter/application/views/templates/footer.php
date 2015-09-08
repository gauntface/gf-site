<?php
  $remoteStylesheets = $page->getRemoteStylesheets();
  if(isset($remoteStylesheets)) {
    ?>
    <script type="text/javascript" async>
      window.GauntFace = window.GauntFace || {};
      window.GauntFace._remoteStylesheets = [
        <?php
          foreach($remoteStylesheets as $singleFile) {
            $length = strlen('http');
            $stylesheetUrl = '';
            if(substr($singleFile, 0, $length) === 'http') {
              $stylesheetUrl = $singleFile;
            } else {
              $stylesheetUrl = base_url().addRevisionToFilePath($singleFile);
            }
          ?>
          '<?php echo($stylesheetUrl); ?>'
          <?php
          }
        ?>
      ];
    </script>
    <?php
  }
?>
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

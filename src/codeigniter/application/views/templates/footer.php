<?php
  $remoteStylesheets = $page->getRemoteStylesheets();
  if(isset($remoteStylesheets)) {
    $parsedStylesheets = [];
    foreach($remoteStylesheets as $singleFile) {
      $stylesheetUrl;

      // If the script starts with HTTP, chances are it's a third party scripts
      if(strpos($singleFile, "http") === 0) {
        $stylesheetUrl = $singleFile;
      } else {
        $stylesheetUrl = addRevisionToFilePath('/' . $singleFile);
      }

      array_push($parsedStylesheets, $stylesheetUrl);
    }

    ?>
    <noscript>
      <?php
      foreach($parsedStylesheets as $stylesheetUrl) {
        ?>
      <link rel="stylesheet" href="<?php echo($stylesheetUrl); ?>" media="all">
        <?php
      }
      ?>
    </noscript>

    <script type="text/javascript" async>
      window.GauntFace = window.GauntFace || {};
      window.GauntFace._remoteStylesheets = [
        <?php
          foreach($parsedStylesheets as $stylesheetUrl) {
          ?>
          '<?php echo($stylesheetUrl); ?>',
          <?php
          }
        ?>
      ];

      if (window.GauntFace.events &&
        window.GauntFace.events.onRemoteStylesheetsAvailable) {
        window.GauntFace.events.onRemoteStylesheetsAvailable();
      }
    </script>
    <?php
  }
?>
<?php
$scripts = $page->getRemoteScripts();
foreach($scripts as $script) {
  $scriptUrl;

  // If the script starts with HTTP, chances are it's a third party scripts
  if(strpos($script, "http") === 0) {
    $scriptUrl = $script;
  } else {
    $scriptUrl = '/'.addRevisionToFilePath($script);
  }
  ?>
  <script src="<?php echo($scriptUrl) ?>" type="text/javascript" async></script>
  <?php
}
?>
  </body>
</html>

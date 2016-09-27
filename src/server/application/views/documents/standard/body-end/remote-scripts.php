<?php
$documentScripts = $document ? $document->getRemoteScripts() : [];
$appshellScripts = $appshell ? $appshell->getRemoteScripts() : [];
$pageScripts = $page ? $page->getRemoteScripts() : [];
$scripts = array_merge($appshellScripts, $pageScripts, $documentScripts);
foreach($scripts as $script) {
  if (!file_exists('.'.$script)) {
    continue;
  }

  $scriptUrl = addRevisionToFilePath($script);
  ?>
  <!-- Async will still block the parser once its executed so try defer if possible -->
  <script src="<?php echo($scriptUrl) ?>" type="text/javascript" async defer></script>
  <?php
}

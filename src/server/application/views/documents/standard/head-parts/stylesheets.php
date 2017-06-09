<?php
if ($appshell) {
  $appshellCSSToInline = $appshell->getAllStylesAsCSS();
  if (strlen($appshellCSSToInline) > 0) {
    $inlineStylesheets = array_unique($appshell->getInlineStylesheets());
    echo("<!--\n".implode("\n", $inlineStylesheets)."\n-->\n");

    echo('<style type="text/css" class="layout-inline-styles">'.$appshellCSSToInline.'</style>');
  }
}

if ($page) {
  $pageCSSToInline = $page->getAllStylesAsCSS();
  if (strlen($pageCSSToInline) > 0) {
    $inlineStylesheets = array_unique($page->getInlineStylesheets());
    echo("<!--\n".implode("\n", $inlineStylesheets)."\n-->\n");

    echo('<style type="text/css" class="content-inline-styles">'.$pageCSSToInline.'</style>');
  }
}
?>
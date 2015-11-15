<?php

  $this->load->helper('file');
  $this->load->helper('styles_image_swap');
  $this->load->helper('revision');
  $this->load->helper('url');

  if ($page->getExpiryTimeInSeconds() > 0) {
    header("Cache-Control: public, must-revalidate, proxy-revalidate");
    header("Cache-Control: max-age=".$page->getExpiryTimeInSeconds(), false);
    header('Expires: ' . $page->getExpiryDate() . ' GMT');
    header("Pragma: public");
  } else {
    header("Cache-Control: no-cache, no-store, must-revalidate");
    header('Expires: 0');
    header("Pragma: no-cache");
  }
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">

    <title><?php echo($page->getTitle()); ?></title>
    <meta name="description" content="<?php echo($page->getDescription()); ?>">
    <meta name='theme-color' content='<?php echo($page->getThemeColor()); ?>'>
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <link href='https://storage.googleapis.com' rel='preconnect' crossorigin>

    <!-- Manifest File -->
    <link rel="manifest" href="/manifest.json">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="RSS Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/rss'); ?>">
    <link rel="alternate" type="application/atom+xml" title="Atom Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/atom'); ?>">

    <!-- Canonical -->
    <link rel="canonical" href="<?php echo("https://gauntface.com/".uri_string()); ?>" />

    <?php if(isset($noindex) && $noindex) {?>
    <meta name="robots" content="noindex">
    <?php } ?>

    <!-- Generic Fav Icons -->
    <?php include('header-sections/generic_header.php'); ?>

    <!-- Schema.org data-->
    <?php include('header-sections/schema_header.php'); ?>

    <!-- IE Specific Tags -->
    <?php include('header-sections/microsoft_header.php'); ?>

    <!-- Apple Specific Tags -->
    <?php include('header-sections/apple_header.php'); ?>

    <!-- Opera Coast -->
    <?php include('header-sections/opera_header.php'); ?>

    <?php
    $inlineStylesheets = $page->getInlineStylesheets();
    $inlineRawCSS = $page->getInlineRawCSS();

    echo('<style type="text/css">');
    if (isset($inlineStylesheets)) {
      foreach($inlineStylesheets as $singleStylesheet) {
        echo(swapStylesheetImages(read_file($singleStylesheet)));
      }
    }

    if(isset($inlineRawCSS)) {
      foreach($inlineRawCSS as $rawCSS) {
        echo(swapStylesheetImages($rawCSS));
      }
    }
    echo('</style>');
    ?>
  </head>
  <body <?php if($page->getBodyClass() != null) {echo('class="'.$page->getBodyClass().'"');} ?>>

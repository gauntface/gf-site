<?php

  $this->load->helper('file');
  $this->load->helper('revision');
  $this->load->helper('url');

  header("Cache-Control: public, must-revalidate, proxy-revalidate");
  header("Cache-Control: max-age=".$page->getExpiryTimeInSeconds(), false);
  header('Expires: ' . $page->getExpiryDate() . ' GMT');
  header("Pragma: public");
?>
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">

    <title><?php echo($page->getTitle()); ?></title>
    <meta name="description" content="<?php echo($page->getDescription()); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name='theme-color' content='<?php echo($page->getThemeColor()); ?>'>

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="RSS Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/rss'); ?>">
    <link rel="alternate" type="application/atom+xml" title="Atom Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/atom'); ?>">

    <!-- Canonical -->
    <link rel="canonical" href="<?php echo(current_url()); ?>" />

    <!-- Manifest File -->
    <link rel="manifest" href="manifest.json">

    <?php if(isset($noindex) && $noindex) {?>
    <meta name="robots" content="noindex">
    <?php } ?>

    <!-- Schema.org data-->
    <?php include('schema_header.php'); ?>

    <!-- IE Specific Tags -->
    <?php include('microsoft_header.php'); ?>

    <!-- Apple Specific Tags -->
    <?php include('apple_header.php'); ?>

    <!-- Generic Fav Icons -->
    <?php include('generic_header.php'); ?>

    <!-- Prefetch -->
    <link rel="dns-prefetch" href="https://www.google-analytics.com">
    <link rel="dns-prefetch" href="https://storage.googleapis.com/">

    <?php
    $inlineStylesheets = $page->getInlineStylesheets();
    $inlineRawCSS = $page->getInlineRawCSS();
    if(isset($inlineStylesheets) || isset($inlineRawCSS)) {
      echo('<style>');
    }

    if (isset($inlineStylesheets)) {
      foreach($inlineStylesheets as $singleStylesheet) {
        echo(read_file($singleStylesheet));
      }
    }

    if(isset($inlineRawCSS)) {
      foreach($inlineRawCSS as $rawCSS) {
        echo($rawCSS);
      }
    }

    if(isset($inlineStylesheets) || isset($inlineRawCSS)) {
      echo('</style>');
    }
    ?>
  </head>
  <body <?php if($page->getBodyClass() != null) {echo('class="'.$page->getBodyClass().'"');} ?>>

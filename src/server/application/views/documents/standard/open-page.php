<?php

$this->load->helper('file');
$this->load->helper('revision');
$this->load->helper('url');

if ($page && $page->getExpiryTimeInSeconds() > 0) {
  header("Cache-Control: public, must-revalidate, proxy-revalidate");
  header("Cache-Control: max-age=".$page->getExpiryTimeInSeconds(), false);
  header('Expires: ' . $page->getExpiryDate() . ' GMT');
  header("Pragma: public");
} else {
  header("Cache-Control: no-cache, no-store, must-revalidate");
  header('Expires: 0');
  header("Pragma: no-cache");
}

$title = $page ? $page->getTitle() : '';
$description = $page ? $page->getDescription() : '';
$themeColor = $page ? $page->getThemeColor() : '';
$shouldIndex = $page ? $page->shouldIndex() : true;
$canonicalLink = (uri_string() == 'document') ? '' : uri_string();
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">

    <title><?php echo($title); ?></title>
    <meta name="description" content="<?php echo($description); ?>">
    <meta name="theme-color" content="<?php echo($themeColor); ?>">
    <meta name="viewport" content="width=device-width,initial-scale=1">

    <link href="https://storage.googleapis.com" rel="preconnect" crossorigin>

    <!-- Manifest File -->
    <link rel="manifest" href="/manifest.json">

    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="RSS Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/rss'); ?>">
    <link rel="alternate" type="application/atom+xml" title="Atom Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/atom'); ?>">

    <!-- Canonical -->
    <link rel="canonical" href="<?php echo("https://gauntface.com/".$canonicalLink); ?>" />

    <!-- Generic Icon -->
    <link rel="shortcut icon" sizes="192x192" href="<?php echo(base_url().addRevisionToFilePath('images/icons/favicon-192.png')); ?>">

    <?php
      // Schema.org data
      include('head-parts/schema.php');
      include('head-parts/stylesheets.php');
      include('head-parts/remote-stylesheets-noscript.php');
    ?>
    <?php if(!$shouldIndex) {?>
    <meta name="robots" content="noindex">
    <?php } ?>
  </head>
  <body>

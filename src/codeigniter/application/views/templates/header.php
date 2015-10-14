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

<?php if ($page->getOutputType() == 'amp') { ?>
<html amp lang="en">
<?php } else { ?>
<html lang="en">
<?php } ?>

  <head>
    <meta charset="utf-8">

    <title><?php echo($page->getTitle()); ?></title>
    <meta name="description" content="<?php echo($page->getDescription()); ?>">
    <meta name='theme-color' content='<?php echo($page->getThemeColor()); ?>'>

    <?php if ($page->getOutputType() == 'amp') { ?>
      <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">
      <style>body {opacity: 0}</style><noscript><style>body {opacity: 1}</style></noscript>
      <script type="application/ld+json">
      {
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "<?php echo($page->getTitle()); ?>",
        "image": [
          "<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-192.png')); ?>"
        ]
      }
      </script>
      <script async src="https://cdn.ampproject.org/v0.js"></script>
    <?php } else { ?>
      <meta name="viewport" content="width=device-width,initial-scale=1">

      <!-- Manifest File -->
      <link rel="manifest" href="/manifest.json">
    <?php } ?>


    <!-- RSS Feed -->
    <link rel="alternate" type="application/rss+xml" title="RSS Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/rss'); ?>">
    <link rel="alternate" type="application/atom+xml" title="Atom Feed for Gaunt Face | Matt Gaunt" href="<?php echo(base_url().'blog/feed/atom'); ?>">

    <!-- Canonical -->
    <link rel="canonical" href="<?php echo("https://gauntface.com/".uri_string()); ?>" />

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

    <?php
    if ($page->getOutputType() != 'amp') {
      $inlineStylesheets = $page->getInlineStylesheets();
      $inlineRawCSS = $page->getInlineRawCSS();

      if (isset($inlineStylesheets)) {
        foreach($inlineStylesheets as $singleStylesheet) {
          echo('<style>');
          echo(swapStylesheetImages(read_file($singleStylesheet)));
          echo('</style>');
        }
      }

      if(isset($inlineRawCSS)) {
        foreach($inlineRawCSS as $rawCSS) {
          echo('<style>');
          echo(swapStylesheetImages($rawCSS));
          echo('</style>');
        }
      }
    }
    ?>
  </head>
  <body <?php if($page->getBodyClass() != null) {echo('class="'.$page->getBodyClass().'"');} ?>>

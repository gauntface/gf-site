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

        <!-- Schema.org data-->
        <?php if(isset($itemPropName)) {?>
        <meta itemprop="name" content="<?php echo($itemPropName); ?>">
        <meta property="og:title" content="<?php echo($itemPropName); ?>">
        <meta property="og:url" content="<?php echo(current_url()); ?>">
        <meta property="og:type" content="article">
        <?php } ?>

        <?php if(isset($itemPropDescription)) {?>
          <meta itemprop="description" content="<?php echo($itemPropDescription); ?>">
        <meta property="og:description" content="<?php echo($itemPropDescription); ?>">
        <?php } ?>

        <?php if(isset($itemPropImg)) {?>
        <meta itemprop="image" content="<?php echo($itemPropImg); ?>">
        <meta property="og:image" content="<?php echo($itemPropImg); ?>">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="gauntface">
        <?php } ?>

        <link rel="canonical" href="<?php echo(current_url()); ?>" />

        <?php if(isset($noindex) && $noindex) {?>
        <meta name="robots" content="noindex">
        <?php } ?>

        <!-- RSS Feed -->
        <link rel="alternate" type="application/rss+xml" title="Gaunt Face | Matt Gaunt - Blog" href="<?php echo(base_url().'blog/feed'); ?>">

        <!-- IE Specific Tags -->
        <meta name="msapplication-tap-highlight" content="no"/>
        <meta name="msapplication-TileColor" content="<?php echo($page->getThemeColor()); ?>">
        <meta name="msapplication-TileImage" content="<?php echo(base_url().addRevisionToFilePath('images/favicons/plain-144.png')); ?>">

        <!-- Apple Specific Tags -->
        <link rel="apple-touch-icon" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/ios-57.png')); ?>">
        <link rel="apple-touch-icon" sizes="76x76" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/ios-76.png')); ?>">
        <link rel="apple-touch-icon" sizes="120x120" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/ios-120.png')); ?>">
        <link rel="apple-touch-icon" sizes="152x152" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/ios-152.png')); ?>">
        <!-- <meta name="apple-mobile-web-app-capable" content="yes"> -->

        <meta name='theme-color' content='<?php echo($page->getThemeColor()); ?>'>

        <!-- Generic Fav Icons -->
        <link rel="icon" href="<?php echo(base_url().'favicon.ico'); ?>">
        <link rel="shortcut icon" sizes="48x48" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-48.png')); ?>">
        <link rel="shortcut icon" sizes="72x72" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-72.png')); ?>">
        <link rel="shortcut icon" sizes="96x96" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-96.png')); ?>">
        <link rel="shortcut icon" sizes="144x144" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-144.png')); ?>">
        <link rel="shortcut icon" sizes="192x192" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-192.png')); ?>">

        <!-- Generic but used by Opera Coast for Splash Screen -->
        <link rel="shortcut icon" sizes="228x228" href="<?php echo(base_url().addRevisionToFilePath('images/favicons/favicon-228.png')); ?>">

        <?php
            $inlineStylesheets = $page->getInlineStylesheets();
            if(isset($inlineStylesheets) || isset($rawstyles)) {
                echo('<style>');
                foreach($inlineStylesheets as $singleStylesheet) {
                    echo(read_file($singleStylesheet));
                }
                if(isset($rawstyles)) {
                    echo($rawstyles);
                }
                echo('</style>');
            }
        ?>

        <?php
            if(isset($fileStylesheets)) {
                foreach($fileStylesheets as $singleFile) {
                    ?>
                    <link rel="stylesheet" href="<?php echo(base_url().addRevisionToFilePath($singleFile)); ?>">
                    <?php
                }
            }
        ?>

        <!-- Manifest File -->
        <link rel="manifest" href="manifest.json">

    </head>
    <body <?php if($page->getBodyClass() != null) {echo('class="'.$page->getBodyClass().'"');} ?>>

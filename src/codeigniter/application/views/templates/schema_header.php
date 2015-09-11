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

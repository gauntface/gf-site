<?php
if (!isset($title)) {
  log_message('error', 'App bar template requested, but no AppBarModel provided');
  return;
}

$inlineBackgroundStyle = '';
if($title->getBackgroundImage()) {
  $inlineBackgroundStyle = ' style="background-image: url('.$title->getBackgroundImage().');"';
}

$additionalStyles = '';
if ($title->isPadded()) {
  $additionalStyles = 'is-padded';
}
?>

<section class="title-block-item<?php echo ' '.$additionalStyles ?>">
  <?php if ($title->getDate()) {?>
    <time date="2008-02-14" class="title-block-item__toptext"><?php echo $title->getDate() ?></time>
  <?php } else if ($title->getSmallTopText()){ ?>
    <p class="title-block-item__toptext"><?php echo $title->getSmallTopText() ?></p>
  <?php } ?>
  <div class="title-block__content"<?php echo $inlineBackgroundStyle ?>>
    <h1 class="title-block-item__title"><?php echo $title->getTitle() ?></h1>
    <div class="divider__horizontal"></div>
    <?php if ($title->getDescription()) { ?>
    <p class="title-block-item__excerpt"><?php echo $title->getDescription() ?></p>
    <?php } ?>
  </div>
</section>

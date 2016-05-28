<?php
if (!isset($model)) {
  log_message('error', 'App bar template requested, but no AppBarModel provided');
  return;
}

$classNames = [
  'title-block-item',
  $model->getClassName()
];
if ($model->isPadded()) {
  array_push($classNames, 'is-padded');
}
if (!$model->isTransparent()) {
  array_push($classNames, 'is-not-transparent');
}

if ($model->getFullbleedBackgroundImage()) {
  array_push($classNames, 'is-light-text');
}
?>

<?php if ($model->getLinkURL()) { ?>
<a class="title-block-item__link-wrapper" href="<?php echo(htmlspecialchars($model->getLinkURL())); ?>">
<?php } ?>

<section class="<?php echo(implode(' ', $classNames)); ?>">

  <?php if ($model->getTime()) {?>
    <time datetime="<?php echo date("Y-m-d", $model->getTime()); ?>" class="title-block-item__toptext"><?php echo date("Y.m.d", $model->getTime()); ?></time>
  <?php } else if ($model->getSmallTopText()){ ?>
    <p class="title-block-item__toptext"><?php echo $model->getSmallTopText() ?></p>
  <?php } ?>

  <div class="title-block__content">
    <h1 class="title-block-item__title"><?php echo $model->getTitle() ?></h1>
    <div class="divider__horizontal<?php if ($model->useLightDivider()) { echo(" is-light-version"); }?>"></div>
    <?php if ($model->getDescription()) { ?>
    <div class="title-block-item__excerpt">
      <?php echo $model->getDescription() ?>
    </div>
    <?php } ?>
  </div>
</section>

<?php if ($model->getLinkURL()) { ?>
</a>
<?php } ?>

<?php
$this->load->helper('url');
if(strrpos(uri_string(), 'styleguide', -strlen(uri_string())) !== FALSE) {
  $this->load->model('TitleModel');
  $title = new TitleModel();
  $title->setTitle('This is an Example Title');
  $title->setDescription('<p>This is an example paragraph of text</p>');
  $title->setSmallBackgroundImage('/images/example/gass.png');
  $title->setFullbleedBackgroundImage('/images/example/gass-fullbleed.png');
  $title->makePadded(true);
  $title->setLinkURL('#');
}

if (!isset($title)) {
  log_message('error', 'App bar template requested, but no AppBarModel provided');
  return;
}

$additionalStyles = '';
if ($title->isPadded()) {
  $additionalStyles = 'is-padded';
}

$inlineFullbleedBackgroundStyle = '';
if ($title->getFullbleedBackgroundImage()) {
  $inlineFullbleedBackgroundStyle = ' style="background-image: url('.$title->getFullbleedBackgroundImage().');"';
  $additionalStyles .= ' is-light-text';
}

$inlineSmallBackgroundStyle = '';
if ($title->getSmallBackgroundImage()) {
  $inlineSmallBackgroundStyle = ' style="background-image: url('.$title->getSmallBackgroundImage().');"';
}
?>

<?php if ($title->getLinkURL()) {
  ?>
  <a class="title-block-item__link-wrapper" href="<?php echo $title->getLinkURL(); ?>">
  <?php
}?>
<section class="title-block-item<?php echo ' '.$additionalStyles ?>"<?php echo $inlineFullbleedBackgroundStyle; ?>>
  <?php if ($title->getTime()) {?>
    <time date="<?php echo date("Y.m.d", $title->getTime()); ?>" class="title-block-item__toptext"><?php echo date("Y.m.d", $title->getTime()); ?></time>
  <?php } else if ($title->getSmallTopText()){ ?>
    <p class="title-block-item__toptext"><?php echo $title->getSmallTopText() ?></p>
  <?php } ?>
  <div class="title-block__content"<?php echo $inlineSmallBackgroundStyle ?>>
    <h1 class="title-block-item__title"><?php echo $title->getTitle() ?></h1>
    <div class="divider__horizontal<?php if ($title->useLightDivider()) { echo(" is-light-version"); }?>"></div>
    <?php if ($title->getDescription()) { ?>
    <div class="title-block-item__excerpt">
      <?php echo $title->getDescription() ?>
    </div>
    <?php } ?>
  </div>
</section>
<?php if ($title->getLinkURL()) {
  ?>
  </a>
  <?php
}?>

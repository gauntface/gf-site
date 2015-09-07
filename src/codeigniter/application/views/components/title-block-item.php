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

$additionalStyles = $title->getClassName();
if ($title->isPadded()) {
  $additionalStyles .= ' is-padded';
}

if ($title->getFullbleedBackgroundImage()) {
  //if($title->getFullbleedBackgroundColor()) {
  //    $inlineFullbleedBackgroundStyle .= ' background-color: '.$title->getFullbleedBackgroundColor().';';
  //}
  $additionalStyles .= ' is-light-text';

  $titleBlockFullbleedBGCSS = read_file('styles/templates/title-block-fullbleed-bg-img.css');
  $titleBlockFullbleedBGCSS = str_replace('.class-name', '.'.$title->getClassName(), $titleBlockFullbleedBGCSS);

  $fullBleedImgPathinfo = pathinfo($title->getFullbleedBackgroundImage());
  if (
    isset($fullBleedImgPathinfo['dirname']) &&
    isset($fullBleedImgPathinfo['filename']) &&
    isset($fullBleedImgPathinfo['extension'])
  ) {
    $titleBlockFullbleedBGCSS = str_replace('{{img-url}}', $fullBleedImgPathinfo['dirname'].'/'.$fullBleedImgPathinfo['filename'], $titleBlockFullbleedBGCSS);
    $titleBlockFullbleedBGCSS = str_replace('{{img-extension}}', $fullBleedImgPathinfo['extension'], $titleBlockFullbleedBGCSS);
    ?>
    <style>
    .<?php echo $title->getClassName(); ?> {
      background-color: <?php echo $title->getFullbleedBackgroundColor(); ?>
    }
    <?php echo $titleBlockFullbleedBGCSS; ?>
    </style>
    <?php
  }
}

if ($title->getSmallBackgroundImage()) {
  $titleBlockSmallBGCSS = read_file('styles/templates/title-block-greyscale-bg-img.css');
  $titleBlockSmallBGCSS = str_replace('.class-name', '.'.$title->getClassName().' .title-block__content', $titleBlockSmallBGCSS);

  $bgImgPathinfo = pathinfo($title->getSmallBackgroundImage());
  if (
    isset($bgImgPathinfo['dirname']) &&
    isset($bgImgPathinfo['filename']) &&
    isset($bgImgPathinfo['extension'])
  ) {
    $titleBlockSmallBGCSS = str_replace('{{img-url}}', $bgImgPathinfo['dirname'].'/'.$bgImgPathinfo['filename'], $titleBlockSmallBGCSS);
    $titleBlockSmallBGCSS = str_replace('{{img-extension}}', $bgImgPathinfo['extension'], $titleBlockSmallBGCSS);
    ?>
    <style>
    <?php echo $titleBlockSmallBGCSS; ?>
    </style>
    <?php
  }
}
?>

<?php if ($title->getLinkURL()) {
  ?>
  <a class="title-block-item__link-wrapper" href="<?php echo $title->getLinkURL(); ?>">
  <?php
}?>
<section class="title-block-item<?php echo ' '.$additionalStyles ?>">
  <?php if ($title->getTime()) {?>
    <time date="<?php echo date("Y.m.d", $title->getTime()); ?>" class="title-block-item__toptext"><?php echo date("Y.m.d", $title->getTime()); ?></time>
  <?php } else if ($title->getSmallTopText()){ ?>
    <p class="title-block-item__toptext"><?php echo $title->getSmallTopText() ?></p>
  <?php } ?>
  <div class="title-block__content">
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

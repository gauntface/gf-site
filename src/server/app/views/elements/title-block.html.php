<?php
  $this->styles('<link rel="stylesheet" type="text/css" href="/styles/components/title-block/title-block-inline.css" />');
?>

<a class="title-block" href="<?php if (isset($link)) {?><?= $link ?><?php } ?>">
  <section class="title-block__container">
  <?php if (isset($date)) {?>
    <time datetime="<?php echo date("Y-m-d", $date); ?>" class="title-block-item__toptext"><?php echo date("Y.m.d", $date); ?></time>
  <?php } else {?>
    <p class="title-block-item__toptext"><?php if (isset($smallTopText)) {?><?= $smallTopText; ?><?php } ?></p>
  <?php } ?>
    <div class="title-block__content">
      <h1 class="title-block-item__title"><?php if (isset($title)) {?><?= $title ?><?php } ?></h1>
      <div class="divider__horizontal"></div>
      <div class="title-block-item__excerpt">
        <?php if (isset($title)) {?><?= $excerpt ?><?php } ?>
      </div>
    </div>
  </section>
</a>

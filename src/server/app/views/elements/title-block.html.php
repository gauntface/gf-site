<?php
  $this->styles('/styles/components/title-block/title-block-inline.css');
?>

<?php if (isset($link)) {?><a class="title-block" href="<?= $link ?>"><?php } ?>

<section class="title-block">
  <?php if (isset($date)) {?>
    <time class="title-block__toptext" datetime="<?= date("Y-m-d", $date); ?>"><?= date("Y.m.d", $date); ?></time>
  <?php } else {?>
    <p class="title-block__toptext"><?= $smallTopText; ?></p>
  <?php } ?>

  <div class="title-block__content">
    <h1 class="title-block__title"><?= $title ?></h1>
    <div class="title-block__excerpt"><?= $excerpt ?></div>
  </div>
</section>

<?php if (isset($link)) {?></a><?php } ?>

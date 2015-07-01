<section class="title-block-item">
  <?php if (isset($date)) {?>
    <time date="2008-02-14" class="title-block-item__toptext">24.3.15</time>
  <?php } else { ?>
    <p class="title-block-item__toptext"><?php if (isset($smallText)) { echo($smallText); } ?></p>
  <?php } ?>
  <div class="title-block__content" style="background-image: url(/images/example/gass.png);">
    <h1 class="title-block-item__title">Title</h1>
    <div class="divider__horizontal"></div>
    <p class="title-block-item__excerpt">Description.</p>
  </div>
</section>

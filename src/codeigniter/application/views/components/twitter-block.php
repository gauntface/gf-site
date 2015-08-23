
<section class="twitter-block">
  <div class="twitter-block__twitter-logo"><img src="/images/components/twitter-block/twitter-block-logo.svg" alt="Twitter Logo" /></div>
  <div class="twitter-block__tweet-info small-font-size">
    <a href="https://twitter.com/gauntface">@gauntface</a><?php if(isset($title)) {?><span class="twitter-block__info-spacer"> . </span><time date="<?php echo date("Y.m.d", $title->getTime()); ?>"><?php echo date("M d", $title->getTime()); ?></time><?php } ?>
  </div>
  <?php if(isset($title)) {?>
  <p class="twitter-block__tweet"><?php echo $title->getDescription(); ?></p>
  <?php } else { ?>
  <p class="twitter-block__tweet">Oops looks like there was a problem talking with Twitter.</p>
  <?php } ?>

  <div class="divider__horizontal is-light-version"></div>

</section>

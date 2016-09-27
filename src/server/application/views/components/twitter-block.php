<?php
if (!isset($model)) {
  log_message('error', 'TwitterComponent requested, but no model provided');
  return;
}

$latestTweet = $model->getLatestTweet();
?>
<section class="twitter-block">
  <div class="twitter-block__twitter-logo"><img src="<?php echo addRevisionToFilePath('/images/components/twitter-block/twitter-block-logo.svg'); ?>" alt="Twitter Logo" /></div>
  <div class="twitter-block__tweet-info small-font-size">
    <a href="https://twitter.com/gauntface">@gauntface</a><?php if(isset($latestTweet)) {?><span class="twitter-block__info-spacer"> . </span><time datetime="<?php echo date("Y-m-d", $latestTweet['time']); ?>"><?php echo date("M d", $latestTweet['time']); ?></time><?php } ?>
  </div>
  <?php if(isset($latestTweet)) {?>
  <p class="twitter-block__tweet"><?php echo $latestTweet['text']; ?></p>
  <?php } else { ?>
  <p class="twitter-block__tweet">Oops looks like there was a problem talking with Twitter.</p>
  <?php } ?>

  <div class="divider__horizontal is-light-version"></div>

</section>

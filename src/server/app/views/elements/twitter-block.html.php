<?php
use lithium\net\http\Media;

$this->styles('/styles/components/twitter-block/twitter-block-inline.css');

$this->styles('/styles/components/divider/divider-inline.css');

$webrootPath = Media::webroot(true);
$twitterIconSVG = file_get_contents($webrootPath.'/images/twitter-block/twitter-block-logo.svg');
?>
<section class="twitter-block">
  <div class="twitter-block__twitter-logo">
    <?php echo $twitterIconSVG; ?>
  </div>
  <div class="twitter-block__tweet-info small-font-size">
    <a href="<?= $userURL ?>"><?= $username ?></a><span class="twitter-block__info-spacer"> . </span><time datetime="<?= date("Y-m-d", $tweetDate); ?>"><?= date("M d", $tweetDate); ?></time>  </div>
    <p class="twitter-block__tweet"><?php echo $tweet ?></p>

  <div class="divider__horizontal is-light-version"></div>

</section>

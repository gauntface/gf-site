<?php
use lithium\net\http\Media;

$webrootPath = Media::webroot(true);
$playIconSVG = file_get_contents($webrootPath.'/images/youtube-block/youtube-block-play-icon.svg');
$twitterIconSVG = file_get_contents($webrootPath.'/images/twitter-block/twitter-block-logo.svg');
?>
<div class="split-section--half-container">
<section class="youtube-block">
  <div class="youtube-play-icon">
    <a href="<?= $youtube['episodeURL'] ?>">
      <?php echo $playIconSVG; ?>
    </a>
  </div>

  <h1 class="youtube-block__series-title">
    <a href="<?= $youtube['playlistURL'] ?>">
      Totally<br />Tooling Tips
    </a>
  </h1>

  <div class="divider__horizontal is-light-version"></div>

  <p class="youtube-block__episode-title">
    <a href="<?= $youtube['episodeURL'] ?>">
      <?= $youtube['episodeTitle'] ?>
    </a>
  </p>

</section>
<section class="twitter-block">
  <div class="twitter-block__twitter-logo">
    <?php echo $twitterIconSVG; ?>
  </div>
  <div class="twitter-block__tweet-info small-font-size">
    <a href="<?= $twitter['userURL'] ?>"><?= $twitter['username'] ?></a><span class="twitter-block__info-spacer"> . </span><time datetime="<?= date("Y-m-d", $twitter['tweetDate']); ?>"><?= date("M d", $twitter['tweetDate']); ?></time>  </div>
    <p class="twitter-block__tweet"><?= $twitter['tweet'] ?></p>

  <div class="divider__horizontal is-light-version"></div>

</section>
</div>

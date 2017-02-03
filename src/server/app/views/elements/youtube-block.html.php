<?php
use lithium\net\http\Media;

$this->styles('/styles/components/youtube-block/youtube-block-inline.css');
$this->styles('/styles/components/youtube-block/youtube-block-remote.css');

$this->styles('/styles/components/divider/divider-inline.css');

$webrootPath = Media::webroot(true);
$playIconSVG = file_get_contents($webrootPath.'/images/youtube-block/youtube-block-play-icon.svg');
?>
<section class="youtube-block">
  <div class="youtube-play-icon">
    <a href="<?= $episodeURL ?>">
      <?php echo $playIconSVG; ?>
    </a>
  </div>

  <h1 class="youtube-block__series-title">
    <a href="<?= $episodeURL ?>">
      Totally<br />Tooling Tips
    </a>
  </h1>

  <div class="divider__horizontal is-light-version"></div>

  <p class="youtube-block__episode-title">
    <a href="<?= $episodeURL ?>">
      <?= $episodeTitle ?>
    </a>
  </p>

</section>

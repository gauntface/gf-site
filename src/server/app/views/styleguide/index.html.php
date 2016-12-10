<?php
  use lithium\net\http\Media;

  $this->styles('<link rel="stylesheet" type="text/css" href="/styles/layouts/styleguide.css" />');
  $this->styles('<link rel="stylesheet" type="text/css" href="/styles/components/toolbar.css" />');

  $webrootPath = Media::webroot(true);

  $watchRound = file_get_contents($webrootPath.'/images/styleguide/watch-round.svg');
  $watchSquare = file_get_contents($webrootPath.'/images/styleguide/watch-round.svg');
  $phone = file_get_contents($webrootPath.'/images/styleguide/phone.svg');
  $desktop = file_get_contents($webrootPath.'/images/styleguide/desktop.svg');
  $cssToggle = file_get_contents($webrootPath.'/images/styleguide/css-toggle.svg');
  $grid = file_get_contents($webrootPath.'/images/styleguide/grid.svg');
?>

<section class="toolbar">
  <div>
    <button class="toolbar__btn js-styleguide-viewport-watch-round">
      <?php echo $watchRound; ?>
    </button>
    <button class="toolbar__btn js-styleguide-viewport-watch-square">
      <?php echo $watchSquare; ?>
    </button>
    <button class="toolbar__btn js-styleguide-viewport-phone">
      <?php echo $phone; ?>
    </button>
    <button class="toolbar__btn js-styleguide-viewport-desktop">
      <?php echo $desktop; ?>
    </button>
  </div>

  <div>
    <button class="toolbar__btn js-styleguide-css-toggle">
      <?php echo $cssToggle; ?>
    </button>
    <button class="toolbar__btn js-styleguide-grid-btn">
      <?php echo $grid; ?>
    </button>
  </div>
</section>

<section class="styleguide-window">
  <div class="styleguide-window__wrapper js-styleguide-window__wrapper">
    <iframe class="styleguide-window__iframe js-styleguide-window__iframe" src="/styleguide/list"></iframe>
  </div>
</section>

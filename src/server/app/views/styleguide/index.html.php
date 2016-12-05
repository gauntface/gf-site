<?php
  $this->styles('<link rel="stylesheet" type="text/css" href="/styles/layouts/styleguide.css" />');
 $this->styles('<link rel="stylesheet" type="text/css" href="/styles/components/toolbar.css" />');
?>

<section class="toolbar">
  <div>
    <button class="toolbar__btn js-styleguide-back-btn">
      <img src="<?= $this->path('/images/styleguide/left-arrow.svg'); ?>" alt="Back" />
    </button>
  </div>

  <div>
    <button class="toolbar__btn js-styleguide-viewport-watch-round">
      <img src="<?= $this->path('/images/styleguide/watch-round.svg'); ?>" alt="Watch Round" />
    </button>
    <button class="toolbar__btn js-styleguide-viewport-watch-square">
      <img src="<?= $this->path('/images/styleguide/watch-square.svg'); ?>" alt="Watch Square" />
    </button>
    <button class="toolbar__btn js-styleguide-viewport-phone">
      <img src="<?= $this->path('/images/styleguide/phone.svg'); ?>" alt="Phone" />
    </button>
    <button class="toolbar__btn js-styleguide-viewport-desktop">
      <img src="<?= $this->path('/images/styleguide/desktop.svg'); ?>" alt="Compute" />
    </button>
  </div>

  <div>
    <button class="toolbar__btn js-styleguide-css-toggle">
      <img src="<?= $this->path('/images/styleguide/css-toggle.svg'); ?>" alt="Toggle CSS" />
    </button>
    <button class="toolbar__btn js-styleguide-grid-btn">
      <img src="<?= $this->path('/images/styleguide/grid.svg'); ?>" alt="Grid" />
    </button>
  </div>
</section>

<section class="styleguide-window">
  <div class="styleguide-window__wrapper js-styleguide-window__wrapper">
    <iframe class="styleguide-window__iframe js-styleguide-window__iframe"></iframe>
  </div>
</section>

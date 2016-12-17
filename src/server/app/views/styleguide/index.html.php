<?php
  use lithium\net\http\Media;

  $this->title($title);

  foreach($styles['inline'] as $styleUrl) {
      $this->styles('<link rel="stylesheet" type="text/css" href="'.$styleUrl.'" />');
  }

  $webrootPath = Media::webroot(true);

  $watchRound = file_get_contents($webrootPath.'/images/styleguide/watch-round.svg');
  $watchSquare = file_get_contents($webrootPath.'/images/styleguide/watch-square.svg');
  $phone = file_get_contents($webrootPath.'/images/styleguide/phone.svg');
  $desktop = file_get_contents($webrootPath.'/images/styleguide/desktop.svg');
  $cssToggle = file_get_contents($webrootPath.'/images/styleguide/css-toggle.svg');
  $grid = file_get_contents($webrootPath.'/images/styleguide/grid.svg');
?>

<?php
  echo $this->_view->render(
    ['element' => 'toolbar'],
    [
      'leftButtons' => [
        [
          'class' => 'js-styleguide-viewport-watch-round',
          'contents' => $watchRound
        ],
        [
          'class' => 'js-styleguide-viewport-watch-square',
          'contents' => $watchSquare
        ],
        [
          'class' => 'js-styleguide-viewport-phone',
          'contents' => $phone
        ],
        [
          'class' => 'js-styleguide-viewport-desktop',
          'contents' => $desktop
        ]
      ],
      'rightButtons' => [
        [
          'class' => 'js-styleguide-css-toggle',
          'contents' => $cssToggle
        ],
        [
          'class' => 'js-styleguide-grid-btn',
          'contents' => $grid
        ]
      ]
    ]
  ); ?>

<section class="styleguide-window">
  <div class="styleguide-window__wrapper js-styleguide-window__wrapper">
    <iframe class="styleguide-window__iframe js-styleguide-window__iframe" src="/styleguide/list"></iframe>
  </div>
</section>

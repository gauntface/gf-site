<div class="key_art-content__container">
  <div class="key_art-content__keyart">
    <div class="key_art-content__keyart-image"></div>
  </div>

  <div class="key_art-content__content">
    <?php
    $components = $model->getComponents();
    foreach($components as $component) {
      $component->loadView();
    }
    ?>
  </div>
</div>

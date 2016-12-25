<?php
$this->styles('/styles/components/toolbar/toolbar-inline.css');
?>
<section class="toolbar">
  <div>
    <?php
    foreach($leftButtons as $button) {
      ?>
      <button class="toolbar__btn <?php echo $button['class'] ?>">
        <?php echo $button['contents'] ?>
      </button>
      <?php
    }
    ?>
  </div>

  <div>
    <?php
    foreach($rightButtons as $button) {
      ?>
      <button class="toolbar__btn <?php echo $button['class'] ?>">
        <?php echo $button['contents'] ?>
      </button>
      <?php
    }
    ?>
  </div>
</section>

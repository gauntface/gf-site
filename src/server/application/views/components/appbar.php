<?php
if (!isset($model)) {
  log_message('error', 'App bar template requested, but no AppBarModel provided');
  return;
}
?>
<nav class="appbar js-appbar">
  <?php
    $appItems = $model->getLeftMenuItems();

    // Add a menu link for smaller screen devices if we have items
    if (sizeOf($appItems) > 0) {
      ?>
      <div class="appbar__menu js-appbar__menu">Menu</div>
      <?php
      foreach ($appItems as $key => $appItem) {
        $className = 'appbar__link js-appbar__'.$key;
        if(array_key_exists('isSelected', $appItem) && $appItem['isSelected']) {
          $className .= ' is-selected';
        }
        $ariaLabel = null;
        if(array_key_exists('aria-label', $appItem)) {
          $ariaLabel = $appItem['aria-label'];
        }
        ?>
        <a href="<?php echo(htmlspecialchars($appItem['link'])); ?>" data-pageid="<?php echo($appItem['pageid']); ?>" class="<?php echo $className ?>" <?php if($ariaLabel) {?>aria-label="<?php echo $ariaLabel; ?>"<?php } ?>><?php echo $appItem['title'] ?></a>
        <?php
      }
    }
  ?>
</nav>

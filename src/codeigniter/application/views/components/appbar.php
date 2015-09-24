<?php
$this->load->helper('url');
if(strrpos(uri_string(), 'styleguide', -strlen(uri_string())) !== FALSE) {
  $this->load->model('AppBarModel');
  $appbar = new AppBarModel();
  $appbar->setSelectedItem('home');
}

if (!isset($appbar)) {
  log_message('error', 'App bar template requested, but no AppBarModel provided');
  return;
}
?>

<nav class="appbar">
  <?php
    $appItems = $appbar->getLeftMenuItems();

    // Add a menu link for smaller screen devices if have items
    if (sizeOf($appItems) > 0) {
      ?>
      <div class="appbar__menu js-appbar__menu">Menu</div>
      <?php
    }

    foreach ($appItems as $key => $appItem) {
      $className = 'appbar__link js-appbar__'.$key;
      if(array_key_exists('isSelected', $appItem) && $appItem['isSelected']) {
        $className .= ' is-selected';
      }
      ?>
      <a href="<?php echo(htmlspecialchars($appItem['link'])); ?>" class="<?php echo $className ?>"><?php echo $appItem['title'] ?></a>
      <?php
    }
  ?>
</nav>

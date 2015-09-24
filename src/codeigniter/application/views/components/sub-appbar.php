<?php
$this->load->helper('url');
if(strrpos(uri_string(), 'styleguide', -strlen(uri_string())) !== FALSE) {
  $this->load->model('SubAppBarModel');
  $subappbar = new SubAppBarModel('Title', array(
    'one'  => array(
        'title' => 'Item 1',
        'link' => '#'
    ),
    'two' => array(
        'title' => 'Item 2',
        'link' => '#'
    ),
    'three' => array(
        'title' => 'Item 3',
        'link' => '#'
    ),
    'four' => array(
        'title' => 'Item 4',
        'link' => '#'
    ),
  ));
}

if (!isset($subappbar)) {
  log_message('error', 'Sub App bar template requested, but no SubAppBarModel provided');
  return;
}
?>

<nav class="subappbar">
  <?php
    $title = $subappbar->getTitle();
    $rightItems = $subappbar->getRightMenuItems();
  ?>
  <div class="subappbar__title"><?php echo $title; ?></div>
  <div class="subappbar__spacer"></div>
  <?php
    foreach ($rightItems as $key => $appItem) {
      $className = 'subappbar__link js-subappbar__'.$key;
      if(array_key_exists('isSelected', $appItem) && $appItem['isSelected']) {
        $className .= ' is-selected';
      }
      ?>
      <a href="<?php echo(htmlspecialchars($appItem['link'])); ?>" class="<?php echo $className ?>"><?php echo $appItem['title'] ?></a>
      <?php
    }
  ?>
</nav>

<h1>Elements</h1>

<ul>
<?php
foreach ($elements as $elementDetails) {
  if (array_key_exists('variations', $elementDetails)) {
    ?>
    <li><?php echo $elementDetails['friendly-name'] ?></li>
    <ul>
      <?php
      $index = 0;
      foreach ($elementDetails['variations'] as $variationName => $variationDetails) {
        ?>
        <li><a href="<?= $elementDetails['view-url']?>/<?php echo($index); ?>/"><?= $variationName ?></a></li>
        <?php
        $index++;
      }
      ?>
    </ul>
    <?php
  } else {
    ?>
    <li><a href="<?php echo $elementDetails['view-url']?>"><?php echo $elementDetails['friendly-name'] ?></a></li>
    <?php
  }
}
?>
</ul>

<?php
echo $this->_view->render(['element' => 'grid-overlay']);
?>

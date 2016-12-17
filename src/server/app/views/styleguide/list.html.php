<h1>Elements</h1>

<ul>
<?php
foreach ($elements as $elementDetails) {
  ?>
  <li><a href="<?php echo $elementDetails['view-url']?>"><?php echo $elementDetails['friendly-name'] ?></a></li>
  <?php
}
?>
</ul>

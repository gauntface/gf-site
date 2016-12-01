<?php
$this->load->helper('revision');
$fontCSSPath = addRevisionToFilePath('/styles/elements/fonts.css');
$fontStylesheet = read_file('./scripts/font-stylesheet.tmpl.js');
$fontStylesheet = str_replace('/**@ GF-FONT-STYLESHEET @**/', $fontCSSPath, $fontStylesheet);
?>
<script async defer>
  <?php echo($fontStylesheet); ?>
</script>

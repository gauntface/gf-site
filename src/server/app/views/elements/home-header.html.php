<?php
use lithium\net\http\Media;

$this->styles('/styles/components/home-header/home-header-inline.css');
$this->styles('/styles/components/home-header/home-header-remote.css');

$webrootPath = Media::webroot(true);
$logoSVG = file_get_contents($webrootPath.'/images/logo.svg');
?>
<header class="gf-header">
  <?php echo $logoSVG; ?>
</header>

<?php
use lithium\net\http\Media;
?>
<!doctype html>
<html>
<head>
	<?php echo $this->html->charset();?>
	<title><?php echo $this->title(); ?></title>
	<meta name="viewport" content="width=device-width,initial-scale=1">

	<?php $this->styles('/styles/main.css'); ?>
	<?php
		$webrootPath = Media::webroot(true);
		$styles = explode("\n", $this->styles());
		foreach ($styles as $stylePath) {
			if ($stylePath) {
				echo "<style>";
				echo file_get_contents($webrootPath.trim($stylePath));
				echo "</style>\n";
			}
		}
	?>
	<?php
		// echo $this->html->link('Icon', null, ['type' => 'icon']);
	?>
</head>
<body class="lithified">
	<?php echo $this->content(); ?>

	<?= $this->scripts() ?>
</body>
</html>

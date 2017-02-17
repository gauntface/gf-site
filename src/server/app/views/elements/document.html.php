<?php
use lithium\net\http\Media;
use app\utilities\Revision;
use app\utilities\Styles;

$this->styles('/styles/main-inline.css');
$this->scripts('/scripts/controllers/async-iframe-controller.js');
$this->scripts('/scripts/controllers/async-styles-controller.js');
$this->scripts('/scripts/controllers/async-font-controller.js');
$this->scripts('/scripts/controllers/service-worker-controller.js');

if (!isset($theme_color)) {
  $theme_color = '#FFFFFF';
}

$styles = Styles::groupStyles($this->styles());
?>
<!doctype html>
<html>
<head>
	<?php echo $this->html->charset();?>
	<title><?php echo $this->title(); ?></title>

	<meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="<?= $theme_color ?>">
	<link rel="manifest" href="/manifest.json">

	<?php
		echo '<style>'.implode('</style><style>', $styles['inline']).'</style>';
	?>
</head>
<body>
	<?php echo $content; ?>

	<script>
		window.GauntFace = window.GauntFace || {};
		window.GauntFace._asyncStyles = [<?php
		if (count($styles['remote']) > 0) {
			echo '\''.implode('\',\'', $styles['remote']).'\'';
		}
		?>];
	</script>
	<?php
		$scripts = explode("\n", $this->scripts());
		foreach ($scripts as $scriptPath) {
			if ($scriptPath) {
				$jsPath = trim($scriptPath);
				echo '<script src="'.Revision::addRevision($jsPath).'" defer></script>';
			}
		}
	?>
</body>
</html>

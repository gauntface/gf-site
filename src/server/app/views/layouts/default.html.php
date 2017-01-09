<?php
use lithium\net\http\Media;

$this->styles('/styles/main.css');
$this->scripts('/scripts/controllers/async-styles-controller.js');
?>
<!doctype html>
<html>
<head>
	<?php echo $this->html->charset();?>
	<title><?php echo $this->title(); ?></title>
	<meta name="viewport" content="width=device-width,initial-scale=1">

	<?php
		$REMOTE_STYLES = array();
		$webrootPath = Media::webroot(true);
		$styles = explode("\n", $this->styles());
		foreach ($styles as $stylePath) {
			if ($stylePath) {
				$cssPath = trim($stylePath);
				if (strrpos($stylePath, "-remote.css") === FALSE) {
					echo "<style>";
					echo file_get_contents($webrootPath.$cssPath);
					echo "</style>\n";
				} else {
					array_push($REMOTE_STYLES, $cssPath);
				}
			}
		}
	?>
	<?php
		// echo $this->html->link('Icon', null, ['type' => 'icon']);
	?>
</head>
<body class="lithified">
	<?php echo $this->content(); ?>

	<script>
		window.GauntFace = window.GauntFace || {};
		window.GauntFace._asyncStyles = [
		<?php
		echo '\''.implode('\',\'', $REMOTE_STYLES).'\'';
		?>
		];
	</script>
	<?php
		$REMOTE_STYLES = array();
		$scripts = explode("\n", $this->scripts());
		foreach ($scripts as $scriptPath) {
			if ($scriptPath) {
				$jsPath = trim($scriptPath);
				echo '<script src="'.$jsPath.'" defer></script>';
			}
		}
	?>
</body>
</html>

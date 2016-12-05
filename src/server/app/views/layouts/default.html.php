<!doctype html>
<html>
<head>
	<?php echo $this->html->charset();?>
	<title><?php echo $this->title(); ?></title>
	<?php $this->styles('<link rel="stylesheet" type="text/css" href="/styles/main.css" />'); ?>
	<?php
		// echo $this->scripts();
	?>
	<?php echo $this->styles(); ?>
	<?php
		// echo $this->html->link('Icon', null, ['type' => 'icon']);
	?>
</head>
<body class="lithified">
	<?php echo $this->content(); ?>
</body>
</html>

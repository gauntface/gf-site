<?php

use lithium\core\Environment;

Environment::is(function($request) {
	$buildType = getenv('BUILDTYPE');
	if ($buildType !== false) {
		return $buildType;
	}

	return 'production';
});

?>

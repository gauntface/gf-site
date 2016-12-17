<?php

use lithium\core\Environment;

$buildType = getenv('BUILDTYPE');
if ($buildType !== false) {
	Environment::set($buildType);
} else {
	Environment::set('production');
}

?>

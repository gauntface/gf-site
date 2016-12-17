<?php

use lithium\core\Environment;
use lithium\analysis\Logger;

if (Environment::is('development')) {
  Logger::config(array(
  	'default' => array(
  		'adapter' => 'File'
  	)
  ));
}

?>

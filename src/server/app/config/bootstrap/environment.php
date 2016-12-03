<?php

use lithium\core\Environment;

/**
 * Set up the environment.
 * @var [type]
 */
Environment::is(function($request){
	// HTTP_HOST has the port number in localhost, this 'explode' removes it.
	list($host,)=explode(':', $request->env('HTTP_HOST'));

  if ($host == 'project.local' || $host == 'localhost') {
    return 'development';
  }
  if (preg_match('/staging/', $host)) {
    return 'staging';
  }
  return 'production';
});

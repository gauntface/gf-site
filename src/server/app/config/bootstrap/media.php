<?php
/**
 * li₃: the most RAD framework for PHP (http://li3.me)
 *
 * Copyright 2016, Union of RAD. All rights reserved. This source
 * code is distributed under the terms of the BSD 3-Clause License.
 * The full license text can be found in the LICENSE.txt file.
 */

/**
 * The `Collection` class, which serves as the base class for some of Lithium's data objects
 * (`RecordSet` and `Document`) provides a way to manage data collections in a very flexible and
 * intuitive way, using closures and SPL interfaces. The `to()` method allows a `Collection` (or
 * subclass) to be converted to another format, such as an array. The `Collection` class also allows
 * other classes to be connected as handlers to convert `Collection` objects to other formats.
 *
 * The following connects the `Media` class as a format handler, which allows `Collection`s to be
 * exported to any format with a handler provided by `Media`, i.e. JSON. This enables things like
 * the following:
 * {{{
 * $posts = Post::find('all');
 * return $posts->to('json');
 * }}}
 */
use lithium\net\http\Media;
use lithium\util\Collection;

Collection::formats(Media::class);

Media::type('json', ['application/json']);
Media::type('xml', ['application/xml', 'application/soap+xml', 'text/xml']);
Media::type('txt', ['text/plain']);
Media::type('js', ['application/javascript', 'text/javascript']);

/**
 * This filter is a convenience method which allows you to automatically route requests for static
 * assets stored within active plugins. For example, given a JavaScript file `bar.js` inside the
 * `li3_foo` plugin installed in an application, requests to `http://app/path/li3_foo/js/bar.js`
 * will be routed to `/path/to/app/libraries/plugins/li3_foo/webroot/js/bar.js` on the filesystem.
 * In production, it is recommended that you disable this filter in favor of symlinking each
 * plugin's `webroot` directory into your main application's `webroot` directory, or adding routing
 * rules in your web server's configuration.
 */
// use lithium\aop\Filters;
// use lithium\action\Dispatcher;
// use lithium\action\Response;
//
// Filters::apply(Dispatcher::class, '_callable', function($params, $next) {
// 	$url = ltrim($params['request']->url, '/');
// 	list($library, $asset) = explode('/', $url, 2) + ["", ""];
//
// 	if ($asset && ($path = Media::webroot($library)) && file_exists($file = "{$path}/{$asset}")) {
// 		return function() use ($file) {
// 			$info = pathinfo($file);
// 			$media = Media::type($info['extension']);
// 			$content = (array) $media['content'];
//
// 			return new Response([
// 				'headers' => ['Content-type' => reset($content)],
// 				'body' => file_get_contents($file)
// 			]);
// 		};
// 	}
// 	return $next($params);
// });

?>

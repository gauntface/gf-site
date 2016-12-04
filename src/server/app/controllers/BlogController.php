<?php

namespace app\controllers;

class BlogController extends \lithium\action\Controller {

  public function index() {
    $foo = 'bar';
    $title = 'Posts';
		return compact('foo', 'title');
	}

}

?>

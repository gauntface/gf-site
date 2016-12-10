<?php

namespace app\controllers;

class StyleguideController extends \lithium\action\Controller {

  public function index() {
    return [];
	}

  public function view($id) {
    $smallTopText = 'Test Top Text';
    return compact('id', 'smallTopText');
  }
}

?>

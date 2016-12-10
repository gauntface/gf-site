<?php

namespace app\controllers;

class StyleguideController extends \lithium\action\Controller {

  public function index() {
    return [];
	}

  public function list() {
    $elementsPath = LITHIUM_APP_PATH."/views/elements/";
    $fullPath = function($fileName) use ($elementsPath) {
        return $elementsPath.$fileName;
    };

    $elements = array_diff(
      scandir($elementsPath),
      array('..', '.')
    );

    $elements = array_map($fullPath, $elements);

    return array(
      "elements" => $elements
    );
  }

  public function view($id) {
    $smallTopText = 'Test Top Text';
    return compact('id', 'smallTopText');
  }
}

?>

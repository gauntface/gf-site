<?php

namespace app\controllers;

class OkController extends \lithium\action\Controller {

  public function index() {
		return $this->render(['txt' => 'ok']);
	}

}

?>

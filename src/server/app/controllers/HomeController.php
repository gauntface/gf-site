<?php

namespace app\controllers;

use lithium\analysis\Logger;
use lithium\net\http\Media;
use Exception;

class HomeController extends \lithium\action\Controller {

  public function index() {
    return array(
      'title' => 'GauntFace | Matthew Gaunt',
    );
	}
}

?>

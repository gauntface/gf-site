<?php

namespace app\controllers;

use lithium\net\http\Media;
use Exception;

class HomeController extends \lithium\action\Controller {

  public function index() {
    return array(
      'title' => 'GauntFace | Matthew Gaunt',
      'theme_color' => '#1e1621'
    );
	}
}

?>

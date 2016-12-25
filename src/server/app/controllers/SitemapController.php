<?php

namespace app\controllers;

class SitemapController extends \lithium\action\Controller {

  public function index() {
    $urls = array(
      '/styleguide'
    );

    if (stripos($_SERVER['SERVER_PROTOCOL'],'https') === true) {
      $protocol = 'https://';
    } else {
      $protocol = 'http://';
    }

    for ($i = 0; $i < count($urls); $i++) {
        $urls[$i] = $protocol . $_SERVER['HTTP_HOST'] . $urls[$i];
    }

    return compact('urls');
	}

}

?>

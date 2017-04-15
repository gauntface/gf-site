<?php

namespace app\controllers;

use lithium\net\http\Media;
use Exception;

use app\models\Tweets;
use app\models\YoutubeVideos;

class DocumentController extends \lithium\action\Controller {

  public function index() {
    $viewData = array(
      'theme_color' => '#1e1621'
    );
    $renderData = array(
      'data' => $viewData
    );

    if (array_key_exists('type', $this->request->params) && $this->request->params['type'] === 'json') {
      $renderData['layout'] = 'template-view';
    }

    return $this->render($renderData, $viewData);
	}
}

?>

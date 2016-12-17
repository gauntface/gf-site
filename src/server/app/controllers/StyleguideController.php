<?php

namespace app\controllers;

use lithium\analysis\Logger;
use Exception;

class StyleguideController extends \lithium\action\Controller {

  public function index() {
    return array(
      'title' => 'Styleguide',
      'styles' => array(
        'inline' => array(
          '/styles/layouts/styleguide-inline.css',
          '/styles/components/toolbar/toolbar-inline.css'
        )
      )
    );
	}

  public function list() {
    /** $fullPath = function($fileName) use ($elementsPath) {
        return $elementsPath.$fileName;
    };

    $elements = array_map($fullPath, $elements);**/

    $elementsPath = LITHIUM_APP_PATH."/views/elements/";
    $elements = array_diff(
      scandir($elementsPath),
      array('..', '.')
    );

    $elementFilterFunc = function($fileName) {
        return $this->getComponentDetails($fileName);
    };



    $elements = array_map($elementFilterFunc, $elements);

    return array(
      "elements" => $elements
    );
  }

  public function view($id) {
    $smallTopText = 'Test Top Text';
    return compact('id', 'smallTopText');
  }

  private function getComponentDetails($componentFilename) {
    $noExtension = basename($componentFilename, '.html.php');

    $details = array(
      'filename' => $componentFilename,
      'view-url' => '/styleguide/view/'.$noExtension
    );

    switch($componentFilename) {
      case 'title-block.html.php':
        Logger::write('debug', 'Title Block.....');
        $details['friendly-name'] = 'Title Block';
        break;
      case 'toolbar.html.php':
        $details['friendly-name'] = 'Toolbar';
        break;
      default:
        throw new Exception('Unknown component: '.$componentFilename);
    }

    return $details;
  }
}

?>

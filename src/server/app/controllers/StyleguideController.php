<?php

namespace app\controllers;

use lithium\analysis\Logger;
use lithium\net\http\Media;
use Exception;

class StyleguideController extends \lithium\action\Controller {

  public function index() {
    return array(
      'title' => 'Styleguide',
    );
	}

  public function list() {
    $elementsPath = LITHIUM_APP_PATH."/views/elements/";
    $elements = array_diff(
      scandir($elementsPath),
      array('..', '.')
    );

    $elementMapFunc = function($fileName) {
        return $this->getComponentDetails($fileName);
    };

    $elements = array_map($elementMapFunc, $elements);

    $elementFilterFunc = function($elementDetails) {
        return $elementDetails !== null;
    };

    $elements = array_filter($elements, $elementFilterFunc);

    return array(
      "elements" => $elements
    );
  }

  public function view($id, $variationIndex = 0) {
    $componentDetails = $this->getComponentDetails($id.'.html.php');
    $data = null;
    if (array_key_exists('variations', $componentDetails)) {
      $data = array_values($componentDetails['variations'])[$variationIndex];
    }
    return compact('id', 'data');
  }

  private function getComponentDetails($componentFilename) {
    $noExtension = basename($componentFilename, '.html.php');

    $details = array(
      'id' => $noExtension,
      'filename' => $componentFilename,
      'view-url' => '/styleguide/view/'.$noExtension,
    );

    $webrootPath = Media::webroot(true);

    switch($noExtension) {
      case 'title-block':
        $details['friendly-name'] = 'Title Block';
        $details['variations'] = array(
          'Date Top Text' => array(
            'date' => time(),
            'title' => 'Example Title',
            'excerpt' => 'Automated testing on the web has some real gnarly gotchas. Time to find out what they are.'
          ),
          'Plain Top Text' => array(
            'smallTopText' => 'Example Top Text',
            'title' => 'Example Title',
            'excerpt' => 'Automated testing on the web has some real gnarly gotchas. Time to find out what they are.'
          ),
          'Background Image' => array(
            'smallTopText' => 'Example Top Text',
            'title' => 'Example Title',
            'excerpt' => 'Automated testing on the web has some real gnarly gotchas. Time to find out what they are.'
          ),
          'Link' => array(
            'smallTopText' => 'Example Top Text',
            'title' => 'Example Title',
            'excerpt' => 'Automated testing on the web has some real gnarly gotchas. Time to find out what they are.'
          ),
        );
        break;
      case 'toolbar':
        $watchRound = file_get_contents($webrootPath.'/images/styleguide/watch-round.svg');
        $watchSquare = file_get_contents($webrootPath.'/images/styleguide/watch-square.svg');

        $details['friendly-name'] = 'Toolbar';
        $details['variations'] = array(
          'Basic Example' => array(
            'leftButtons' => array([
              'class' => 'example-class',
              'contents' => $watchRound
            ]),
            'rightButtons' => array([
              'class' => 'example-class',
              'contents' => $watchSquare
            ]),
          )
        );
        break;
      case 'grid-overlay':
        return null;
      default:
        throw new Exception('Unknown component: '.$componentFilename);
    }

    return $details;
  }
}

?>

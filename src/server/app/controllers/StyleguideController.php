<?php

namespace app\controllers;

use lithium\net\http\Media;
use Exception;

class StyleguideController extends \lithium\action\Controller {

  public function index() {
    return array(
      'title' => 'Styleguide',
      'theme_color' => '#eeeeee',
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
    } else if (array_key_exists('data', $componentDetails)) {
      $data = $componentDetails['data'];
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
      case 'document':
        return null;
      case 'shells':
        // TODO: This should be shells/<shell name>
        return null;
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
      case 'home-header':
        $details['friendly-name'] = 'Home Header';
        break;
      case 'footer':
        $details['friendly-name'] = 'Footer';
        break;
      case 'youtube-block':
        $details['friendly-name'] = 'Youtube Block';
        $details['data'] = array(
          'episodeTitle' => 'Example Title',
          'episodeURL' => 'https://youtube.com'
        );
        break;
      case 'twitter-block':
        $details['friendly-name'] = 'Twitter Block';
        $details['data'] = array(
          'username' => '@example',
          'userURL' => 'https://twitter.com',
          'tweetDate' => time(),
          'tweet' => 'This is simply an example tweet.'
        );
        break;
      case 'split-section':
        $details['friendly-name'] = 'Split Section (Layout)';
        $details['data'] = array(
          'left' => array(
            'id' => 'youtube-block',
            'data' => array(
              'episodeTitle' => 'Example Title',
              'episodeURL' => 'https://youtube.com'
            )
          ),
          'right' => array(
            'id' => 'twitter-block',
            'data' => array(
              'username' => '@example',
              'tweetDate' => time(),
              'tweet' => 'This is simply an example tweet.'
            )
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

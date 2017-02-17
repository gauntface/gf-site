<?php

namespace app\utilities;

use lithium\net\http\Media;
use lithium\analysis\Logger;
use app\utilities\Revision;

class Styles {
  public static function groupStyles($stylesFromLithium) {
    $styleData = array(
      'inline' => array(),
      'remote' => array()
    );

		$webrootPath = Media::webroot(true);

		$stylesAsStrings = explode("\n", $stylesFromLithium);
		foreach ($stylesAsStrings as $stylePath) {
			if ($stylePath) {
				$cssPath = trim($stylePath);
				if (strrpos($stylePath, "-inline.css") === FALSE) {
          array_push(
            $styleData['remote'],
            Revision::addRevision($cssPath)
          );
				} else {
          array_push(
            $styleData['inline'],
            file_get_contents($webrootPath.$cssPath)
          );
				}
			}
		}
    return $styleData;
  }
}

?>

<?php

namespace app\utilities;

use lithium\net\http\Media;
use lithium\analysis\Logger;

class Revision {
  public static function addRevision($assetPath) {
    // If the path starts with http it's most likely for a third
    // party resource.
    if (strpos($assetPath, "http") === 0) {
      return $assetPath;
    }

    $includeFrontSlash = FALSE;
    $unrevisionedPath = $assetPath;
    if(substr($unrevisionedPath, 0, strlen('/')) === '/') {
      $includeFrontSlash = TRUE;
      $unrevisionedPath = substr($unrevisionedPath, 1);
    }
    $unrevisionedPathInfo = pathinfo($unrevisionedPath);

    // Glob looks for files mataching a particular pattern
    $filenames = glob($unrevisionedPath);
    if(!is_array($filenames)) {
      Logger::write('debug', 'helper/revision: glob() returned no array');
      return $assetPath;
    }

    if(count($filenames) != 1) {
      Logger::write('debug', 'helper/revision: glob() Found multiple results for: '.$unrevisionedPath);
      return $assetPath;
    }

    $sha1 = sha1_file(current($filenames));
    $revisionedFileName = $unrevisionedPathInfo['dirname'].'/'.$unrevisionedPathInfo['filename'].'.'.substr($sha1 , 0, 10).'.'.$unrevisionedPathInfo['extension'];
    if($includeFrontSlash) {
        $revisionedFileName = '/'.$revisionedFileName;
    }

    return $revisionedFileName;
  }
}

?>

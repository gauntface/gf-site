<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function addRevisionToFilePath($originalFilePath) {
    // If it starts with HTTP it is most likely a third party resource
    if (strpos($originalFilePath, "http") === 0) {
      return $originalFilePath;
    }

    $includeFrontSlash = FALSE;
    $unrevisionedFilepath = $originalFilePath;
    if(substr($unrevisionedFilepath, 0, strlen('/')) === '/') {
      $includeFrontSlash = TRUE;
      $unrevisionedFilepath = substr($unrevisionedFilepath, 1);
    }

    $unrevisionedParts = pathinfo($unrevisionedFilepath);

    // Glob looks for files mataching a particular pattern
    $filenames = glob($unrevisionedFilepath);
    if(!is_array($filenames)) {
      log_message('error', 'revision_helper: glob() returned no array');
      return $originalFilePath;
    }

    if(count($filenames) != 1) {
      log_message('error', 'revision_helper: glob() failed to return a single result for '.$unrevisionedFilepath);
      return $originalFilePath;
    }

    $sha1 = sha1_file(current($filenames));

    $revisionedFileName = $unrevisionedParts['dirname'].'/'.$unrevisionedParts['filename'].'.'.substr($sha1 , 0, 10).'.'.$unrevisionedParts['extension'];

    if($includeFrontSlash) {
        $revisionedFileName = '/'.$revisionedFileName;
    }

    return $revisionedFileName;
}

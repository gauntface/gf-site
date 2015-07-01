<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function addRevisionToFilePath($unrevisionedFilepath) {
    $includeFrontSlash = FALSE;
    if(substr($unrevisionedFilepath, 0, strlen('/')) === '/') {
      $includeFrontSlash = TRUE;
      $unrevisionedFilepath = substr($unrevisionedFilepath, 1);
    }
    $unrevisionedParts = pathinfo($unrevisionedFilepath);

    // Glob looks for files mataching a particular pattern
    $filenames = glob($unrevisionedFilepath);
    if(!is_array($filenames)) {
      log_message('error', 'revisiong_helper: glob() returned no array');
      return $unrevisionedFilepath;
    }

    if(count($filenames) != 1) {
      log_message('error', 'revisiong_helper: glob() failed to return a single result');
      return $unrevisionedFilepath;
    }

    $sha1 = sha1_file(current($filenames));

    $revisionedFileName = $unrevisionedParts['dirname'].'/'.$unrevisionedParts['filename'].'.'.substr($sha1 , 0, 10).'.'.$unrevisionedParts['extension'];
    if($includeFrontSlash) {
        $revisionedFileName = '/'.$revisionedFileName;
    }
    return $revisionedFileName;
}

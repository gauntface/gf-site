<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function clearCache($uri_string) {
    if(!isset($uri_string)) {
        return;
    }

    log_message('error', '-----------------------');
    log_message('error', '');
    log_message('error', ' Remove: '.$uri_string);
    log_message('error', '');
    log_message('error', '-----------------------');

    $CI =& get_instance();
    $path = $CI->config->item('cache_path');
    $path = rtrim($path, DIRECTORY_SEPARATOR);

    $cache_path = ($path == '') ? APPPATH.'cache/' : $path;

    $uri =  $CI->config->item('base_url').
            $CI->config->item('index_page').
            $uri_string;

    $cache_path .= md5($uri);

    if(file_exists($cache_path)) {
      log_message('error', 'Trying to clear '.$uri_string.' with cache path '.$cache_path);
      return unlink($cache_path);
    }
    return false;
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

set_include_path(APPPATH.'third_party/'.PATH_SEPARATOR.get_include_path());

require_once APPPATH.'third_party/google-api-php-client/src/Google/autoload.php';  
require_once APPPATH.'third_party/google-api-php-client/src/Google/Client.php';

class Google extends Google_Client {
    function __construct($params = array()) {
        parent::__construct();
        $this->setClassConfig('Google_Cache_File', array('directory' => '/tmp/cache'));
    }
}

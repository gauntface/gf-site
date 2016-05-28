<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function returnAPIError($statusCode, $errorId, $errorMsg) {
  $ci =& get_instance();
  $ci->output->set_status_header($statusCode);
  $ci->load->view('output-types/json', array(
    'json' => array(
      'error' => array(
        'id' => $errorId,
        'msg' => $errorMsg
      )
    )
  ));
}

function returnAPISuccess($data) {
  $ci =& get_instance();
  $ci->load->view('output-types/json', array(
    'json' => array(
      'data' => $data
    )
  ));
}

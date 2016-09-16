<?php

if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function isLoggedIn() {
  $ci =& get_instance();
  $ci->load->helper('url');

  if ($_SERVER['CI_ENV'] === 'test' &&
    base_url() === 'http://localhost:3000/') {
    return true;
  }

  $ci->load->library('session');
  $ci->config->load('confidential', TRUE);

  $rawToken = $ci->session->userdata('user_sign_in_token');
  if(!$rawToken) {
    return false;
  }

  $token = json_decode($rawToken);
  try {
    $client = new Google_Client();
    $client->setClientId(
      $ci->config->item('gplus-clientid', 'confidential')
    );
    $client->setClientSecret(
      $ci->config->item('gplus-clientsecret', 'confidential')
    );
    $attributes = $client->verifyIdToken(
      $token->id_token,
      $ci->config->item('gplus-clientid', 'confidential')
    );

    $emailAddress = $attributes["email"];
    if($emailAddress != $ci->config->item('whitelist', 'confidential')) {
      log_message('error', 'BaseContents.php: isLoggedIn() User login attempt - ' + $emailAddress);
      return false;
    }
  } catch (Exception $e) {
    log_message('error', 'BaseContents.php: isLoggedIn() Error Handling Token Check - '.$e->getMessage());
    return false;
  }
  return true;
}

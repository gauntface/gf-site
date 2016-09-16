<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$active_group = 'default';
$query_builder = TRUE;

$db['default'] = array(
  'dsn'	=> '',
  // Use 127.0.0.1 to make docker work with host mode
  'hostname' => '127.0.0.1',
  'username' => 'gf_site_test',
  'password' => 'test_password',
  'database' => 'gauntface_site_db_test',
  'dbdriver' => 'mysqli',
  'dbprefix' => '',
  'pconnect' => FALSE,
  'db_debug' => TRUE,
  'cache_on' => TRUE,
  'cachedir' => APPPATH.'dbcache/',
  'char_set' => 'utf8',
  'dbcollat' => 'utf8_general_ci',
  'swap_pre' => '',
  'encrypt' => FALSE,
  'compress' => FALSE,
  'stricton' => FALSE,
  'failover' => array(),
  'save_queries' => TRUE
);

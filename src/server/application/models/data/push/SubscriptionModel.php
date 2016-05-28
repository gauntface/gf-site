<?php

class SubscriptionModel extends CI_Model {

  private $_id;
  private $_endpoint;
  private $_auth;
  private $_p256dh;
  private $_signUpTime;

  function __construct($sqlQuery = null) {
    // Call the Model constructor
    parent::__construct();

    if($sqlQuery) {
      $this->_id = urldecode($sqlQuery->subscription_id);
      $this->_endpoint = urldecode($sqlQuery->endpoint);
      $this->_auth = urldecode($sqlQuery->auth);
      $this->_p256dh = urldecode($sqlQuery->p256dh);
      $this->_signUpTime = strtotime(urldecode($sqlQuery->sign_up_date));
    }
  }

  public function getId() {
    return $this->_id;
  }

  public function getEndpoint() {
    return $this->_endpoint;
  }

  public function getAuth() {
    return $this->_auth;
  }

  public function getP256dh() {
    return $this->_p256dh;
  }

  public function getSignUpTime() {
    return $this->_signUpTime;
  }
}

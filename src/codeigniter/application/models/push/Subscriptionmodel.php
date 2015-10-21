<?php

class SubscriptionModel extends CI_Model {

  private $_id;
  private $_endpoint;
  private $_signUpTime;

  function __construct($sqlQuery = null) {
    // Call the Model constructor
    parent::__construct();

    if($sqlQuery) {
      $this->_id = urldecode($sqlQuery->subscription_id);
      $this->_endpoint = urldecode($sqlQuery->endpoint);
      $this->_signUpTime = strtotime(urldecode($sqlQuery->sign_up_date));
    }
  }

  public function setSubscriptionId($id) {
    $this->_id = $id;
  }

  public function getId() {
    return $this->_id;
  }

  public function setEndpoint($endpoint) {
      $this->_endpoint = urldecode($endpoint);
  }

  public function getEndpoint() {
    return $this->_endpoint;
  }

  public function getSignUpTime() {
    return $this->_signUpTime;
  }
}

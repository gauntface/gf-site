<?php

class SubscriptionsModel extends CI_Model {

  function __construct() {
    // Call the Model constructor
    parent::__construct();

    $this->load->database();
    $this->load->dbforge();
    $this->load->dbutil();

    $this->createTable();
  }

  public function createTable() {
    $fields = array(
      'subscription_id' => array(
        'type' => 'int(11)',
        'unsigned' => TRUE,
        'null' => FALSE,
        'auto_increment' => TRUE
      ),
      'sign_up_date' => array(
        'type' => 'DATETIME',
        'null' => FALSE
      ),
      'endpoint' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      )
    );
    $this->dbforge->add_field($fields);
    $this->dbforge->add_key('subscription_id', TRUE);
    $this->dbforge->create_table('push_subscriptions_table', TRUE);
  }

  public function getSubscriptionByEndpoint($endpoint) {
    $this->load->model('push/SubscriptionModel');

    $sql = "SELECT * FROM push_subscriptions_table WHERE endpoint = ?";
    $query = $this->db->query($sql, array(urlencode($endpoint)));

    if($query->num_rows() == 0) {
        return null;
    } else if($query->num_rows() != 1) {
      log_message('error', '[SubscriptionsModel.php getSubscriptionById()] More than one result returned for a subscription ID.');
      throw new Exception('Multiple subscriptions found with ID: '.$endpoint);
    }

    $row = $query->row();
    return new SubscriptionModel($row);
  }

  public function getSubscriptionsCount() {
    $sql = "SELECT COUNT(*) AS subscription_count FROM push_subscriptions_table";
    $query = $this->db->query($sql);
    return $query->result()[0]->subscription_count;
  }

  public function getSubscriptions($startIndex, $numberOfResults) {
    $this->load->model('push/SubscriptionModel');

    $sqlVaraibles = array();
    $sql = "SELECT * FROM push_subscriptions_table";
    $sql .= " ORDER BY sign_up_date DESC LIMIT ?, ?";

    array_push($sqlVaraibles, intval($startIndex), intval($numberOfResults));
    $query = $this->db->query($sql, $sqlVaraibles);

    $reslts = array();
    foreach ($query->result() as $row) {
      array_push($reslts, new SubscriptionModel($row));
    }

    return $reslts;
  }

  public function insertSubscription($subscriptionEndpoint) {
    $sql = "INSERT INTO push_subscriptions_table (
      sign_up_date,
      endpoint
      ) VALUES (
      now(),
      ?
      )";
    $this->db->query($sql, array(
      urlencode($subscriptionEndpoint)
    ));

    return $this->db->insert_id();
  }

  public function deleteSubscription($endpoint) {
    $sql = "DELETE FROM push_subscriptions_table WHERE endpoint = ?";
    $this->db->query($sql, array(
      urlencode($endpoint)
    ));

    return $this->db->affected_rows() > 0;
  }
}

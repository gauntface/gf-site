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
        'null' => FALSE,
      ),
      'auth' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'p256dh' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      )
    );

    if ($this->db->table_exists('push_subscriptions_table')) {
      $this->manageUpdate($fields);
    } else {
      $this->dbforge->add_field($fields);
      $this->dbforge->add_key('subscription_id', TRUE);
      $this->dbforge->create_table('push_subscriptions_table');
    }
  }

  private function manageUpdate($fields) {
    $newFields = array();
    foreach ($fields as $key => $value) {
      // Add field if it doesn't exists
      if ($this->db->field_exists($key, 'push_subscriptions_table')) {
        continue;
      }

      $newFields[$key] = $value;
    }

    $this->dbforge->add_column('push_subscriptions_table', $newFields);
  }

  public function getSubscriptionByEndpoint($endpoint) {
    $this->load->model('data/push/SubscriptionModel');

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

  public function insertSubscription($subscriptionObject) {
    $sql = "INSERT INTO push_subscriptions_table (
      sign_up_date,
      endpoint,
      auth,
      p256dh
      ) VALUES (
      now(),
      ?,
      ?,
      ?
      )";
    $this->db->query($sql, array(
      urlencode($subscriptionObject['endpoint']),
      urlencode($subscriptionObject['keys']['auth']),
      urlencode($subscriptionObject['keys']['p256dh'])
    ));

    return $this->db->insert_id();
  }

  public function deleteSubscription($subscriptionId) {
    $sql = "DELETE FROM push_subscriptions_table WHERE subscription_id = ?";
    $this->db->query($sql, array(
      $subscriptionId
    ));

    return $this->db->affected_rows() > 0;
  }
}

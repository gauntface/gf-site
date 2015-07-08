<?php

class BlogModel extends CI_Model {

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
      'post_id' => array(
        'type' => 'int(11)',
        'unsigned' => TRUE,
        'null' => FALSE,
        'auto_increment' => TRUE
      ),
      'publish_date' => array(
        'type' => 'DATETIME',
        'null' => TRUE,
      ),
      'draft_date' => array(
        'type' => 'DATETIME',
        'null' => FALSE
      ),
      'post_title' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_author' => array(
        'type' =>'VARCHAR',
        'constraint' => '100',
        'default' => 'Matt Gaunt',
      ),
      'post_excerpt' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_markdown' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_keyart' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_keyart_prim_color' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_keyart_bg_color' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_slug' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_status' => array(
        'type' =>'VARCHAR',
        'constraint' => '100',
        'default' => 'draft',
      )
    );
    $this->dbforge->add_field($fields);
    $this->dbforge->add_key('post_id', TRUE);
    $this->dbforge->create_table('posts_table', TRUE);
  }

  // This is from draft_date as it's for the admin panel
  public function getDraftPosts($startIndex = 0, $numberOfResults = 20, $sort_field = 'draft_date') {
    $sql = "SELECT * FROM posts_table WHERE post_status != 'deleted' ORDER BY ".$sort_field." DESC LIMIT ?, ?";
    $query = $this->db->query($sql, array(intval($startIndex), intval($numberOfResults)));

    $reslts = array();
    foreach ($query->result() as $row) {
      $postDetails = $this->getArrayFromRow($row);
      array_push($reslts, new BlogPostModel($postDetails));
    }

    return $reslts;
  }
}

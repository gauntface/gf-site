<?php

class PostsModel extends CI_Model {

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
      'post_grey_scale_img' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_main_img' => array(
        'type' => 'TEXT',
        'null' => TRUE,
      ),
      'post_main_img_bg_color' => array(
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

  public function getPostById($postId) {
    $this->load->model('blog/SinglePostModel');

    $sql = "SELECT * FROM posts_table WHERE post_id = ?";
    $query = $this->db->query($sql, array(intval($postId)));

    if($query->num_rows() == 0) {
        return null;
    } else if($query->num_rows() != 1) {
      log_message('error', '[PostsModel.php getPostById()] More than one result returned for a post ID.');
      throw new Exception('Multiple posts found with ID: '.$postId);
    }

    $row = $query->row();
    return new SinglePostModel($row);
  }

  public function getPostByDetails($year, $month, $day, $slug) {
    $this->load->model('blog/SinglePostModel');

    $sql = "SELECT * FROM posts_table WHERE DATE(publish_date) = ? AND post_slug = ?";
    $query = $this->db->query($sql, array($year.'-'.$month.'-'.$day, $slug));

    if($query->num_rows() == 0) {
        return null;
    } else if($query->num_rows() != 1) {
      log_message('error', '[PostsModel.php getPostById()] More than one result returned for a post ID.');
      throw new Exception('Multiple posts found with ID: '.$postId);
    }

    $row = $query->row();
    return new SinglePostModel($row);
  }

  // This is from draft_date as it's for the admin panel
  public function getDraftPosts(
    $startIndex = 0,
    $numberOfResults = 20,
    $sort_field = 'draft_date') {
    return $this->getPosts($startIndex, $numberOfResults, $sort_field);
  }

  public function getPublishedPosts(
    $startIndex = 0,
    $numberOfResults = 20,
    $sort_field = 'draft_date') {
      return $this->getPosts($startIndex, $numberOfResults, $sort_field, 'published');
  }

  public function getPublishedPostCount() {
    $sql = "SELECT COUNT(*) AS post_count FROM posts_table WHERE post_status = 'published'";
    $query = $this->db->query($sql);
    return $query->result()[0]->post_count;
  }

  private function getPosts($startIndex, $numberOfResults, $sort_field, $postStatus = null) {
    $this->load->model('blog/SinglePostModel');

    $sqlVaraibles = array();
    $sql = "SELECT * FROM posts_table WHERE post_status != 'deleted'";
    if(isset($postStatus)) {
      $sql .= " AND post_status = ?";
      array_push($sqlVaraibles, $postStatus);
    }
    $sql .= " ORDER BY ".$sort_field." DESC LIMIT ?, ?";

    array_push($sqlVaraibles, intval($startIndex), intval($numberOfResults));
    $query = $this->db->query($sql, $sqlVaraibles);

    $reslts = array();
    foreach ($query->result() as $row) {
      array_push($reslts, new SinglePostModel($row));
    }

    return $reslts;
  }

  public function insertPost($singlePostModel) {
    $sql = "INSERT INTO posts_table (
      draft_date,
      post_title,
      post_excerpt,
      post_markdown,
      post_grey_scale_img,
      post_main_img,
      post_main_img_bg_color
      ) VALUES (
      now(),
      ?,
      ?,
      ?,
      ?,
      ?,
      ?
      )";
    $this->db->query($sql, array(
      urlencode($singlePostModel->getTitle()),
      urlencode($singlePostModel->getExcerptMarkdown()),
      urlencode($singlePostModel->getContentMarkdown()),
      urlencode($singlePostModel->getGreyScaleImg()),
      urlencode($singlePostModel->getMainImg()),
      urlencode($singlePostModel->getMainImgBgColor()),
    ));

    return $this->db->insert_id();
  }

  public function updatePost($singlePostModel) {
    $sql = "UPDATE posts_table SET
      post_title = ?,
      post_excerpt = ?,
      post_markdown = ?,
      post_grey_scale_img = ?,
      post_main_img = ?,
      post_main_img_bg_color = ?
      WHERE post_id = ?";

    $this->db->query($sql, array(
      urlencode($singlePostModel->getTitle()),
      urlencode($singlePostModel->getExcerptMarkdown()),
      urlencode($singlePostModel->getContentMarkdown()),
      urlencode($singlePostModel->getGreyScaleImg()),
      urlencode($singlePostModel->getMainImg()),
      urlencode($singlePostModel->getMainImgBgColor()),
      $singlePostModel->getPostId(),
      ));

    return $this->db->affected_rows() > 0;
  }

  public function deletePost($singlePostModel) {
    $sql = "UPDATE posts_table SET post_status = 'deleted' WHERE post_id = ?";

    $this->db->query($sql, array(
      $singlePostModel->getPostId()
      ));

    return $this->db->affected_rows() > 0;
  }

  public function publishPost($singlePostModel) {
    $this->load->helper('slug');

    $sql = "UPDATE posts_table SET post_status = 'published', publish_date = (now()), post_slug = ? WHERE post_id = ?";

    $this->db->query($sql, array(
      slugify($singlePostModel->getTitle()),
      $singlePostModel->getPostId()
      ));

    return $this->db->affected_rows() > 0;
  }
}

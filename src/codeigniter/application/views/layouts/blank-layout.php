<?php
$this->load->view('templates/header', $page);
if (isset($contentview)) {
  $this->load->view($contentview);
}
$this->load->view('templates/footer', $page);

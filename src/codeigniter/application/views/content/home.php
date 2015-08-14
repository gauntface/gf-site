<?php

$this->load->view('templates/header', $page);
$this->load->view('components/appbar');
$this->load->view('components/home-header');

if (isset($blogTitleModel)) {
  $this->load->view('components/title-block-item', array('title' => $blogTitleModel));
}
?>
<div class="split-section--half-container">
  <?php
  $this->load->view('components/youtube-block');
  $this->load->view('components/twitter-block', array('title' => $tweetTitleModel));
  ?>
</div>

<?php
$this->load->view('components/title-block-item', array('title' => $bottomTitleModel));
$this->load->view('components/block-footer');

$this->load->view('templates/footer', $page);

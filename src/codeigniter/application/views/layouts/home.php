<?php

$this->load->view('templates/header', $page);
$this->load->view('styleguide/components/appbar');
$this->load->view('styleguide/components/home-header');

if (isset($blogTitleModel)) {
  $this->load->view('styleguide/components/title-block-item', array('title' => $blogTitleModel));
}
?>
<div class="split-section--half-container">
  <?php
  $this->load->view('styleguide/components/youtube-block');
  $this->load->view('styleguide/components/twitter-block', array('title' => $tweetTitleModel));
  ?>
</div>

<?php
$this->load->view('styleguide/components/title-block-item', array('title' => $bottomTitleModel));
$this->load->view('styleguide/components/block-footer');

$this->load->view('templates/footer', $page);

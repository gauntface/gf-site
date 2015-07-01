<?php

$this->load->view('templates/header', $page);
$this->load->view('styleguide/components/appbar');
$this->load->view('styleguide/components/home-header');
$this->load->view('styleguide/components/title-block-item');

?>
<div class="grid-container--half">
  <?php
  $this->load->view('styleguide/components/youtube-block');
  $this->load->view('styleguide/components/twitter-block');
  ?>
</div>

<?php
$this->load->view('styleguide/components/title-block-item');
$this->load->view('styleguide/components/footer');

$this->load->view('templates/footer', $page);

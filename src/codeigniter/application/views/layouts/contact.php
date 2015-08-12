<?php

$this->load->view('templates/header', $page);
$this->load->view('styleguide/components/appbar');

$this->load->view('styleguide/components/title-block-item', array('title' => $title));
?>

<p class="u-center">Send me an email or <a href="https://twitter.com/gauntface">tweet</a></p>

<section class="contact__message-form-container">
  <p><input type="text" placeholder="Name" /></p>
  <p><input type="text" placeholder="Email" /></p>
  <p><textarea placeholder="Message"></textarea></p>
  <p class="u-center"><button>Send</button></p>
</section>

<?php
$this->load->view('styleguide/components/block-footer');

$this->load->view('templates/footer', $page);

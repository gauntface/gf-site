<?php

$this->load->view('templates/header', $page);
$this->load->view('components/appbar');

$this->load->view('components/title-block-item', array('title' => $title));
?>

<p class="u-center contact--flex-grow">Send me an <a href="mailto:gauntface.site@gauntface.co.uk">email</a> or <a href="https://twitter.com/gauntface">tweet</a></p>

<?php
/** <section class="contact__message-form-container">
  <p class="u-center">This form will be enabled soon, sorry for the delay.</p>
  <p><input type="text" placeholder="Name" disabled /></p>
  <p><input type="text" placeholder="Email" disabled /></p>
  <p><textarea placeholder="Message" disabled ></textarea></p>
  <p class="u-center"><button disabled >Send</button></p>
</section> **/
?>

<?php
$this->load->view('components/footer');

$this->load->view('templates/footer', $page);

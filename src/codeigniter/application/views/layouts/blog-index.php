<?php

$this->load->view('templates/header', $page);
$this->load->view('styleguide/components/appbar');

?>

<section class="blog-index__list-container">

<?php
for($i = 0; $i < count($postTitles); $i++) {
  $this->load->view('styleguide/components/title-block-item', array('title' => $postTitles[$i]));
}
?>

</section>

<?php
$this->load->view('styleguide/components/block-footer');
$this->load->view('templates/footer', $page);

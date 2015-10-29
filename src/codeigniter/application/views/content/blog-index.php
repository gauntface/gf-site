<?php

$this->load->view('templates/header', $page);
$this->load->view('components/appbar');

?>

<section class="blog-index__list-container">

<?php
for($i = 0; $i < count($postTitles); $i++) {
  $this->load->view('components/title-block-item', array('title' => $postTitles[$i]));
}
?>

</section>

<?php
$this->load->view('components/footer');
$this->load->view('templates/footer', $page);

<?php
$currentBodyClass = $page->getBodyClass();
$currentBodyClass .= ' grid-container--content-style';
$page->setBodyClass($currentBodyClass);

$this->load->view('templates/header', $page);
$this->load->view('styleguide/components/appbar');
?>

<div class="grid-container__left-section--content-style"></div>

<div class="grid-container__right-section--content-style">
  <div class="grid-container_right-section-content--content-style">
  <?php
  $this->load->view('styleguide/components/title-block-item', $page);

  if ($contentgrid && $contentgrid->getRightContentView()) {
    $this->load->view($contentgrid->getRightContentView(), $contentgrid->getContentData());
  }

  $this->load->view('styleguide/components/footer', $page);
  ?>
  </div>
</div>

<?php
$this->load->view('templates/footer', $page);

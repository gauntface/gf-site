<?php
$currentBodyClass = $page->getBodyClass();
$currentBodyClass .= ' content-split__container';
$page->setBodyClass($currentBodyClass);

$this->load->view('templates/header', $page);
$this->load->view('components/appbar');
?>

<div class="content-split__left-section"></div>

<div class="content-split__right-section">
  <div class="content-split__right-section-container">
    <?php
    $this->load->view('components/title-block-item', $page);

    if ($contentgrid && $contentgrid->getRightContentView()) {
      $this->load->view($contentgrid->getRightContentView(), $contentgrid->getContentData());
    }

    $this->load->view('components/footer', $page);
    ?>
  </div>
</div>

<?php
$this->load->view('templates/footer', $page);

<?php

if (!$model || !$model['post']) {
  show_404();
  return;
}

$post = $model['post'];
$images = $model['images'];

$greyScaleImg = $post->getGreyScaleImg();
$greyScaleImg = $greyScaleImg ? $greyScaleImg : '';

$mainImg = $post->getMainImg();
$mainImg = $mainImg ? $mainImg : '';
?>
<section class="blogcreate__create-section">
  <div class="tabs__tab-btn-container">
    <button class="tabs__tab-btn js-tab-view__tab-btn tab-view__is-selected" data-tab-view-content="js-tab-view__meta-content">Meta Data</button>
    <button class="tabs__tab-btn js-tab-view__tab-btn" data-tab-view-content="js-tab-view__markdown-content">Markdown</button>
    <button class="tabs__tab-btn js-tab-view__tab-btn" data-tab-view-content="js-tab-view__media-content">Media</button>
    <button class="tabs__tab-btn js-tab-view__tab-btn" data-tab-view-content="js-tab-view__publish-content">Publish</button>

    <div class="saving-spinner js-saving-spinner"><?php $this->load->view('components/spinner'); ?></div>
    <button class="js-post-delete">
      <img src="/images/components/admin/admin-bin.svg" alt="Delete Post" />
    </button>
  </div>

  <div class="tabs__content-container">

    <!-- Meta Data Tab -->
    <div class="tabs__tab-content blogcreate__tabs-contents--meta-data js-tab-view__meta-content tab-view__is-selected">
      <h6 class="blog-editor__form-heading">Title</h6>

      <input class="js-title-input is-dark" type="text" value="<?php echo $post->getTitle(); ?>"/>

      <h6 class="blog-editor__form-heading">Excerpt</h6>

      <textarea class="blogcreate__excerpt-textarea js-excerpt-textarea is-dark"><?php echo $post->getExcerptMarkdown(); ?></textarea>

      <h6 class="blog-editor__form-heading">Greyscale Image</h6>

      <p><img class="blogcreate__grey-scale-img js-grey-scale-img" src="<?php echo $post->getGreyScaleImg(); ?>" alt="Grey scale image for blog post." /></p>

      <h6 class="blog-editor__form-heading">Main Image</h6>

      <div class="image-manager">
        <div class="image-container">
          <img class="blogcreate__main-img js-main-img" crossorigin="anonymous" src="<?php echo $post->getMainImg(); ?>" alt="Main image for blog post." />
        </div>
        <div class="colors-container">
          <div class="selected-color js-main-img-current-color" style="background-color: <?php echo $post->getMainImgBgColor(); ?>;"></div>
          <div class="color-options js-main-img-bg-color-options"></div>
        </div>
      </div>
      <p></p>
    </div>

    <!-- Markdown Tab -->
    <div class="tabs__tab-content blogcreate__tabs-contents--markdown  js-tab-view__markdown-content">
      <textarea class="blogcreate__markdown-textarea js-markdown-textarea"><?php echo $post->getContentMarkdown(); ?></textarea>
    </div>

    <!-- Media Tab -->
    <div class="tabs__tab-content blogcreate__tabs-contents--media js-tab-view__media-content">
      <?php
      for($i = 0; $i < count($images); $i++) {
        $image = $images[$i];
        $pathInfo = pathinfo($image['name']);
        if (!isset($pathInfo["dirname"]) || !isset($pathInfo["filename"]) || !isset($pathInfo["extension"])) {
          continue;
        }
        $imgSrc = $pathInfo["dirname"].'/'.$pathInfo["filename"].'_180x180x1.'.$pathInfo["extension"];
        $markdown = "![Alt Text](/static/image/".$image['name']." \"500\")";
      ?>
        <div class="media-img">
          <img src="/static/image/<?php echo($imgSrc); ?>" width="180px" height="180px" data-imgname="<?php echo($image['name']); ?>"/>
          <button class="media-button js-copy-clipboard" data-copy="<?php echo($markdown); ?>">Copy to Clipboard</button>
        </div>
      <?php } ?>
    </div>

    <!-- Publish Tab-->
    <div class="tabs__tab-content blogcreate__tabs-contents--publish  js-tab-view__publish-content">
      <p>Current Status: <span class="js-publish__current-status"><?php echo $post->getPostStatus(); ?></span></p>
      <?php if($post->isPublished()) { ?>
      <p>Published On: <?php echo $post->getPublishTime(); ?></p>
      <?php } ?>
      <p><button class="js-publish-btn"<?php if($post->isPublished()) { echo 'disabled'; } ?>>Publish that Bad Boy</button></p>
    </div>
  </div>
</section>
<iframe class="blogcreate__preview js-blogcreate__preview" src="/blog/view/<?php echo $post->getPostId(); ?>"></iframe>

<div class="full-page-overlay js-drag-over-view__drag-container">
  <h1 class="drag-over-view__message">
    Drop Image File Here
  </h1>
</div>

<div class="full-page-overlay js-loading-over-view__container">
  <div class="loading-spinner"></div>
  <p>Uploading</p>
</div>

<div class="full-page-overlay js-upload-use__container">
  <h1>What Would You Like to do?</h1>
  <p><button class="js-upload-use__grey-scale-btn">Use as Grey Scale Image</button></p>
  <p><button class="js-upload-use__main-img-btn">Use as Main Post Image</button></p>
  <p><button class="js-upload-use__copy-markdown-btn">Copy Markdown</button></p>
</div>
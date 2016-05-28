<?php
$title = $model->getTitle();
if (strlen($title) == 0) {
  $title = 'This draft doesn\'t have a title';
}
?>
<a class="admin-blog-item-anchor" href="/admin/blog/edit/<?php echo $model->getPostId(); ?>">
  <div class="admin-blog-item"><?php echo $title ?></div>
</a>

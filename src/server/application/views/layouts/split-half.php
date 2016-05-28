<div class="split-section--half-container">
<?php
$components = $model->getComponents();
foreach($components as $component) {
  $component->loadView();
}
?>
</div>

<div class="split-section--half-container">
<?php
echo $this->_view->render(['element' => $left['id']], $left['data']);
echo $this->_view->render(['element' => $right['id']], $right['data']);
?>
</div>

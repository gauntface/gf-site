<?php
use lithium\net\http\Media;

$this->styles('/styles/components/split-section/split-section-inline.css');
?>
<div class="split-section">
<?php
echo $this->_view->render(['element' => $left['id']], $left['data']);
echo $this->_view->render(['element' => $right['id']], $right['data']);
?>
</div>

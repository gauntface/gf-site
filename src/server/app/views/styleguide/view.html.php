<?php
if (!$data) {
  $data = [];
}
echo $this->_view->render(['element' => $id], $data);
echo $this->_view->render(['element' => 'grid-overlay']);
?>

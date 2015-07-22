<?php

if (!isset($postModel)) {
  return;
}

echo ($postModel->getContentHTML());

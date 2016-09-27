<?php

// if (!$page) {
//  show_404();
//  return;
// }

$document = $model;
$appshell = $model->getAppShell();
$page = $model->getPage();;

$this->load->view('documents/standard/open-page', array(
  'document' => $document,
  'appshell' => $appshell,
  'page' => $page
));

if ($appshell) {
  $appshell->loadView();
}

$this->load->view('documents/standard/close-page', array(
  'document' => $document,
  'appshell' => $appshell,
  'page' => $page
));

<?php

if (!$page) {
  show_404();
  return;
}

$this->load->view('documents/standard/open-page', $this);

$appshell->loadView();

$this->load->view('documents/standard/close-page', $this);

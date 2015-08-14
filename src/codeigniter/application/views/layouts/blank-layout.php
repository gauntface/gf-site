<?php
$currentBodyClass = $page->getBodyClass();
$currentBodyClass .= ' content-split__container';
$page->setBodyClass($currentBodyClass);

$this->load->view('templates/header', $page);

$this->load->view($contentview);

$this->load->view('templates/footer', $page);

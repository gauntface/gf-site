<?php
use lithium\core\Environment;

function ob_html_compress($buf){
	return preg_replace(array('/<!--(.*)-->/Uis',"/[[:blank:]]+/"),array('',' '),str_replace(array("\n","\r","\t"),'',$buf));
}

if (!(Environment::is('development'))) {
	ob_start("ob_html_compress");
}

echo $this->_view->render(['element' => 'document'], [
	'content' => $this->content()
]);

if (!(Environment::is('development'))) {
	ob_end_flush();
}
?>

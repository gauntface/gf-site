<?php

namespace app\controllers;

use lithium\net\http\Media;
use app\utilities\Revision;

class ServiceworkerController extends \lithium\action\Controller {

  public function index() {
    $webrootPath = Media::webroot(true);
    $swTemplatePath = $webrootPath.'/serviceworker.tmpl.js';
    $swTemplate = file_get_contents($swTemplatePath);

    // Configure the moddate comment
    $moddateComment =
      "/** ".date("F d Y H:i:s", filemtime($swTemplatePath))." **/";
    $swTemplate = str_replace("/** @ GF-MODDATE @ **/", $moddateComment, $swTemplate);

    // Configure the revision assets
    $revisionedAssets = array(
      Revision::addRevision('/scripts/controllers/async-styles-controller.js'),
      Revision::addRevision('/scripts/controllers/service-worker-controller.js'),
    );
    $revisionedAssetsString = " = ".json_encode($revisionedAssets);
    $swTemplate = str_replace("; /** @ GF-REVISIONED-ASSETS @ **/", $revisionedAssetsString, $swTemplate);

    return array(
      'swContent' => $swTemplate
    );
	}
}

?>

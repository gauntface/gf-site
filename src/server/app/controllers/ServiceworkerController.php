<?php

namespace app\controllers;

use lithium\net\http\Media;
use lithium\template\View;
use app\utilities\Revision;
use app\controllers\DocumentController;

class ServiceworkerController extends \lithium\action\Controller {

  public function index() {
    $webrootPath = Media::webroot(true);
    $swTemplatePath = $webrootPath.'/serviceworker.tmpl.js';
    $swTemplate = file_get_contents($swTemplatePath);

    // Configure the moddate comment
    $moddateComment =
      "/** ".date("F d Y H:i:s", filemtime($swTemplatePath))." **/";
    $swTemplate = str_replace("/** @ GF-MODDATE @ **/", $moddateComment, $swTemplate);

    $swLibImport = "importScripts('" .
      Revision::addRevision('/third_party/sw-lib.min.js') .
      "');";
    $swTemplate = str_replace("/** @ GF-SWLIB-IMPORT @ **/", $swLibImport, $swTemplate);

    // Configure the revision assets
    $revisionedAssets = array(
      // Scripts
      Revision::addRevision('/scripts/controllers/async-styles-controller.js'),
      Revision::addRevision('/scripts/controllers/async-iframe-controller.js'),
      Revision::addRevision('/scripts/controllers/async-font-controller.js'),
      Revision::addRevision('/scripts/controllers/service-worker-controller.js'),

      // Styles
      Revision::addRevision('/styles/components/home-header/home-header-remote.css')
    );

    $revisionedAssetsString = $this->formatArrayToJSString($revisionedAssets);
    $swTemplate = str_replace("; /** @ GF-REVISIONED-ASSETS @ **/", $revisionedAssetsString, $swTemplate);

    $unrevisionedAssets = array();
    $unrevisionedAssetsString = " = ".json_encode($unrevisionedAssets);
    $swTemplate = str_replace("; /** @ GF-UNREVISIONED-ASSETS @ **/", $unrevisionedAssetsString, $swTemplate);

    return array(
      'swContent' => $swTemplate
    );
	}

  private function formatArrayToJSString($arrayData) {
    return " = [\n  '".implode("',\n  '", $arrayData)."'\n];";
  }
}

?>

<?php

set_include_path(APPPATH.'third_party/'.PATH_SEPARATOR.get_include_path());

require_once APPPATH.'libraries/Parsedown.php';
require_once APPPATH.'third_party/geshi-1.0-RELEASE_1_0_8_12/src/geshi.php';

class Standardmarkdownparser extends Parsedown {

  private $_inlineStyles;

  public function text($Text) {
    $this->_inlineStyles = array();

    $output = parent::text($Text);

    return array(
      "content" => $output,
      "inlineStyles" => $this->_inlineStyles
    );
  }
  protected function inlineImage($Excerpt) {
    $Image = parent::inlineImage($Excerpt);

    $origSrcURL = $Image['element']['attributes']['src'];
    $pathInfo = pathinfo($origSrcURL);
    if($pathInfo["extension"] === 'gif' || strpos($origSrcURL, 'http') === 0) {
      // Either the image is a gif OR its for an external ResourceBundle
      return $Image;
    }

    // height of 0 means keep the aspect ratio - only worry about width.
    $maxDensity = 3;
    $interval = 100;
    $minWidth = 100;
    $maxWidth = 500 * $maxDensity;
    $height = 0;

    $srcset = array();
    for ($i = $minWidth; $i <= $maxWidth; $i += $interval) {
      $imageUrl = $pathInfo["dirname"].'/'.$pathInfo["filename"].'_'.$i.'x'.$height.'x1.'.$pathInfo["extension"];
      $imageWidth = $i."w";
      array_push($srcset, $imageUrl." ".$imageWidth);
    }

    // For small screens it's always 100vw -48px;
    // When window is big enough, content is capped (432 = 480 - 48);
    $sizes = array(
      '(max-width: 480px) calc(100vw - 48px)',
      '432px'
    );

    $Image['element']['attributes']['srcset'] = implode(",\n", $srcset);
    $Image['element']['attributes']['sizes'] = implode(",\n", $sizes);

    return $Image;
  }

  protected function lines(array $lines) {
    $outputArray = array();
    foreach ($lines as $line) {
      if (preg_match("/<div.*class=\"embed\".*>/", $line) == 1 || preg_match("/<iframe.*>/", $line) == 1) {
        array_push($this->_inlineStyles, "/styles/elements/iframe.css");
      }
    }

    return parent::lines($lines);
  }

  protected function blockCodeComplete($Block = null) {
    $Block = parent::blockCodeComplete($Block);

    array_push($this->_inlineStyles, "/styles/elements/code.css");

    $rawSrc = $Block['element']['text']['text'];
    $firstLine = strtok($rawSrc, "\n");
    $language = $this->findLanguage($firstLine);
    if (!$language) {
      return $Block;
    }

    array_push($this->_inlineStyles, "/styles/elements/geshi-code.css");

    // Remove First Line Here
    // Plus one to include the new line character
    $srcCode = substr($rawSrc, strlen($firstLine)+1);
    $cleanSrcCode = $srcCode;

    $geshi = new GeSHi($cleanSrcCode, $language);
    $geshi->enable_classes();
    $geshi->set_overall_class('geshi_highlight');
    $geshi->set_tab_width(2);
    $geshi->set_header_type(GESHI_HEADER_DIV);
    $highlighted = $geshi->parse_code();

    // This was based on var_dump($Block) of the rawSrc
    return array(
      "element" => array(
        "name" => "div",
        "attributes" => array(
          "class" => "geshi_highlight__container"
        ),
        "text" => $highlighted
      ),
      "type" => "Code",
      "identified" => true,
      "continuable" => true,
      "interrupted" => true
    );
  }

  function findLanguage($firstLine) {
    $firstLine = strtolower(trim($firstLine));
    $languages = array("javascript", "php", "java", "css", "html", "xml", "python", "bash");

    for($i = 0; $i < count($languages); $i++) {
      if($firstLine == strtolower($languages[$i])) {
        return $firstLine;
      }
    }

    return false;
  }
}

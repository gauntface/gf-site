<?php

defined('BASEPATH') OR exit('No direct script access allowed');

set_include_path(APPPATH.'third_party/'.PATH_SEPARATOR.get_include_path());

require_once APPPATH.'third_party/Md/MarkdownInterface.php';
require_once APPPATH.'third_party/Md/Markdown.php';
require_once APPPATH.'third_party/geshi-1.0-master/src/geshi.php';

class Md extends Michelf\Markdown {

  function __construct($params = array()) {
    parent::__construct();
  }

  function _doCodeBlocks_callback($matches) {
    $rawSrc = trim($matches[0], "\n");
    $firstLine = strtok($rawSrc, "\n");
    $language = $this->findLanguage($firstLine);
    if(!$language) {
      // Not a safe language so do default
      return parent::_doCodeBlocks_callback($matches);
    }

    // Remove First Line Here
    // Plus one to include the new line character
    $srcCode = substr($rawSrc, strlen($firstLine)+1);
    $cleanSrcCode = $this->cleanSrc($srcCode);

    $geshi = new GeSHi($cleanSrcCode, $language);
    $geshi->enable_classes();
    $geshi->set_overall_class('geshi_highlight');
    $geshi->set_tab_width(2);
    $geshi->set_header_type(GESHI_HEADER_DIV);
    $highlighted = $geshi->parse_code();

    return "\n\n".$this->hashBlock("<div class=\"geshi_highlight__container\">".$highlighted."</div>")."\n\n";
  }

  function findLanguage($firstLine) {
    // TODO: Make this case insensitive
    $firstLine = strtolower(trim($firstLine));
    $languages = array("javascript", "php", "java", "css", "html", "xml", "python", "bash");

    for($i = 0; $i < count($languages); $i++) {
      if($firstLine == strtolower($languages[$i])) {
        return $firstLine;
      }
    }

    return false;
  }

  // This method goes through the source code and removes the
  // initial 4 spaces required to render this as code.
  function cleanSrc($rawSrc) {
    $srcLines = explode("\n" , $rawSrc);
    $cleanSrc = '';
    for($i = 0; $i < count($srcLines); $i++) {
      $cleanSrc .= substr($srcLines[$i], 4);
      // Avoid adding new line to end of code
      if($i+1 < count($srcLines)) {
        $cleanSrc .= "\n";
      }
    }

    return $cleanSrc;
  }

  protected function _doImages_inline_callback($matches) {
    $whole_match    = $matches[1];
    $alt_text       = $matches[2];
    $url            = $matches[3] == '' ? $matches[4] : $matches[3];
    $title          =& $matches[7];

    log_message('error', '_doImages_inline_callback');

    // Parsed Results
    $alt_text = $this->encodeAttribute($alt_text);
    $url = $this->encodeAttribute($url);
    $pathInfo = pathinfo($url);

    $result = "<span class=\"blog-img-center\">";

    if(strtolower($pathInfo["extension"]) == 'gif' || strpos($url, 'http') === 0) {
      // Do Nothing to gifs
      $result .= $this->getImageString($url, $pathInfo, $alt_text, null, null, null);
      $result .= "</span>";
      return $this->hashPart($result);
    }

    $height = 0;
    $minWidth = 300;
    $maxWidth = 0;
    $widthInterval = 50;
    $densities = array(1, 2, 3, 4);

    if($title) {
      $maxWidth = intval($title);
    }

    if($maxWidth <= 0) {
      // Nothing for us to do
      $result .= $this->getImageString($url, $pathInfo, $alt_text, null, null, null);
      $result .= "</span>";
      return $this->hashPart($result);
    }

    $pictureString = $this->getPictureString($url, $pathInfo, $alt_text, $maxWidth, $minWidth, $height, $widthInterval, $densities);

    $result .= $pictureString."</span>";
    return $this->hashPart($result);
  }

  function getImageString($url, $pathInfo, $altText, $maxWidth, $height, $densities) {
    $imgString = "<img ";
    if(isset($maxWidth) && $maxWidth > 0) {
      $imgString .= "src=\"".$pathInfo["dirname"]."/".$pathInfo["filename"]."_".$maxWidth."x".$height."x1.".$pathInfo["extension"]."\" ";
      $imgString .= "srcset=\"";
      for ($i = 1; $i < count($densities); $i++) {
        $imgString .= $pathInfo["dirname"]."/".$pathInfo["filename"]."_".
          $maxWidth."x".$height."x".$densities[$i].
          ".".$pathInfo["extension"]. " ".$densities[$i]."x";
        if($i+1 < count($densities)) {
          $imgString .= ", ";
        }
      }
      $imgString .= "\"";
    } else {
      $imgString .= "src=\"$url\" ";
    }

    $imgString .= "alt=\"$altText\"";
    $imgString .= $this->empty_element_suffix;
    return $imgString;
  }

  function getPictureString($url, $pathInfo, $altText, $maxWidth, $minWidth, $height, $widthInterval, $densities) {
    $imgString = $this->getImageString($url, $pathInfo, $altText, $maxWidth, $height, $densities);

    $pictureString = "<picture>";
    $currentWidth = $minWidth;
    while($currentWidth <= $maxWidth) {
      $pictureString .= "<source media=\"(max-width: ".$currentWidth."px)\" ";
      $pictureString .= "<source ";
      $pictureString .= "srcset=\"";
      for ($i = 0; $i < count($densities); $i++) {
        $pictureString .= $pathInfo["dirname"]."/".$pathInfo["filename"]."_".
          $currentWidth."x".$height."x".$densities[$i].
          ".".$pathInfo["extension"];
        if($densities[$i] !== 1) {
          $pictureString .= " ".$densities[$i]."x";
        }

        if($i+1 < count($densities)) {
          $pictureString .= ", ";
        }
      }
      $pictureString .= "\"";
      $pictureString .= $this->empty_element_suffix;
      $currentWidth += $widthInterval;
    }
    $pictureString .= $imgString;
    $pictureString .= "</picture>";
    return $pictureString;
  }

}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

require_once APPPATH.'third_party/google-api-php-client/src/Google/autoload.php';
require_once APPPATH.'third_party/google-api-php-client/src/Google/Client.php';
require_once APPPATH.'third_party/google-api-php-client/src/Google/Service/Storage.php';

class ImageProducer extends Base_Controller {

  protected $CLOUD_STORAGE_URL = 'https://storage.googleapis.com/gauntface-site-uploads/';
  protected $URL_CONTROLLER_NAME = 'imageproducer/';

  public function index() {

    $pathinfo = pathinfo($this->uri->uri_string());
    $numOfSegments = $this->uri->total_segments();

    $imageDirectory = '';
    for($i = 2; $i < $numOfSegments; $i++) {
      $imageDirectory .= $this->uri->segment($i);
      if($i + 1 < $numOfSegments) {
        $imageDirectory .= '/';
      }
    }

    $pattern = '/(?P<origfilename>.+)_(?P<width>\d+)x(?P<height>\d+)x(?P<density>\d+)/';
    $patternFound = preg_match($pattern, $pathinfo["filename"], $matches);

    if($patternFound == 0) {
      // The regular expression didn't work, it must be a path to the original image required
      $originalFile = $this->uri->uri_string();

      // original image not found, show 404
      if (!file_exists($originalFile)) {
        $this->show_404();
      }

      $this->serveImage($originalFile);
      return;
    }

    $this->serveUpAppropriateImage($pathinfo, $matches, $imageDirectory);
  }

  private function serveUpAppropriateImage($pathinfo, $matches, $imageDirectory) {
    $this->load->model('CloudStorageModel');

    // Round sizes up to 50 and set density to max of 4
    $width = $this->sanitiseSize($matches["width"]);
    $height = $this->sanitiseSize($matches["height"]);
    $density = $this->sanitiseDensity($matches["density"]);
    $fileName = $matches["origfilename"];
    $fileExtension = $pathinfo["extension"];

    log_message('error', '$width = '.$width);
    log_message('error', '$height = '.$height);
    log_message('error', '$density = '.$density);
    log_message('error', '$imageDirectory = '.$imageDirectory);

    $originalObjectPath = $imageDirectory.'/'.$fileName.'.'.$fileExtension;
    $generatedObjectPath = $this->CloudStorageModel->GENERATED_IMG_DIR.$imageDirectory.'/'.
      $fileName."_".$width."x".$height."x".$density.".".$fileExtension;

    log_message('error', '$originalObjectPath = '.$originalObjectPath);
    log_message('error', '$generatedObjectPath = '.$generatedObjectPath);

    if ($this->CloudStorageModel->doesImageExist($generatedObjectPath) != false) {
      $this->load->helper('url');
      redirect('https://storage.googleapis.com/'.
        $this->config->item('storage-bucketname', 'confidential').
        '/'.$generatedObjectPath, 301);
      return;
    }

    // Get the original image
    if ($this->CloudStorageModel->doesImageExist($originalObjectPath) == false) {
      // If the response is false we can't find the original image to resize
      $this->show_404();
      return;
    }

    // Resize the original image
    $directoryToCopyTo = $this->CloudStorageModel->GENERATED_IMG_DIR.$imageDirectory.'/';
    if(!file_exists($directoryToCopyTo)) {
      $old = umask(0);
      mkdir($directoryToCopyTo, 0777, true);
      umask($old);
    }

    $localOriginalFilepath = $this->CloudStorageModel->GENERATED_IMG_DIR.$originalObjectPath;
    if (!file_exists($localOriginalFilepath)) {
      // File doesn't exist locally so need to attempt a download of it
      $copyUrl = 'https://storage.googleapis.com/'.
        $this->config->item('storage-bucketname', 'confidential').
        '/'.$originalObjectPath;
      copy($copyUrl, $localOriginalFilepath);
    }


    if (!file_exists($localOriginalFilepath)) {
      log_message('error', 'Problem seems to have occured when fetching the '.
        'original file: '.$localOriginalFilepath);
      $this->show_404();
      return;
    }

    // Original exists, so resize it and serve it
    $localResizedFilepath = $generatedObjectPath;
    $this->resizeImage(
      $width,
      $height,
      $density,
      $localOriginalFilepath,
      $localResizedFilepath
    );
    if(!file_exists($localResizedFilepath)) {
      log_message('error', 'Unable to find the resized image.');
      $this->show_404();
      return;
    }

    $this->CloudStorageModel->storeImage($generatedObjectPath, $localResizedFilepath);

    $this->load->helper('url');
    redirect('https://storage.googleapis.com/'.
      $this->config->item('storage-bucketname', 'confidential').
      '/'.$generatedObjectPath, 301);
  }

  private function serveUpAppropriateImageOld($pathinfo, $matches, $imageDirectory) {

    // Round sizes up to 50 and set density to max of 4
    $width = $this->sanitiseSize($matches["width"]);
    $height = $this->sanitiseSize($matches["height"]);
    $density = $this->sanitiseDensity($matches["density"]);

    // Ensure the path exists to add images to
    $directoryToGenerateImages = $this->CloudStorageModel->GENERATED_IMG_DIR.'/'.$imageDirectory.'/'.$matches["origfilename"];
    if(!file_exists($directoryToGenerateImages)) {
      $old = umask(0);
      mkdir($directoryToGenerateImages, 0777, true);
      umask($old);
    }

    // Do we support WebP?
    $position = strpos($_SERVER['HTTP_ACCEPT'], 'image/webp');
    $webpsupport = FALSE;
    if($position !== FALSE && $position >= 0) {
      $webpsupport = TRUE;
    }

    $this->attemptToServeNormal($pathinfo, $matches, $width, $height, $density);
  }

  private function attemptToServeNormal($pathinfo, $matches, $width, $height, $density) {
    // Adjust path to look at the generated content
    // See if we've resized the image already
    $resizedFilepath =
      str_replace(
        $this->URL_CONTROLLER_NAME,
        $this->CloudStorageModel->GENERATED_IMG_DIR,
        $pathinfo["dirname"]
      )."/".
      $matches["origfilename"]."/".
      $matches["origfilename"].
      "_".$width."x".$height."x".$density.
      ".".$pathinfo["extension"];

    log_message('error', 'Looking for: '.$resizedFilepath);

    if (file_exists($resizedFilepath)) {
      log_message('error', 'Resized Image File Found: '.$resizedFilepath);
      $this->serveImage($resizedFilepath);
      return;
    }

    // Resized version doesn't exist, check we have the original
    $originalFilepath = $pathinfo["dirname"]."/".$matches["origfilename"].".".$pathinfo["extension"];
    if (!file_exists($originalFilepath)) {
      log_message('error', 'Original File Not Found: '.$originalFilepath);
      show_404($originalFilepath);
      return;
    }

    // Original exists, so resize it and serve it
    $this->resizeImage(
    $width,
    $height,
    $density,
    $originalFilepath,
    $resizedFilepath);

    if(file_exists($resizedFilepath)) {
      $this->stripMetaData($resizedFilepath);
    }

    // check if the resulting image exists, else show the original
    if (file_exists($resizedFilepath)) {
      $finalFilePath = $resizedFilepath;
    } else {
      $finalFilePath = $originalFilepath;
    }

    $this->serveImage($finalFilePath);
  }

/**function resizeAndConvertImageWebP(
$width,
$height,
$density,
$originalFilepath,
$resizedFilepath) {
$newWidth = $width * $density;
$newHeight = $height * $density;

$image = new Imagick($originalFilepath);

$origImageDimens = $image->getImageGeometry();
$origImgWidth = $origImageDimens['width'];
$origImgHeight = $origImageDimens['height'];

if($newWidth == 0) {
$ratioOfHeight = $newHeight / $origImgHeight;
$newWidth = $origImgWidth * $ratioOfHeight;
}

if($newHeight == 0) {
$ratioOfWidth = $newWidth / $origImgWidth;
$newHeight = $origImgHeight * $ratioOfWidth;
}

$widthRatios = $origImgWidth / $newWidth;
$heightRatios = $origImgHeight / $newHeight;

if($widthRatios <= $heightRatios) {
$cropWidth = $origImgWidth;
$cropHeight = $newWidth * $widthRatios;
} else {
$cropWidth = $newHeight * $heightRatios;
$cropHeight = $origImgHeight;
}

$cropX = ($origImgWidth - $cropWidth) / 2;
$cropY = ($origImgHeight - $cropHeight) / 2;

$image->setImageFormat('webp');
$image->setImageAlphaChannel(imagick::ALPHACHANNEL_ACTIVATE);
$image->setBackgroundColor(new ImagickPixel('transparent'));
$image->stripImage();
$image->cropImage($cropWidth, $cropHeight, $cropX, $cropY);
$image->resizeImage($newWidth, $newHeight, imagick::FILTER_LANCZOS, 0.9);
$image->writeImage($resizedFilepath);
}**/

/**function imageCreateFromAny($filepath) {
$type = exif_imagetype($filepath);
$allowedTypes = array(
1,  // gif
2,  // jpg
//3,  // png
6   // bmp
);
if (!in_array($type, $allowedTypes)) {
return false;
}
switch ($type) {
case 1 :
log_message('error', 'Image is gif');
$im = imageCreateFromGif($filepath);
break;
case 2 :
log_message('error', 'Image is jpeg');
$im = imageCreateFromJpeg($filepath);
break;
case 3 :
log_message('error', 'Image is png');
$im = imageCreateFromPng($filepath);
break;
case 6 :
log_message('error', 'Image is bmp');
$im = imageCreateFromBmp($filepath);
break;
}
return $im;
}**/

  private function resizeImage(
   $width, $height, $density, $originalFilepath, $resizedFilepath) {

    // Check for Image Magick
    if (!extension_loaded('imagick')) {
      log_message('error', 'imagick not installed');
      return;
    }

    if($width == 0 && $height == 0) {
      log_message('error', 'Cannot resize image with both zero width and height');
      return;
    }

    $image = new Imagick($originalFilepath);

    $origImageDimens = $image->getImageGeometry();
    $origImgWidth = $origImageDimens['width'];
    $origImgHeight = $origImageDimens['height'];
    $origImgRatio = $origImgWidth / $origImgHeight;

    $newWidth = $width * $density;
    $newHeight = $height * $density;
    $newImageRatio;

    if($newWidth == 0 || $newHeight == 0) {
      $newImageRatio = $origImgRatio;

      if($newWidth == 0) {
        $newWidth = $newHeight * $newImageRatio;
      } else if($newHeight == 0){
        $newHeight = $newWidth / $newImageRatio;
      }
    } else {
      $newImageRatio = $newWidth / $newHeight;
    }

    if($newWidth > $origImgWidth || $newHeight > $origImgHeight) {
      if($newWidth > $origImgWidth) {
        $newWidth = $origImgWidth;
        $newHeight = $newWidth / $newImageRatio;
      }

      if($newHeight > $origImgHeight) {
        $newHeight = $origImgHeight;
        $newWidth = $newHeight * $newImageRatio;
      }
    }


    $cropImageWidth = $origImgWidth;
    $cropImageHeight = $origImgWidth / $newImageRatio;
    if($newImageRatio < $origImgRatio) {
      // We have use the width ratio.
      $cropImageHeight = $origImgHeight;
      $cropImageWidth = $origImgHeight * $newImageRatio;
    }

    // center the crop
    $cropX = ($origImgWidth - $cropImageWidth) / 2;
    $cropY = ($origImgHeight - $cropImageHeight) / 2;

    if(false) {
      $image->setImageFormat('webp');

      $image->setImageAlphaChannel(imagick::ALPHACHANNEL_ACTIVATE);
      $image->setBackgroundColor(new ImagickPixel('transparent'));
    }

    $image->stripImage();
    $image->cropImage($cropImageWidth, $cropImageHeight, $cropX, $cropY);

    // TODO Only resize down - atm we resize up too despite there
    // not being enough image
    $image->resizeImage($newWidth, $newHeight, imagick::FILTER_LANCZOS, 0.9);
    $image->writeImage($resizedFilepath);
  }

  /**private function stripMetaData($imgFile) {
    if (!extension_loaded('imagick')) {
      log_message('error', 'imagick not installed');
      return;
    } else {
      $v = Imagick::getVersion();
      log_message('error', 'imagick installed version: '.$v['versionString']);
    }

    $image = new Imagick($imgFile);
    log_message('error', 'loading img: '.$imgFile);
    $image->stripImage();
    $image->writeImage($imgFile);
  }**/

  private function serveImage($imagePath) {
    log_message('error', 'Serving image: '.$imagePath);
    if(!file_exists($imagePath)) {
      log_message('error', 'File doesn\'t exist: '.$imagePath);
      return;
    }
    $info = getimagesize($imagePath);

    // output the image
    // Expires in 30 days
    $expiresSeconds = (30 * 24 * 60 * 60);
    $expiresTime = time() + $expiresSeconds;

    header("Content-Disposition: filename={$imagePath};");
    header("Content-Type: {$info["mime"]}");
    header('Content-Transfer-Encoding: binary');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
    header("Cache-Control: public, must-revalidate, proxy-revalidate");
    header("Cache-Control: max-age=".$expiresSeconds, false);
    header('Expires: ' . gmdate('D, d M Y H:i:s', $expiresTime) . ' GMT');
    header("Pragma: public");

    readfile($imagePath);
  }

  private function sanitiseSize($value) {
    $remainder = $value % 50;
    if($remainder != 0) {
      $value += (50 - $remainder);
    } else {
    }
    return $value;
  }

  private function sanitiseDensity($value) {
    $value = round($value, 0, PHP_ROUND_HALF_DOWN);
    if($value < 1) {
      $value = 1;
    } else if ($value > 4) {
      $value = 4;
    }
    return $value;
  }
}

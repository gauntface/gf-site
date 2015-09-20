<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

require_once APPPATH.'third_party/google-api-php-client/src/Google/autoload.php';
require_once APPPATH.'third_party/google-api-php-client/src/Google/Client.php';
require_once APPPATH.'third_party/google-api-php-client/src/Google/Service/Storage.php';

class ImageProducer extends Base_Controller {

  public function __construct() {
    parent::__construct(0);
  }

  public function index() {

    log_message('error', 'ImageProducer: Index()');
    $pathinfo = pathinfo($this->uri->uri_string());
    $numOfSegments = $this->uri->total_segments();

    $imageDirectory = '';
    for($i = 3; $i < $numOfSegments; $i++) {
      $imageDirectory .= $this->uri->segment($i);
      if($i + 1 < $numOfSegments) {
        $imageDirectory .= '/';
      }
    }

    $pattern = '/(?P<origfilename>.+)_(?P<width>\d+)x(?P<height>\d+)x(?P<density>\d+)/';
    $patternFound = preg_match($pattern, $pathinfo["filename"], $matches);

    if($patternFound == 0) {
      log_message('error', 'ImageProducer: File Pattern wasn\'t right');
      log_message('error', 'ImageProducer: $pathinfo["filename"] = ' . $pathinfo["filename"]);
      log_message('error', 'ImageProducer: $imageDirectory = ' . $imageDirectory);
      // The regular expression didn't work, it must be a path to the original image required
      $this->load->model('CloudStorageModel');

      $objectPath = $imageDirectory.'/'.$pathinfo["filename"].'.'.$pathinfo["extension"];
      // original image not found, show 404
      log_message('error', 'Object Path: '.$objectPath);
      if ($this->CloudStorageModel->doesImageExist($objectPath) == false) {
        return $this->show_404();
      }

      $this->load->helper('url');
      redirect($this->CloudStorageModel->getCloudStorageUrl($objectPath), 'localhost', 301);
      return;
    }

    log_message('error', 'ImageProducer: File Pattern was found');
    $this->serveUpAppropriateImage($pathinfo, $matches, $imageDirectory);
  }

  private function serveUpAppropriateImage($pathinfo, $matches, $imageDirectory) {
    log_message('error', 'ImageProducer: serveUpAppropriateImage()');
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

    if (ENVIRONMENT != 'development') {
      if ($this->CloudStorageModel->doesImageExist($generatedObjectPath) != false) {
        $this->load->helper('url');
        redirect($this->CloudStorageModel->getCloudStorageUrl($generatedObjectPath), 'localhost', 301);
        return;
      }
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
      $copyUrl = $this->CloudStorageModel->getCloudStorageUrl($originalObjectPath);
      log_message('error', 'Copy URL = '.$copyUrl);
      copy($copyUrl, $localOriginalFilepath);
    }


    if (!file_exists($localOriginalFilepath)) {
      log_message('error', 'Problem seems to have occured when fetching the '.
        'original file: '.$localOriginalFilepath);
      $this->show_404();
      return;
    }

    log_message('error', '');
    log_message('error', '');
    log_message('error', '=================================================');

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

    log_message('error', '=================================================');
    log_message('error', '');
    log_message('error', '');

    $this->CloudStorageModel->saveImage($generatedObjectPath, $localResizedFilepath);

    unlink($localResizedFilepath);

    $this->load->helper('url');
    redirect($this->CloudStorageModel->getCloudStorageUrl($generatedObjectPath), 'localhost', 301);
  }

  private function resizeImage(
   $width, $height, $density, $originalFilepath, $resizedFilepath) {

    // Check for Image Magick
    if (!extension_loaded('imagick')) {
      log_message('error', 'imagick not installed');
      return;
    } else {
      $v = Imagick::getVersion();
      log_message('error', 'imagick installed version: '.$v['versionString']);
    }

    if($width == 0 && $height == 0) {
      log_message('error', 'Cannot resize image with both zero width and height');
      return;
    }

    log_message('error', '$originalFilepath: ' . $originalFilepath);
    $originalImage = new Imagick($originalFilepath);
    $originImageFormat = $originalImage->getImageFormat();
    log_message('error', 'Orig Filesize: ' . $originalImage->getImageLength());
    log_message('error', 'Orig format: ' . $originalImage->getImageFormat());


    $origImageDimens = $originalImage->getImageGeometry();
    $origImgWidth = $origImageDimens['width'];
    $origImgHeight = $origImageDimens['height'];
    $origImgRatio = $origImgWidth / $origImgHeight;

    $newWidth = $width * $density;
    $newHeight = $height * $density;
    $newImageRatio;

    if($newWidth == 0 || $newHeight == 0) {
      // If one variable is 0, maintain the aspect ratio
      $newImageRatio = $origImgRatio;

      if($newWidth == 0) {
        $newWidth = $newHeight * $newImageRatio;
      } else if($newHeight == 0){
        $newHeight = $newWidth / $newImageRatio;
      }
    } else {
      // Calculate new ratio based on provided width and height
      $newImageRatio = $newWidth / $newHeight;
    }

    if($newWidth > $origImgWidth || $newHeight > $origImgHeight) {
      // Image is too small, should maintain the desired image ratio
      // and thats it

      // TODO: If newImageRatio == oldImageRatio it means, the ratio isn't
      // cared about - so return the origin image.

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
      $originalImage->setImageFormat('webp');

      $originalImage->setImageAlphaChannel(imagick::ALPHACHANNEL_ACTIVATE);
      $originalImage->setBackgroundColor(new ImagickPixel('transparent'));
    }

    //$originalImage->stripImage();
    //$originalImage->cropImage($cropImageWidth, $cropImageHeight, $cropX, $cropY);
    //$originalImage->writeImage($resizedFilepath);
    //$originalImage->clear();
    //$originalImage->destroy();

    $newWidth = intval($newWidth);
    $newHeight = intval($newHeight);

    $cropImageWidth = intval($cropImageWidth);
    $cropImageHeight = intval($cropImageHeight);

    $originalImage->cropImage($cropImageWidth, $cropImageHeight, $cropX, $cropY);
    $originalImage->thumbnailImage($newWidth, $newHeight);
    $originalImage->stripImage();
    $originalImage->writeImage($resizedFilepath);
    $originalImage->clear();
    $originalImage->destroy();

    if(strtolower($originImageFormat) == 'png') {
      $crushedFilepath = $resizedFilepath.'-crushed';
      $pngCrushCmd = sprintf('pngcrush -brute "%s" "%s" 2>&1', $resizedFilepath, $crushedFilepath);
      log_message('error', 'Attempting to run: '.$pngCrushCmd);
      exec($pngCrushCmd, $pngCrushOutput, $exitCode);
      if ($exitCode !== 0) {
        log_message('error', '!!!!!!!!!!!!!!!!!!!!!!!!'.APPPATH);
        log_message('error', '!!!!!!!!!!!!!!!!!!!!!!!!');
        log_message('error', 'There was a problem running pngcrush: ');
        for($i = 0; $i < sizeof($pngCrushOutput); $i++) {
          log_message('error', '    '.$pngCrushOutput[$i]);
        }
        log_message('error', '!!!!!!!!!!!!!!!!!!!!!!!!');
      } else {
        log_message('error', 'PNGCrush successful');
        if(file_exists($crushedFilepath)) {
          log_message('error', 'Rename');
          unlink($resizedFilepath);
          rename($crushedFilepath, $resizedFilepath);
        }
      }
    }

    $finalStripVersionPath = $resizedFilepath.'-stripped';
    $resizedImage = new Imagick($resizedFilepath);
    $resizedFileLength = $resizedImage->getImageLength();
    log_message('error', 'Resized and Cropped Filesize: ' . $resizedImage->getImageLength());
    $resizedImage->stripImage();
    $resizedImage->writeImage($finalStripVersionPath);
    $resizedImage->clear();
    $resizedImage->destroy();

    $finalStrippedImage = new Imagick($finalStripVersionPath);
    $finalStrippedFileLength = $finalStrippedImage->getImageLength();
    log_message('error', 'Stripped Filesize: ' . $finalStrippedFileLength);
    $finalStrippedImage->clear();
    $finalStrippedImage->destroy();

    $finalFileSize = -1;
    if ($resizedFileLength < $finalStrippedFileLength) {
      unlink($finalStripVersionPath);
      $finalFileSize = $resizedFileLength;
    } else {
      unlink($resizedFilepath);
      rename($finalStripVersionPath, $resizedFilepath);

      $finalFileSize = $finalStrippedFileLength;
    }

    log_message('error', 'Final Filesize: ' . $finalFileSize);
  }

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

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ImageProducer extends CI_Controller {

  public function __construct() {
    parent::__construct(0);

    $this->_FORCE_GENERATION = ENVIRONMENT == 'development' && false;
  }

  public function index() {
    $this->load->model('data/CloudStorageModel');
    $this->load->model('data/ImageModel');

    // We want to remove /static/image/ from the start of the image url
    $imageDirectorySegments = array_slice($this->uri->segment_array(), 2);
    $imageDirectory = implode('/', $imageDirectorySegments);

    $imageObject = new ImageModel($imageDirectory);

    if (!$imageObject->canResizeImage()) {
      $this->redirectToCloudStorage($this->CloudStorageModel->getCloudStorageUrl($imageObject->getOriginalStoragePath()));
      return;
    }

    // Check if the image already exists, if so, serve it up
    if (!$this->_FORCE_GENERATION &&
      $this->CloudStorageModel->doesImageExist($imageObject->getCloudStoragePath())) {
      $this->redirectToCloudStorage($this->CloudStorageModel->getCloudStorageUrl($imageObject->getCloudStoragePath()));
      return;
    }

    // If it's not a resizable image then the url is for an original image
    // but we can't find it in cloud storage, so it's a 404
    if (!$imageObject->hasResizingNamePattern()) {
      show_404();
      return;
    }

    // Image doesn't exist and needs resizing
    $this->generateImage($imageObject);
  }

  private function generateImage($imageObject) {
    log_message('error', '$width = '.$imageObject->getDesiredWidth());
    log_message('error', '$height = '.$imageObject->getDesiredHeight());
    log_message('error', '$density = '.$imageObject->getDesiredDensity());
    log_message('error', 'getOriginalStoragePath = '.$imageObject->getOriginalStoragePath());
    log_message('error', 'getCloudStoragePath = '.$imageObject->getCloudStoragePath());

    // Check the origin image exists
    if ($this->CloudStorageModel->doesImageExist($imageObject->getOriginalStoragePath()) == false) {
      log_message('error', 'ImageProducer: The original img doesn\'t exist '.$imageObject->getOriginalStoragePath());
      show_404();
      return;
    }

    // Create directories to download and manipulate images in
    $originalImageDownloadDir = 'imageproducer/'.$imageObject->getOriginalStorageDirectory();
    $generatedImageDir = 'imageproducer/'.$imageObject->getCloudStorageDirectory();
    if(!file_exists($originalImageDownloadDir)) {
      $old = umask(0);
      mkdir($originalImageDownloadDir, 0777, true);
      umask($old);
    }
    if(!file_exists($generatedImageDir)) {
      $old = umask(0);
      mkdir($generatedImageDir, 0777, true);
      umask($old);
    }

    // Download the original image
    $originalImgDownloadPath = 'imageproducer/'.$imageObject->getOriginalStoragePath();
    if (!file_exists($originalImgDownloadPath)) {
      // File doesn't exist locally so need to attempt a download of it
      $originalImageUrl = $this->CloudStorageModel->getCloudStorageUrl($imageObject->getOriginalStoragePath());
      $success = copy($originalImageUrl, $originalImgDownloadPath);
      if (!$success) {
        show_404();
        return;
      }
    }

    if (!file_exists($originalImgDownloadPath)) {
      log_message('error', 'Problem seems to have occured when fetching the '.
        'original file: '.$originalImgDownloadPath);
      show_404();
      return;
    }

    log_message('error', '');
    log_message('error', '');
    log_message('error', '=================================================');

    // Original exists, so resize it and serve it
    $generatedImgPath = 'imageproducer/'.$imageObject->getCloudStoragePath();
    $this->resizeImage(
      $imageObject->getDesiredWidth(),
      $imageObject->getDesiredHeight(),
      $imageObject->getDesiredDensity(),
      $originalImgDownloadPath,
      $generatedImgPath
    );

    // See if the resizing worked
    if(!file_exists($generatedImgPath)) {
      log_message('error', 'Unable to find the resized image.');
      show_404();
      return;
    }

    log_message('error', '=================================================');
    log_message('error', '');
    log_message('error', '');

    $this->CloudStorageModel->saveImage($imageObject->getCloudStoragePath(), $generatedImgPath);

    unlink($originalImgDownloadPath);
    unlink($generatedImgPath);

    $this->redirectToCloudStorage($this->CloudStorageModel->getCloudStorageUrl($imageObject->getCloudStoragePath()));
  }

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

    $originalImage = new Imagick($originalFilepath);
    $originImageFormat = $originalImage->getImageFormat();
    log_message('error', 'Orig Filesize: ' . $originalImage->getImageLength());


    $origImageDimens = $originalImage->getImageGeometry();
    $origImgWidth = $origImageDimens['width'];
    $origImgHeight = $origImageDimens['height'];
    $origImgRatio = $origImgWidth / $origImgHeight;

    $newWidth = $width * $density;
    $newHeight = $height * $density;
    $newImageRatio;

    log_message('error', '$newWidth: '.$newWidth);
    log_message('error', '$newHeight: '.$newHeight);

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

    log_message('error', '$newImageRatio: '.$newImageRatio);

    // Image is too small, should maintain the desired image ratio
    // and thats it
    if($newWidth > $origImgWidth || $newHeight > $origImgHeight) {
      // TODO: If newImageRatio == oldImageRatio it means, the ratio isn't
      // cared about - so return the original image.
      if($newWidth > $origImgWidth) {
        $newWidth = $origImgWidth;
        $newHeight = $newWidth / $newImageRatio;
      }

      if($newHeight > $origImgHeight) {
        $newHeight = $origImgHeight;
        $newWidth = $newHeight * $newImageRatio;
      }
    }

    if(false) {
      $originalImage->setImageFormat('webp');

      $originalImage->setImageAlphaChannel(imagick::ALPHACHANNEL_ACTIVATE);
      $originalImage->setBackgroundColor(new ImagickPixel('transparent'));
    }

    $newWidth = intval($newWidth);
    $newHeight = intval($newHeight);

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

    $cropImageWidth = intval($cropImageWidth);
    $cropImageHeight = intval($cropImageHeight);

    log_message('error', '$origImgWidth: ' . $origImgWidth);
    log_message('error', '$origImgHeight: ' . $origImgHeight);
    log_message('error', '');
    log_message('error', '$newWidth: ' . $newWidth);
    log_message('error', '$newHeight: ' . $newHeight);
    log_message('error', '');
    log_message('error', '$cropImageWidth: ' . $cropImageWidth);
    log_message('error', '$cropImageHeight: ' . $cropImageHeight);
    log_message('error', '');
    log_message('error', '$cropX: ' . $cropX);
    log_message('error', '$cropY: ' . $cropY);
    log_message('error', '');

    if ($origImgWidth != $newWidth || $origImgHeight != $newHeight) {
      $originalImage->cropImage($cropImageWidth, $cropImageHeight, $cropX, $cropY);
      $originalImage->thumbnailImage($newWidth, $newHeight);
      $originalImage->stripImage();
      $originalImage->writeImage($resizedFilepath);
      $originalImage->clear();
      $originalImage->destroy();
    } else {
      rename($originalFilepath, $resizedFilepath);
    }

    $resizedImageForSizeTest = new Imagick($resizedFilepath);
    $imageSize = $resizedImageForSizeTest->getImageLength();
    log_message('error', 'Resized ONLY Filesize: ' . $imageSize);
    $resizedImageForSizeTest->clear();
    $resizedImageForSizeTest->destroy();

    if(strtolower($originImageFormat) == 'png') {
      $crushedFilepath = $resizedFilepath.'-crushed';
      $pngCrushCmd = sprintf('pngcrush -brute "%s" "%s" 2>&1', $resizedFilepath, $crushedFilepath);
      exec($pngCrushCmd, $pngCrushOutput, $exitCode);
      if ($exitCode !== 0) {
        log_message('error', '');
        log_message('error', 'There was a problem running pngcrush: ');
        for($i = 0; $i < sizeof($pngCrushOutput); $i++) {
          log_message('error', '    '.$pngCrushOutput[$i]);
        }
        log_message('error', '');
      } else {
        if(file_exists($crushedFilepath)) {
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

  private function redirectToCloudStorage($url) {
    $this->load->helper('url');

    $expiresSeconds = (30 * 24 * 60 * 60);
    $expiresTime = time() + $expiresSeconds;

    header("Cache-Control: public, must-revalidate, proxy-revalidate");
    header("Cache-Control: max-age=".$expiresSeconds, false);
    header('Expires: ' . gmdate('D, d M Y H:i:s', $expiresTime) . ' GMT');

    redirect($url, 'location', 301);
  }
}

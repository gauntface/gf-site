<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'third_party/google-api-php-client/vendor/autoload.php';
#require_once APPPATH.'third_party/google-api-php-client/src/Google/Client.php';
#require_once APPPATH.'third_party/google-api-php-client/src/Google/Service/Storage.php';


class CloudStorageModel extends CI_Model {

  public $GENERATED_IMG_DIR = 'generated/';

  function __construct() {
    // Call the Model constructor
    parent::__construct();

    $this->load->driver('cache', array('adapter' => 'apc'));
  }

  private function getGoogleClient() {
    try {
      $this->config->load('confidential', TRUE);

      /**
       * Connect to Google Cloud Storage API
       */
      $scopes = [ Google_Service_Storage::DEVSTORAGE_FULL_CONTROL ];

      $client = new Google_Client();
      $client->setApplicationName("GF Image Producer");
      $client->setAuthConfig(APPPATH.'../keys/cloud-storage/GauntFaceSiteV2-CompEngine-a7af07baece6.json');
      $client->setScopes($scopes);
      if($client->isAccessTokenExpired()) {
        $client->refreshTokenWithAssertion();
        // Cache the access token however you choose, getting the access token with $client->getAccessToken()
      }

      /**
       * Upload a file to google cloud storage
       */
      $storage = new Google_Service_Storage($client);

      return $storage;
    } catch (Exception $e) { }
    return false;
  }

  public function getImages() {
    try {
      $storageService = $this->getGoogleClient();
      if (!$storageService) {
        return array();
      }

      $imgObjects = $storageService->objects->listObjects(
        $this->config->item('storage-bucketname', 'confidential'),
        array(
          'maxResults' => 50,
          'prefix' => 'uploads'
        )
      );

      $imgItems = $imgObjects['modelData']['items'];

      function compareFunction($a, $b) {
        $a = strtotime($a['updated']);
        $b = strtotime($b['updated']);

        if ($a == $b) $r = 0;
        else $r = ($a < $b) ? 1: -1;

        return $r;
      }

      usort($imgItems, 'compareFunction');
      return $imgItems;
    } catch (Exception $e) {
      // NOOP
      log_message("error", "Error thrown by CloudStorageModel: ".$e);
    }
    return array();
  }

  public function doesImageExist($objectPath) {
    if ($this->cache->get($objectPath)) {
      return true;
    }

    try {
      $storageService = $this->getGoogleClient();
      $imgObject = $storageService->objects->get(
        $this->config->item('storage-bucketname', 'confidential'),
        $objectPath
      );

      $this->cache->save($objectPath, true, 0);

      return true;
    } catch (Exception $e) {
      // NOOP
      log_message("error", "Error thrown by CloudStorageModel: ".$e);
    }
    return false;
  }

  public function saveImage($objectPath, $localFilepath) {
    $acl = new Google_Service_Storage_ObjectAccessControl();
    $acl->setEntity('allUsers');
    $acl->setRole('OWNER');

    $obj = new Google_Service_Storage_StorageObject();
    $obj->setName($objectPath);
    $obj->setAcl(array($acl));
    $obj->setContentType(mime_content_type($localFilepath));
    $obj->setCacheControl('max-age='.(31 * 24 * 60 * 60));

    $storageService = $this->getGoogleClient();
    if (!$storageService) {
      return false;
    }

    $storageService->objects->insert(
      $this->config->item('storage-bucketname', 'confidential'),
      $obj,
      [
        'name' => $objectPath,
        'data' => file_get_contents($localFilepath),
        'mimeType' => mime_content_type($localFilepath),
        'uploadType' => 'media'
      ]
    );
  }

  public function getCloudStorageUrl($objectPath) {
    $this->config->load('confidential', TRUE);
    return 'https://storage.googleapis.com/'.
      $this->config->item('storage-bucketname', 'confidential').
      '/'.$objectPath;
  }
}

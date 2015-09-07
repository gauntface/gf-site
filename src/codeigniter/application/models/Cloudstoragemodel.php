<?php

class CloudStorageModel extends CI_Model {

  public $GENERATED_IMG_DIR = 'generated/';

  function __construct() {
    // Call the Model constructor
    parent::__construct();
  }

  private function getGoogleClient() {
    $this->config->load('confidential', TRUE);

    /**
     * Connect to Google Cloud Storage API
     */
    $client = new Google_Client();
    $client->setApplicationName("GF Image Producer");
    // $stored_access_token - your cached oauth access token
    //if( $stored_access_token ) {
    //	$client->setAccessToken( $stored_access_token );
    //}
    $credential = new Google_Auth_AssertionCredentials(
      $this->config->item('storage-clientid', 'confidential'),
      ['https://www.googleapis.com/auth/devstorage.full_control'],
      file_get_contents($this->config->item('storage-cert', 'confidential'))
    );
    $client->setAssertionCredentials($credential);
    if($client->getAuth()->isAccessTokenExpired()) {
      $client->getAuth()->refreshTokenWithAssertion($credential);
      // Cache the access token however you choose, getting the access token with $client->getAccessToken()
    }
    /**
     * Upload a file to google cloud storage
     */
    $storage = new Google_Service_Storage($client);

    return $storage;
  }

  public function doesImageExist($objectPath) {
    $this->load->driver('cache', array('adapter' => 'apc'));
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

    $storageService = $this->getGoogleClient();
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

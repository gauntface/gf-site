<?php

class CloudStorageModel extends CI_Model {

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
  
}

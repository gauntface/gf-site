<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'controllers/Base_controller.php';

class API extends CI_Controller {

  public function push($action) {
    $this->load->model('push/SubscriptionsModel');

    $subscriptionsModel = new SubscriptionsModel();

    $apiInputData = json_decode(file_get_contents("php://input"), true);

    $success = false;
    switch ($action) {
      case 'subscribe':
        if ($apiInputData['endpoint'] == null) {
          break;
        }

        $subscriptionModel = $subscriptionsModel->getSubscriptionByEndpoint($apiInputData['endpoint']);
        if ($subscriptionModel != null) {
          // Subscription is already in the server skip over it for now
          $success = true;
          break;
        }

        $subscriptionsModel->insertSubscription($apiInputData['endpoint']);
        $success = true;
        break;
      case 'unsubscribe':
        $success = $subscriptionsModel->deleteSubscription($apiInputData['endpoint']);
        break;
      default:
        $data['json'] = '{
          "error":{
            "msg": "Unknown API request."
          }
        }';
        http_response_code(404);
        $this->load->view('templates/json_response', $data);
        return;
    }

    $data['json'] = '{
        "data":{
          "success": '.($success ? 'true' : 'false').'
        }
      }';
    $this->load->view('templates/json_response', $data);
  }
}

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH.'third_party/google-api-php-client/vendor/autoload.php';
require_once APPPATH.'third_party/google-api-php-client/src/Google/Client.php';

class BaseController extends CI_Controller {

  public function __construct($cacheTime = (365 * 24 * 60)){
    parent::__construct();

    if($cacheTime > 0 && ENVIRONMENT !== 'development') {
      // Number of minutes to cache output
      // $this->output->cache($cacheTime);
    }
  }

  // This method is used to determine which shell to use
  protected function getAppShellModel($pageId) {
    return 'appshell/HeaderFooterShell';
  }

  protected function getDocument($pageId, $pageData = null) {
    $this->load->model('document/StandardDocument', 'document');

    $this->load->model($this->getAppShellModel($pageId), 'appshell');
    $this->document->setAppShell($this->appshell);

    $page = $this->generatePage($pageId, $this->appshell, $pageData);
    $page->setId($pageId);
    $this->document->setPage($page);

    return $this->document;
  }

  protected function render($document) {
    $output = $this->input->get('output', TRUE);
    if ($output == FALSE) {
      $this->load->view('documents/standard/standard-document', array(
        'appshell' => $document->getAppShell(),
        'page' => $document->getPage()
      ));
      return;
    }
    switch ($output) {
    case 'remote_css':
      $this->renderRemoteCSS($document);
      break;
    case 'partial':
      $this->renderPartial($document);
      break;
    default:
      show_404();
      break;
    }
  }

  protected function renderRemoteCSS($document) {
    $section = $this->input->get('section', TRUE);
    switch ($section) {
    case 'both':
      $this->load->view('output-types/css', array(
        'appshell' => array(
          'stylesheets' => $document->getAppShell()->getRemoteStylesheets(),
          'rawCSS' => $document->getAppShell()->getRemoteRawCSS()
        ),
        'page' => array(
          'stylesheets' => $document->getPage()->getRemoteStylesheets(),
          'rawCSS' => $document->getPage()->getRemoteRawCSS()
        )
      ));
      break;
    case 'shell':
      $this->load->view('output-types/css', array(
        'appshell' => array(
          'stylesheets' => $document->getAppShell()->getRemoteStylesheets(),
          'rawCSS' => $document->getAppShell()->getRemoteRawCSS()
        )
      ));
      break;
    case 'page':
      $this->load->view('output-types/css', array(
        'page' => array(
          'stylesheets' => $document->getPage()->getRemoteStylesheets(),
          'rawCSS' => $document->getPage()->getRemoteRawCSS()
        )
      ));
      break;
    default:
      show_404();
      break;
    }
  }

  protected function renderPartial($document) {
    $section = $this->input->get('section', TRUE);
    $jsonArray = array();
    switch ($section) {
      case 'page':
        $jsonArray['page'] = array(
          'title' => $document->getPage()->getTitle(),
          'html' => $document->getPage()->loadView(true),
          'css' => array(
            'inline' => $document->getPage()->getAllStylesAsCSS(),
            'remote' => $document->getRemoteStyleURL()
          )
        );
        break;
      case 'shell':
        $jsonArray['appshell'] = array(
          'id' => $document->getAppShell()->getAppShellId(),
          'html' => $document->getAppShell()->loadView(true),
          'css' => array(
            'inline' => $document->getAppShell()->getAllStylesAsCSS()
          )
        );
        break;
      default:
        show_404();
        break;
    };
    $this->load->view('output-types/json', array(
      'json' => $jsonArray
    ));
  }

  protected function isLoggedIn() {
    $this->load->helper('url');
    $this->load->library('session');
    $this->config->load('confidential', TRUE);

    $rawToken = $this->session->userdata('user_sign_in_token');
    if(!$rawToken) {
      return false;
    }

    $token = json_decode($rawToken);
    try {
      $client = new Google_Client();
      $client->setClientId(
        $this->config->item('gplus-clientid', 'confidential')
      );
      $client->setClientSecret(
        $this->config->item('gplus-clientsecret', 'confidential')
      );
      $attributes = $client->verifyIdToken(
        $token->id_token,
        $this->config->item('gplus-clientid', 'confidential')
      );

      $emailAddress = $attributes["email"];
      if($emailAddress != $this->config->item('whitelist', 'confidential')) {
        log_message('error', 'BaseController.php: isLoggedIn() User login attempt - ' + $emailAddress);
        return false;
      }
    } catch (Exception $e) {
      log_message('error', 'BaseController.php: isLoggedIn() Error Handling Token Check - '.$e->getMessage());
      return false;
    }
    return true;
  }
}

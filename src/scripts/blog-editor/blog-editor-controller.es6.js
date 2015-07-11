'use strict';

import BaseController from '../base/base-controller';
import TabView from './tab-view';
import DragDropView from './drag-drop-view';
import Debug from '../debug';

var Signal = require(
    './../third_party/millermedeiros-js-signals-1a82bdd/dist/signals.js');

class BlogEditorController extends BaseController {
  constructor () {
    super();

    this.setUpPubSub();
  }

  onDOMContentLoaded () {
    this.tabview = new TabView();
    this.dragDropView = new DragDropView();

    window.GauntFace.Debug = new Debug();
  }

  setUpPubSub () {
    window.GauntFace.PubSub = {
      fileDropped: new Signal()
    };

    this.onFileDropped = this.onFileDropped.bind(this);

    window.GauntFace.PubSub.fileDropped.add(this.onFileDropped);
  }

  onFileDropped (file) {
    console.log('File Dropped: ', file);

    // Upload File
    this.uploadFile(file)
      .then(function(imgUrl) {
        console.log('Loaded the image to: ', imgUrl);
      })
      .catch(function(err) {
        console.error('Unable to load the image: ', err);
      });
    // Show UI During Upload

    // Show UI for what to do with the Image

  }

  uploadFile(file) {
    return new Promise(function(resolve, reject) {
      var formData = new FormData();
      formData.append('file', file);

      // now post a new XHR request
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '');
      xhr.onreadystatechange = function(e) {
        if (e.target.readyState !== 4) {
          return;
        }

        var response;
        if (e.target.status === 200) {
          response = JSON.parse(e.target.responseText);
          var imgUrl = response.data.url;
          resolve(imgUrl);
        } else {
          console.log(e.target.responseText);
          try {
            response = JSON.parse(e.target.responseText);
            reject(response.error.msg);
          } catch (exception) {
            reject('Sorry, the server responded with status code: ' +
              e.target.status + ' response: ' + e.target.responseText);
          }
        }
      }.bind(this);

      xhr.timeout = 10000;
      xhr.ontimeout = function() {
        reject('Sorry, the server couldn\'t be reached.');
      };

      xhr.send(formData);
    });
  }
}

new BlogEditorController();

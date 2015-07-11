'use strict';

import BaseController from '../base/base-controller';
import TabView from './tab-view';
import DragDropView from './drag-drop-view';
import Debug from '../debug';
import { uploadFile } from '../../../deploy/assets/scripts/api/file-upload';

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
    uploadFile(file);
      //.then(function(imgUrl) {
      //  console.log('Loaded the image to: ', imgUrl);
      //})
      //.catch(function(err) {
      //  console.error('Unable to load the image: ', err);
      //});
    // Show UI During Upload

    // Show UI for what to do with the Image

  }
}

new BlogEditorController();

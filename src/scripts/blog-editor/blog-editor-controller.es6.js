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
    
    // Show UI During Upload

    // Show UI for what to do with the Image

  }
}

new BlogEditorController();

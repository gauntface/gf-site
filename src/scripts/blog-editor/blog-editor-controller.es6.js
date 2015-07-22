'use strict';

import BaseController from '../base/base-controller';
import TabView from './tab-view';
import DragDropView from './drag-drop-view';
import ImageUploadView from './image-upload-view';
import BlogModel from './blog-model';
import MetaDataView from './meta-data-view';
import MarkdownView from './markdown-view';
import Debug from '../debug';

import { uploadFile } from '../../../deploy/assets/scripts/api/file-upload';
import { savePost } from '../../../deploy/assets/scripts/api/save-post';

var Signal = require(
    './../third_party/millermedeiros-js-signals-1a82bdd/dist/signals.js');

class BlogEditorController extends BaseController {
  constructor () {
    super();

    this.onWindowPopState = this.onWindowPopState.bind(this);

    window.onpopstate = this.onWindowPopState;

    this.setUpPubSub();
  }

  onDOMContentLoaded () {
    this.blogModel = new BlogModel(this.getPostIDFromURL());

    this.tabview = new TabView();
    this.dragDropView = new DragDropView();
    this.imageUploadView = new ImageUploadView();
    this.metaDataView = new MetaDataView(this.blogModel);
    this.markdownView = new MarkdownView(this.blogModel);

    this.previewIframe = document.querySelector('.js-blogcreate__preview');

    window.GauntFace.Debug = new Debug();
  }

  getPostIDFromURL() {
    var path = window.location.pathname;
    path = path.replace(/\/$/, '');
    var pathParts = path.split('/');
    var postId = null;
    if (pathParts.length > 1) {
      postId = parseInt(pathParts[pathParts.length - 1], 10);
    }
    return postId;
  }

  setUpPubSub () {
    window.GauntFace.PubSub = {
      fileDropped: new Signal(),
      updateGreyScaleImg: new Signal(),
      updateMainImg: new Signal(),
      copyMarkdown: new Signal(),
      panelUpdateRequired: new Signal(),
      iframeUpdateRequired: new Signal(),
      postIDUpdated: new Signal(),
    };

    this.onFileDropped = this.onFileDropped.bind(this);
    this.onGreyScaleImageUpdate = this.onGreyScaleImageUpdate.bind(this);
    this.onMainImageUpdate = this.onMainImageUpdate.bind(this);
    this.onCopyMarkdown = this.onCopyMarkdown.bind(this);
    this.onPanelUpdateRequired = this.onPanelUpdateRequired.bind(this);
    this.onIframeUpdateRequired = this.onIframeUpdateRequired.bind(this);
    this.onPostIDUpdated = this.onPostIDUpdated.bind(this);

    window.GauntFace.PubSub.fileDropped.add(this.onFileDropped);
    window.GauntFace.PubSub.updateGreyScaleImg.add(this.onGreyScaleImageUpdate);
    window.GauntFace.PubSub.updateMainImg.add(this.onMainImageUpdate);
    window.GauntFace.PubSub.copyMarkdown.add(this.onCopyMarkdown);
    window.GauntFace.PubSub.panelUpdateRequired.add(this.onPanelUpdateRequired);
    window.GauntFace.PubSub.iframeUpdateRequired.add(
      this.onIframeUpdateRequired);
    window.GauntFace.PubSub.postIDUpdated.add(this.onPostIDUpdated);
  }

  onWindowPopState (e) {
    console.log('onWindowPopState()');
  }

  onFileDropped (file) {
    console.log('File Dropped: ', file);
    // Show UI During Upload
    this.imageUploadView.displayUploading();

    // Upload File
    uploadFile(file)
      .then(function(url) {
        // Show UI for what to do with the Image
        console.log('Image uploaded to ', url);
        this.imageUploadView.displayImageChoices(url);
      }.bind(this))
      .catch(function(error) {
        console.warn(error);
        this.imageUploadView.displayError(error);
      }.bind(this));
  }

  onGreyScaleImageUpdate (imgUrl) {
    this.blogModel.greyScaleImg = imgUrl;
  }

  onMainImageUpdate (imgUrl) {
    this.blogModel.mainImg = imgUrl;
  }

  onCopyMarkdown (imgUrl) {
    console.log('TODO: onCopyMarkdown <- Implement');
  }

  onPanelUpdateRequired () {
    console.log('Update UI');
    this.metaDataView.update();
  }

  onIframeUpdateRequired () {
    savePost(this.blogModel)
      .then(function(postId) {
        if (postId) {
          this.blogModel.postId = postId;
        }

        this.previewIframe.src = window.location.protocol + '//' +
          window.location.host + '/blog/view/' + this.blogModel.postId;
      }.bind(this))
      .catch(function(err) {
        console.log('blog-editor: Need to handle failure of save attempt', err);
      });
  }

  onPostIDUpdated (postId) {
    var newUrl = '/crumpets/blog/edit/' + postId;
    var stateObj = {};

    // Replace the state so we don't keep the create URL on the back stack
    // When we have a post to edit
    window.history.replaceState(stateObj, 'Edit Blog Post', newUrl);
  }
}

new BlogEditorController();

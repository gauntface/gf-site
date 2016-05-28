'use strict';

import TabComponent from '../components/tab-component';
import DragDropView from '../components/blog-editor/drag-drop-view';
import ImageUploadView from '../components/blog-editor/image-upload-view';
import MetaDataView from '../components/blog-editor/meta-data-view';
import MarkdownView from '../components/blog-editor/markdown-view';
import PublishView from '../components/blog-editor/publish-view';
import copyToClipBoard from '../helpers/clipboard';

import WorkQueue from '../helpers/work-queue.js';
import BlogModel from '../models/blog-model';

import { uploadFile } from '../api/file-upload';
import { savePost, deletePost, publishPost } from '../api/calls';

import Signal from
    './../third_party/millermedeiros-js-signals-1a82bdd/dist/signals.js';

class BlogEditorController {
  constructor() {
    this._blogModel = new BlogModel();
    this._workQueue = new WorkQueue();

    this.initialiseViews();
    this.setUpPubSub();
  }

  initialiseViews() {
    // No events fired, it manages itself
    this._tabview = new TabComponent();

    this._dragDropView = new DragDropView();
    this._imageUploadView = new ImageUploadView(this._blogModel);
    this._metaDataView = new MetaDataView(this._blogModel);
    this._markdownView = new MarkdownView(this._blogModel);
    this._publishView = new PublishView(this._blogModel);

    this._previewIframe = document.querySelector('.js-blogcreate__preview');
    this._saveSpinner = document.querySelector('.js-saving-spinner');
    this._deleteBtn = document.querySelector('.js-post-delete');
    this._deleteBtn.addEventListener('click', event => this.onDeletePost(event));

    const copyImageBtns = document.querySelectorAll('.js-copy-clipboard');
    copyImageBtns.forEach(copyImageBtn => {
      copyImageBtn.addEventListener('click', event => {
        copyToClipBoard(event.target.dataset.copy);
      });
    });
  }

  setUpPubSub() {
    window.GauntFace = window.GauntFace || {};
    window.GauntFace.PubSub = {
      onModelChange: new Signal(),
      fileDropped: new Signal(),
      publishPost: new Signal()
    };

    window.GauntFace.PubSub.onModelChange.add(() => {
      // Save
      this._workQueue.addJob('save', () => {
        this._saveSpinner.style.opacity = 1;

        return savePost(this._blogModel)
        .then(postId => {
          if (postId) {
            this._blogModel.postId = postId;
            this.onPostIDUpdated(postId);
          }
        })
        .catch(err => {
          console.log('blog-editor: TODO: Show warning that save failed', err);
        })
        .then(() => {
          return new Promise(resolve => {
            setTimeout(resolve, 1000);
          })
        })
        .then(() => {
          this._previewIframe.src = window.location.origin + '/blog/view/' +
            this._blogModel.postId + '?cache-bust=' + Date.now();

          this._metaDataView.update();

          this._saveSpinner.style.opacity = 0;
        });
      }, 2);
    });
    window.GauntFace.PubSub.fileDropped.add(files => this.onFileDropped(files));
    window.GauntFace.PubSub.publishPost.add(() => this.onPublishPost());
  }

  onFileDropped(file) {
    // Show UI During Upload
    this._imageUploadView.displayUploading();

    // Upload File
    uploadFile(file)
    .then(url => {
      // Show UI for what to do with the Image
      this._imageUploadView.displayImageChoices(url);
    })
    .catch(error => {
      this._imageUploadView.displayError(error);
    });
  }

  onPostIDUpdated(postId) {
    var newUrl = '/admin/blog/edit/' + postId;
    var stateObj = {};

    // Replace the state so we don't keep the create URL on the back stack
    window.history.replaceState(stateObj, 'Edit Blog Post', newUrl);
  }

  onDeletePost(event) {
    event.preventDefault();

    deletePost(this._blogModel)
    .then(success => {
      window.history.back();
    })
    .catch(err => {
      console.log('Unable to delete post.', err);
    });
  }

  onPublishPost() {
    publishPost(this._blogModel)
    .then(response => {
      this._publishView.setCurrentStatus('published');
      this._publishView.disablePublishBtn();
    })
    .catch(err => {
      console.log('Unable to publish post.', err);
    });
  }
}

new BlogEditorController();

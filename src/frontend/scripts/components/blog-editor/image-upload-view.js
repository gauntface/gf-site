'use strict';

import BlogView from './blog-view';
import copyToClipBoard from '../../helpers/clipboard';

const STATE_NOT_DISPLAYED = Symbol();
const STATE_UPLOADING = Symbol();
const STATE_USE_DISPLAY = Symbol();

export default class ImageUploadView extends BlogView {
  constructor (blogModel) {
    super();

    this._blogModel = blogModel;

    this.addDOMElements([
      {
        className: 'js-loading-over-view__container',
        localName: 'loadingOverlay'
      },
      {
        className: 'js-upload-use__container',
        localName: 'uploadUseOverlay'
      },
      {
        className: 'js-upload-use__grey-scale-btn',
        localName: 'greyScaleBtn'
      },
      {
        className: 'js-upload-use__main-img-btn',
        localName: 'mainImgBtn'
      },
      {
        className: 'js-upload-use__copy-markdown-btn',
        localName: 'copyMarkdownBtn'
      },
    ]);

    this.greyScaleBtn.addEventListener('click', () => this.onGreyScaleBtnClick());

    this.mainImgBtn.addEventListener('click', () => this.onMainImgBtnClick());

    this.copyMarkdownBtn.addEventListener('click', () => this.onCopyMarkdownClick());
  }

  get currentState () {
    return this._currentState;
  }

  set currentState (newState) {
    if (this._currentState === newState) {
      return;
    }

    switch (newState) {
      case STATE_NOT_DISPLAYED:
        this.loadingOverlay.classList.remove('is-displayed');
        this.uploadUseOverlay.classList.remove('is-displayed');

        this.imageUrl = null;
        break;
      case STATE_UPLOADING:
        this.loadingOverlay.classList.add('is-displayed');
        this.uploadUseOverlay.classList.remove('is-displayed');
        break;
      case STATE_USE_DISPLAY:
        this.loadingOverlay.classList.remove('is-displayed');
        this.uploadUseOverlay.classList.add('is-displayed');
        break;
    }

    this._currentState = newState;
  }

  displayUploading () {
    this.currentState = STATE_UPLOADING;
  }

  displayImageChoices (imageUrl) {
    this.currentState = STATE_USE_DISPLAY;

    this.imageUrl = imageUrl;
  }

  displayError (error) {
    this.currentState = STATE_NOT_DISPLAYED;
  }

  onGreyScaleBtnClick () {
    this._blogModel.greyScaleImg = this.imageUrl;
    this.currentState = STATE_NOT_DISPLAYED;
  }

  onMainImgBtnClick () {
    this._blogModel.mainImg = this.imageUrl;
    this.currentState = STATE_NOT_DISPLAYED;
  }

  onCopyMarkdownClick () {
    copyToClipBoard(this.imageUrl);
    this.currentState = STATE_NOT_DISPLAYED;
  }
}

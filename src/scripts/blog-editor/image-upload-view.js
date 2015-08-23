'use strict';

import BlogView from './blog-view';

const STATE_NOT_DISPLAYED = Symbol();
const STATE_UPLOADING = Symbol();
const STATE_USE_DISPLAY = Symbol();

export default class ImageUploadView extends BlogView {
  constructor () {
    super();

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

    this.onGreyScaleBtnClick = this.onGreyScaleBtnClick.bind(this);
    this.onMainImgBtnClick = this.onMainImgBtnClick.bind(this);
    this.onCopyMarkdownClick = this.onCopyMarkdownClick.bind(this);

    this.greyScaleBtn.addEventListener('click', this.onGreyScaleBtnClick);

    this.mainImgBtn.addEventListener('click', this.onMainImgBtnClick);

    this.copyMarkdownBtn.addEventListener('click', this.onCopyMarkdownClick);
  }

  get currentState () {
    return this.currentState_;
  }

  set currentState (newState) {
    if (this.currentState_ === newState) {
      return;
    }

    switch (newState) {
      case STATE_NOT_DISPLAYED:
        this.loadingOverlay.classList.remove('is-displayed');
        this.uploadUseOverlay.classList.remove('is-displayed');
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

    this.currentState_ = newState;
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
    window.GauntFace.PubSub.updateGreyScaleImg.dispatch(this.imageUrl);
    this.currentState = STATE_NOT_DISPLAYED;
  }

  onMainImgBtnClick () {
    window.GauntFace.PubSub.updateMainImg.dispatch(this.imageUrl);
    this.currentState = STATE_NOT_DISPLAYED;
  }

  onCopyMarkdownClick () {
    window.GauntFace.PubSub.copyMarkdown.dispatch(this.imageUrl);
    this.currentState = STATE_NOT_DISPLAYED;
  }
}

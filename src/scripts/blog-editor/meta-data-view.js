'use strict';

import BlogView from './blog-view';

export default class MetaDataView extends BlogView {

  constructor (blogModel) {
    super();

    this.blogModel = blogModel;

    this.addDOMElements([
      {
        className: 'js-title-input',
        localName: 'titleInput'
      },
      {
        className: 'js-excerpt-textarea',
        localName: 'excerptTextArea'
      },
      {
        className: 'js-grey-scale-img',
        localName: 'greyScaleImg'
      },
      {
        className: 'js-main-img',
        localName: 'mainImg'
      },
    ]);

    this.blogModel.title = this.titleInput.value;
    this.blogModel.excerpt = this.excerptTextArea.value;
    this.blogModel.greyScaleImg = this.greyScaleImg.src;
    this.blogModel.mainImg = this.mainImg.src;

    this.onTitleInputChange = this.onTitleInputChange.bind(this);
    this.onExcerptInputChange = this.onExcerptInputChange.bind(this);

    this.titleInput.addEventListener('input', this.onTitleInputChange);
    this.excerptTextArea.addEventListener('input', this.onExcerptInputChange);
  }

  onTitleInputChange () {
    if (!this.blogModel) {
      return;
    }

    this.blogModel.title = this.titleInput.value;
  }

  onExcerptInputChange () {
    if (!this.blogModel) {
      return;
    }

    this.blogModel.excerpt = this.excerptTextArea.value;
  }

  update () {
    this.greyScaleImg.src = this.blogModel.greyScaleImg || '';
    this.mainImg.src = this.blogModel.mainImg || '';
  }

}

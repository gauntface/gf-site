'use strict';

import BlogView from './blog-view';

export default class PublishView extends BlogView {

  constructor (blogModel) {
    super();

    this.blogModel = blogModel;

    this.addDOMElements([
      {
        className: 'js-publish-btn',
        localName: 'publishBtn'
      },
    ]);

    this.onPublishClick = this.onPublishClick.bind(this);

    this.publishBtn.addEventListener('click', this.onPublishClick);
  }

  onPublishClick () {
    window.GauntFace.PubSub.publishRequested.dispatch();
  }

  disablePublishBtn () {
    this.publishBtn.disabled = true;
  }
}

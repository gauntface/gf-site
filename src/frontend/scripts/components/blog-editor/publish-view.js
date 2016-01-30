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
      {
        className: 'js-publish__current-status',
        localName: 'currentStatus'
      }
    ]);

    this.onPublishClick = this.onPublishClick.bind(this);

    this.publishBtn.addEventListener('click', this.onPublishClick);
  }

  onPublishClick () {
    window.GauntFace.PubSub.publishPost.dispatch();
  }

  setCurrentStatus(newStatus) {
    this.currentStatus.textContent = newStatus;
  }

  disablePublishBtn () {
    this.publishBtn.disabled = true;
  }
}

'use strict';

import BlogView from './blog-view';

export default class MarkdownView extends BlogView {

  constructor (blogModel) {
    super();

    this.blogModel = blogModel;

    this.addDOMElements([
      {
        className: 'js-markdown-textarea',
        localName: 'markdownTextArea'
      },
    ]);

    this.blogModel.markdown = this.markdownTextArea.value;

    this.onMarkdownInputChange = this.onMarkdownInputChange.bind(this);

    this.markdownTextArea.addEventListener('input', this.onMarkdownInputChange);
  }

  onMarkdownInputChange () {
    if (!this.blogModel) {
      return;
    }

    this.blogModel.markdown = this.markdownTextArea.value;
  }

}

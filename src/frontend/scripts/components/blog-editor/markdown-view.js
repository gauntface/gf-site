'use strict';

import BlogView from './blog-view';

export default class MarkdownView extends BlogView {

  constructor (blogModel) {
    super();

    this._blogModel = blogModel;

    this.addDOMElements([
      {
        className: 'js-markdown-textarea',
        localName: 'markdownTextArea'
      },
    ]);

    this._blogModel.markdown = this.markdownTextArea.value;

    this.markdownTextArea.addEventListener('input', () => this.onMarkdownInputChange());
  }

  onMarkdownInputChange () {
    if (!this._blogModel) {
      return;
    }

    this._blogModel.markdown = this.markdownTextArea.value;
  }

}

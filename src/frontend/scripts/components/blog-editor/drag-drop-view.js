'use strict';

import BlogView from './blog-view';

const IS_HOVERING_CLASSNAME = 'is-displayed';

export default class DragDropView extends BlogView {
  constructor () {
    super();

    this.addDOMElements([
      {
        className: 'js-drag-over-view__drag-container',
        localName: 'dragContainerElement'
      },
    ]);

    // We bind these methods so we can remove them later
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragOver = this.onDragOver.bind(this);

    this.addDragDropEvents();
  }

  addDragDropEvents() {
    document.body.addEventListener('dragenter', this.onDragEnter);
    document.body.addEventListener('dragleave', this.onDragEnd);
    document.body.addEventListener('dragend', this.onDragEnd);
    document.body.addEventListener('drop', this.onDrop);

    // This method is needed just to prevent default action from
    // the browser
    document.body.addEventListener('dragover', this.onDragOver);
  }

  removeDragDropEvents() {
    document.body.removeEventListener('dragenter', this.onDragEnter);
    document.body.removeEventListener('dragleave', this.onDragEnd);
    document.body.removeEventListener('dragend', this.onDragEnd);
    document.body.removeEventListener('drop', this.onDrop);
  }

  onDragEnter (e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.target !== this.dragContainerElement) {
      this.dragContainerElement.classList.add(IS_HOVERING_CLASSNAME);
    }
  }

  onDragOver (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  onDragEnd(e) {
    e.stopPropagation();
    e.preventDefault();

    if (e.target !== this.dragContainerElement) {
      return;
    }

    this.dragContainerElement.classList.remove(IS_HOVERING_CLASSNAME);
  }

  onDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    this.dragContainerElement.classList.remove(IS_HOVERING_CLASSNAME);

    window.GauntFace.PubSub.fileDropped.dispatch(e.dataTransfer.files[0]);
  }
}

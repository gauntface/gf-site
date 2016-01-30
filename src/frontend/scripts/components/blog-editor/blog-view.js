'use strict';

export default class BlogView {
  constructor() {

  }

  addDOMElements (elements) {
    for (var i = 0; i < elements.length; i++) {
      var className = elements[i].className;
      var localName = elements[i].localName;

      if (!className || !localName) {
        throw new Error('BlogView: Unabled to add DOM Elements. Missing ' +
          'className or localName on index ' + i + '.');
      }

      var domElement = document.querySelector('.' + className);
      if (!domElement) {
        throw new Error('BlogView: Unabled to add DOM Elements. Could not ' +
          'find the DOM element ' + className + '.');
      }

      this[localName] = domElement;
    }
  }
}

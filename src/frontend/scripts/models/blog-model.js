'use strict';

import logger from '../helpers/logger.js';

export default class BlogModel {

  constructor () {
    const postId = this.getPostIdFromURL();
    if (typeof postId !== 'undefined' &&
      postId !== null) {
      this._postId = postId;
    }
  }

  getPostIdFromURL() {
    let path = window.location.pathname;
    path = path.replace(/\/$/, '');
    const pathParts = path.split('/');
    let postId = null;
    if (pathParts.length > 1) {
      postId = parseInt(pathParts[pathParts.length - 1], 10);
    }
    return postId;
  }

  performUpdate () {
    if (!window.GauntFace || !window.GauntFace.PubSub || !window.GauntFace.PubSub.onModelChange) {
      return;
    }

    window.GauntFace.PubSub.onModelChange.dispatch();
  }

  get postId () {
    return this._postId;
  }

  set postId (postId) {
    if (this._postId) {
      throw new Error('Cannot set postId, already defined');
      return;
    }

    this._postId = postId;
  }

  get title () {
    return this._title;
  }

  set title (title) {
    this._title = title;

    this.performUpdate();
  }

  get excerpt () {
    return this._excerpt;
  }

  set excerpt (excerpt) {
    this._excerpt = excerpt;

    this.performUpdate();
  }

  get markdown () {
    return this._markdown;
  }

  set markdown(markdown) {
    this._markdown = markdown;

    this.performUpdate();
  }

  get greyScaleImg () {
    return this._greyScaleImg;
  }

  set greyScaleImg (imgUrl) {
    this._greyScaleImg = imgUrl;

    this.performUpdate();
  }

  get mainImg() {
    return this._mainImg;
  }

  set mainImg (imgUrl) {
    this._mainImg = imgUrl;

    this.performUpdate();
  }

  get mainImgBGColor() {
    return this._mainImgColor;
  }

  set mainImgBGColor(hexString) {
    this._mainImgColor = hexString;

    this.performUpdate();
  }

  getJSONData () {
    var apiData = [];
    apiData.push({key: 'postId', value: this.postId});
    apiData.push({key: 'title', value: this.title});
    apiData.push({key: 'excerpt', value: this.excerpt});
    apiData.push({key: 'markdown', value: this.markdown});
    apiData.push({key: 'greyScaleImg', value: this.greyScaleImg});
    apiData.push({key: 'mainImg', value: this.mainImg});
    apiData.push({key: 'mainImgBGColor', value: this.mainImgBGColor});

    var responseObj = {};
    for (var i = 0; i < apiData.length; i++) {
      var key = apiData[i].key;
      var value = apiData[i].value;
      if (typeof value === 'undefined' || value === null) {
        continue;
      }

      responseObj[key] = value;
    }

    return responseObj;
  }
}

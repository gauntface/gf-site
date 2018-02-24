const moment = require('moment');

class SinglePostModel {
  constructor(input) {
    this._id = input.id;
    this._lastUpdate = input.lastUpdate;
    this._title = input.title;
    this._author = input.author;
    this._excerptMarkdown = input.excerptMarkdown;
    this._bodyMarkdown = input.bodyMarkdown;
    this._mainImage = input.mainImage;
    this._mainImageBgColor = input.mainImageBgColor;
    this._slug = input.slug;
  }

  get id() {
    return this._id || null;
  }

  get lastUpdate() {
    return this._lastUpdate;
  }

  get title() {
    return this._title || null;
  }

  get excerptMarkdown() {
    return this._excerptMarkdown || null;
  }

  get bodyMarkdown() {
    return this._bodyMarkdown || null;
  }

  get mainImage() {
    return this._mainImage || null;
  }

  get mainImageBgColor() {
    return this._mainImageBgColor || null;
  }

  get slug() {
    return this._slug || null;
  }

  getPublishedUrl() {
    const dateString = moment(this._publishDate).format('YYYY/MM/DD');
    return `/blog/${dateString}/${this.slug}`;
  }
}

module.exports = SinglePostModel;

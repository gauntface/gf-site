'use strict';

import BlogView from './blog-view';

export default class MetaDataView extends BlogView {

  constructor(blogModel) {
    super();

    this._blogModel = blogModel;

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
      {
        className: 'js-main-img-current-color',
        localName: 'mainImgCurrentColor'
      },
      {
        className: 'js-main-img-bg-color-options',
        localName: 'mainImgBGColorSelection'
      }
    ]);

    this._blogModel.title = this.titleInput.value;
    this._blogModel.excerpt = this.excerptTextArea.value;
    this._blogModel.greyScaleImg = this.greyScaleImg.attributes.src.value;
    this._blogModel.mainImg = this.mainImg.attributes.src.value;

    this.titleInput.addEventListener('input', () => this.onTitleInputChange());
    this.excerptTextArea.addEventListener('input', () => this.onExcerptInputChange());

    this.mainImg.addEventListener('load', () => this.updateMainImgColors());
    this.updateMainImgColors();
  }

  onTitleInputChange() {
    if (!this._blogModel) {
      return;
    }

    this._blogModel.title = this.titleInput.value;
  }

  onExcerptInputChange() {
    if (!this._blogModel) {
      return;
    }

    this._blogModel.excerpt = this.excerptTextArea.value;
  }

  update() {
    this.greyScaleImg.src = this._blogModel.greyScaleImg || '';
    this.mainImg.src = this._blogModel.mainImg || '';
  }

  updateMainImgColors() {
    // If no src don't try and do anything
    if (!this.mainImg.src  || this.mainImg.src === window.location.href) {
      return;
    }

    // Palette is loaded asynchronously, so may not be loaded
    if (!window.Palette) {
      window.setTimeout(() => {
        this.updateMainImgColors();
      }, 1000);
      return;
    }

    Palette
      .generate(this.mainImg)
      .done((palette) => {
        window.test = palette;
        var accentColors = palette.getAccentColors();
        var keys = Object.keys(accentColors);

        while (this.mainImgBGColorSelection.firstChild) {
          this.mainImgBGColorSelection.removeChild(
            this.mainImgBGColorSelection.firstChild);
        }

        for (var i = 0; i < keys.length; i++) {
          var color = accentColors[keys[i]];
          if (!color) {
            continue;
          }

          var hexString = color.toHex();

          var colorOption = document.createElement('div');
          colorOption.classList.add('blogcreate__color-option-item');
          colorOption.style.backgroundColor =  hexString;

          colorOption.addEventListener('click', ((hexColor) => {
            return () => {
              this.mainImgCurrentColor.style.backgroundColor = hexColor;
              this._blogModel.mainImgBGColor = hexColor;
            };
          })(hexString));

          this.mainImgBGColorSelection.appendChild(colorOption);
        }
      });
  }

}
